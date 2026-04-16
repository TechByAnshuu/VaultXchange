package com.bank.service;

import com.bank.entity.Account;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

// Sends two types of email alerts after every Deposit, Withdrawal, or Transfer:
//   1. Low-balance alert  — when resulting balance <= ALERT_THRESHOLD
//   2. High-amount alert  — when transaction amount  >= ALERT_AMOUNT_THRESHOLD
@Service
public class AlertService {

    private static final Logger log = LoggerFactory.getLogger(AlertService.class);

    private final JavaMailSender mailSender;
    private final BigDecimal balanceThreshold;   // e.g. ₹1000  — from ALERT_THRESHOLD
    private final BigDecimal amountThreshold;    // e.g. ₹5000  — from ALERT_AMOUNT_THRESHOLD

    // Both thresholds read from .env via application.yml — zero hardcoded values
    public AlertService(
            JavaMailSender mailSender,
            @Value("${app.alert.threshold:1000}")        BigDecimal balanceThreshold,
            @Value("${app.alert.amount-threshold:5000}") BigDecimal amountThreshold) {
        this.mailSender       = mailSender;
        this.balanceThreshold = balanceThreshold;
        this.amountThreshold  = amountThreshold;
    }

    // Entry point — called after every Deposit, Withdrawal, Transfer in TransactionService.
    // Runs both checks independently; one failing never blocks the other.
    public void checkAndAlert(Account account, BigDecimal amount, String transactionType) {
        checkLowBalance(account, amount, transactionType);
        checkHighAmount(account, amount, transactionType);
    }

    // ── Alert 1: Low Balance ─────────────────────────────────────────────────
    // Fires when the post-transaction balance is at or below balanceThreshold.
    private void checkLowBalance(Account account, BigDecimal amount, String transactionType) {
        BigDecimal balance = account.getBalance();

        log.debug("Balance check after {} | account={} | balance={} | threshold={}",
                transactionType, account.getAccountNumber(), balance, balanceThreshold);

        if (balance.compareTo(balanceThreshold) <= 0) {
            log.warn("Low-balance alert | type={} | account={} | balance={}",
                    transactionType, account.getAccountNumber(), balance);
            sendEmail(
                    account.getEmail(),
                    "⚠️ VaultXchange: Low Balance Alert",
                    buildLowBalanceBody(account, balance, transactionType),
                    account.getAccountNumber(),
                    "low-balance"
            );
        }
    }

    // ── Alert 2: High-Value Transaction ──────────────────────────────────────
    // Fires when the transaction amount itself is at or above amountThreshold.
    private void checkHighAmount(Account account, BigDecimal amount, String transactionType) {
        log.debug("Amount check after {} | account={} | amount={} | threshold={}",
                transactionType, account.getAccountNumber(), amount, amountThreshold);

        if (amount.compareTo(amountThreshold) >= 0) {
            log.warn("High-amount alert | type={} | account={} | amount={}",
                    transactionType, account.getAccountNumber(), amount);
            sendEmail(
                    account.getEmail(),
                    "🔔 VaultXchange: Large Transaction Alert",
                    buildHighAmountBody(account, amount, transactionType),
                    account.getAccountNumber(),
                    "high-amount"
            );
        }
    }

    // ── Shared email sender ───────────────────────────────────────────────────
    // Exceptions are caught here so a mail failure NEVER blocks the transaction.
    private void sendEmail(String to, String subject, String body,
                           String accountNumber, String alertKind) {
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setTo(to);
            msg.setSubject(subject);
            msg.setText(body);
            mailSender.send(msg);
            log.info("{} alert email sent → {} ({})", alertKind, to, accountNumber);
        } catch (Exception ex) {
            log.error("Failed to send {} alert | account={} | error={}",
                    alertKind, accountNumber, ex.getMessage());
        }
    }

    // ── Email body: Low Balance ───────────────────────────────────────────────
    private String buildLowBalanceBody(Account account, BigDecimal balance, String txType) {
        return String.join("\n",
                "Dear " + account.getHolderName() + ",",
                "",
                "⚠️  LOW BALANCE WARNING",
                "",
                "A recent " + formatType(txType) + " has brought your VaultXchange account",
                "balance below the alert threshold.",
                "",
                "  Account Number  : " + account.getAccountNumber(),
                "  Current Balance : ₹" + balance,
                "  Alert Threshold : ₹" + balanceThreshold,
                "",
                "Please deposit funds at your earliest convenience to avoid",
                "service disruptions.",
                "",
                "If you did not perform this transaction, contact support immediately.",
                "",
                "— VaultXchange Team",
                "  This is an automated message. Please do not reply."
        );
    }

    // ── Email body: High-Value Transaction ────────────────────────────────────
    private String buildHighAmountBody(Account account, BigDecimal amount, String txType) {
        return String.join("\n",
                "Dear " + account.getHolderName() + ",",
                "",
                "🔔  LARGE TRANSACTION DETECTED",
                "",
                "A high-value " + formatType(txType) + " was just processed on your",
                "VaultXchange account.",
                "",
                "  Account Number  : " + account.getAccountNumber(),
                "  Transaction Type: " + formatType(txType),
                "  Amount          : ₹" + amount,
                "  Current Balance : ₹" + account.getBalance(),
                "",
                "If you authorised this transaction, no action is needed.",
                "If you did NOT authorise this, contact support immediately.",
                "",
                "— VaultXchange Team",
                "  This is an automated message. Please do not reply."
        );
    }

    // ── Utility ───────────────────────────────────────────────────────────────
    private String formatType(String transactionType) {
        return switch (transactionType.toUpperCase()) {
            case "DEPOSIT"    -> "Deposit";
            case "WITHDRAWAL" -> "Withdrawal";
            case "TRANSFER"   -> "Transfer";
            default           -> transactionType;
        };
    }
}
