package com.bank.service;

import com.bank.entity.Account;
import com.bank.entity.Transaction;
import com.bank.entity.TransactionType;
import com.bank.exception.AccountNotFoundException;
import com.bank.exception.InsufficientBalanceException;
import com.bank.exception.InvalidAmountException;
import com.bank.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;
import com.bank.dto.TransactionDTO;

// Service layer handling deposits, withdrawals, and transfers
@Service
@SuppressWarnings("null")
public class TransactionService {

    private final AccountService accountService;
    private final TransactionRepository transactionRepository;
    private final AlertService alertService;

    // Constructor injection
    public TransactionService(AccountService accountService,
                              TransactionRepository transactionRepository,
                              AlertService alertService) {
        this.accountService = accountService;
        this.transactionRepository = transactionRepository;
        this.alertService = alertService;
    }

    // Deposits money into the specified account
    public void deposite(String accNo, BigDecimal amount)
            throws AccountNotFoundException, InvalidAmountException {

        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidAmountException("Deposit amount must be greater than zero");
        }

        Account account = accountService.getAccount(accNo);
        account.setBalance(account.getBalance().add(amount));
        // Save updated balance back to MongoDB
        accountService.save(account);

        Transaction transaction = Transaction.builder()
                .type(TransactionType.DEPOSIT)
                .amount(amount)
                .toAccountNumber(account.getAccountNumber())
                .toAccountName(account.getHolderName())
                .build();
        transactionRepository.save(transaction);

        alertService.checkAndAlert(account, amount, "DEPOSIT");
    }

    // Withdraws money from the specified account
    public void withdraw(String accNo, BigDecimal amount)
            throws AccountNotFoundException, InvalidAmountException, InsufficientBalanceException {

        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidAmountException("Withdrawal amount must be greater than zero");
        }

        Account account = accountService.getAccount(accNo);
        if (account.getBalance().compareTo(amount) < 0) {
            throw new InsufficientBalanceException("Insufficient funds for withdrawal");
        }

        account.setBalance(account.getBalance().subtract(amount));
        // Save updated balance back to MongoDB
        accountService.save(account);

        Transaction transaction = Transaction.builder()
                .type(TransactionType.WITHDRAW)
                .amount(amount)
                .fromAccountNumber(account.getAccountNumber())
                .fromAccountName(account.getHolderName())
                .build();
        transactionRepository.save(transaction);

        alertService.checkAndAlert(account, amount, "WITHDRAWAL");
    }

    // Transfers money between two accounts
    public void transfer(String fromAcc, String toAcc, BigDecimal amount)
            throws InvalidAmountException, AccountNotFoundException, InsufficientBalanceException {

        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidAmountException("Transfer amount must be greater than zero");
        }

        Account sender = accountService.getAccount(fromAcc);
        Account receiver = accountService.getAccount(toAcc);

        if (sender.getBalance().compareTo(amount) < 0) {
            throw new InsufficientBalanceException("Insufficient funds for transfer");
        }

        sender.setBalance(sender.getBalance().subtract(amount));
        receiver.setBalance(receiver.getBalance().add(amount));

        // Save both updated balances to MongoDB
        accountService.save(sender);
        accountService.save(receiver);

        Transaction transaction = Transaction.builder()
                .type(TransactionType.TRANSFER)
                .amount(amount)
                .fromAccountNumber(sender.getAccountNumber())
                .fromAccountName(sender.getHolderName())
                .toAccountNumber(receiver.getAccountNumber())
                .toAccountName(receiver.getHolderName())
                .build();
        transactionRepository.save(transaction);

        alertService.checkAndAlert(sender, amount, "TRANSFER");
    }

    // Fetches the transaction history for a specific account
    public List<TransactionDTO> getAccountHistory(String accNo) throws AccountNotFoundException {
        // Validate account exists first
        Account account = accountService.getAccount(accNo);
        String accountNumber = account.getAccountNumber();

        List<Transaction> transactions = transactionRepository
                .findByFromAccountNumberOrToAccountNumberOrderByTimestampDesc(
                        accountNumber, accountNumber);

        return transactions.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // Fetches all transactions across all accounts for the bank employee dashboard
    public List<TransactionDTO> getAllTransactions() {
        return transactionRepository.findAllByOrderByTimestampDesc()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // Converts a Transaction document to its DTO — reads denormalized string fields directly
    private TransactionDTO toDTO(Transaction t) {
        TransactionDTO dto = new TransactionDTO();
        dto.setId(t.getId());
        dto.setType(t.getType());
        dto.setAmount(t.getAmount());
        dto.setTimestamp(t.getTimestamp());
        dto.setFromAccountNumber(t.getFromAccountNumber());
        dto.setFromAccountName(t.getFromAccountName());
        dto.setToAccountNumber(t.getToAccountNumber());
        dto.setToAccountName(t.getToAccountName());
        dto.setDescription(t.getDescription());
        return dto;
    }
}
