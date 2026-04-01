package com.bank.service;

import com.bank.entity.Account;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

// Service to handle alerts for large transactions
// Email alert logic is available but disabled for basic usage
//       Dependency: add spring-boot-starter-mail + configure SMTP env vars in Render
@Service
public class AlertService {

    private static final Logger log = LoggerFactory.getLogger(AlertService.class);

    private final BigDecimal alertLimit;

    // Constructor injection – alert threshold configured from application properties
    public AlertService(@Value("${app.alert.limit:50000}") BigDecimal alertLimit) {
        this.alertLimit = alertLimit;
    }

    // Checks transaction amount and logs a warning if it exceeds the threshold.
    // Email sending is intentionally disabled during the MongoDB migration phase.
    public void checkAndAlert(Account account, BigDecimal amount, String transactionType) {
        if (amount.compareTo(alertLimit) >= 0) {

            // Console log so Render's log stream shows the alert
            System.out.println("[ALERT] High-value " + transactionType
                    + " of ₹" + amount
                    + " on account " + account.getAccountNumber()
                    + " (" + account.getHolderName() + ")");

            log.warn("High-value transaction alert | type={} | amount={} | account={}",
                    transactionType, amount, account.getAccountNumber());

            // -----------------------------------------------------------------
            // EMAIL CODE COMMENTED OUT — re-enable after SMTP is configured
            // -----------------------------------------------------------------
            // Temporary console logging until email integration is toggled
            //   MAIL_HOST, MAIL_PORT, MAIL_USERNAME, MAIL_PASSWORD
            //
            // SimpleMailMessage msg = new SimpleMailMessage();
            // msg.setTo(account.getEmail());
            // msg.setSubject("VaultXchange Alert: Large " + transactionType);
            // msg.setText("A transaction of ₹" + amount + " was detected on your account.");
            // mailSender.send(msg);
            // -----------------------------------------------------------------
        }
    }
}
