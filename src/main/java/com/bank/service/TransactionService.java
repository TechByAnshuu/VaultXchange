package com.bank.service;

import com.bank.entity.Account;
import com.bank.entity.Transaction;
import com.bank.entity.TransactionType;
import com.bank.exception.AccountNotFoundException;
import com.bank.exception.InsufficientBalanceException;
import com.bank.exception.InvalidAmountException;
import com.bank.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

// Service layer handling deposits, withdrawals, and transfers
@Service
public class TransactionService {

    private final AccountService accountService;
    private final TransactionRepository transactionRepository;
    private final AlertService alertService;

    // Constructor injection matching professor's plain Java style
    public TransactionService(AccountService accountService, TransactionRepository transactionRepository, AlertService alertService) {
        this.accountService = accountService;
        this.transactionRepository = transactionRepository;
        this.alertService = alertService;
    }

    // Deposits money into the specified account
    @Transactional
    public void deposite(String accNo, BigDecimal amount) throws AccountNotFoundException, InvalidAmountException {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidAmountException("Deposit amount must be greater than zero");
        }

        Account account = accountService.getAccount(accNo);
        account.setBalance(account.getBalance().add(amount));

        Transaction transaction = new Transaction();
        transaction.setType(TransactionType.DEPOSIT);
        transaction.setAmount(amount);
        transaction.setToAccount(account);
        transactionRepository.save(transaction);
        
        alertService.checkAndAlert(account, amount, "DEPOSIT");
    }

    // Withdraws money from the specified account
    @Transactional
    public void withdraw(String accNo, BigDecimal amount) throws AccountNotFoundException, InvalidAmountException, InsufficientBalanceException {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidAmountException("Withdrawal amount must be greater than zero");
        }

        Account account = accountService.getAccount(accNo);
        if (account.getBalance().compareTo(amount) < 0) {
            throw new InsufficientBalanceException("Insufficient funds for withdrawal");
        }

        account.setBalance(account.getBalance().subtract(amount));

        Transaction transaction = new Transaction();
        transaction.setType(TransactionType.WITHDRAW);
        transaction.setAmount(amount);
        transaction.setFromAccount(account);
        transactionRepository.save(transaction);
        
        alertService.checkAndAlert(account, amount, "WITHDRAWAL");
    }

    // Transfers money between two accounts
    @Transactional
    public void transfer(String fromAcc, String toAcc, BigDecimal amount) throws InvalidAmountException, AccountNotFoundException, InsufficientBalanceException {
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

        Transaction transaction = new Transaction();
        transaction.setType(TransactionType.TRANSFER);
        transaction.setAmount(amount);
        transaction.setFromAccount(sender);
        transaction.setToAccount(receiver);
        transactionRepository.save(transaction);
        
        alertService.checkAndAlert(sender, amount, "TRANSFER");
    }
}
