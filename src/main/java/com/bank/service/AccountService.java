package com.bank.service;

import com.bank.entity.Account;
import com.bank.exception.AccountNotFoundException;
import com.bank.exception.InvalidAmountException;
import com.bank.repository.AccountRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

// Service layer handling account business logic
@Service
public class AccountService {

    private final AccountRepository accountRepository;

    // Constructor injection matching professor's plain Java style
    public AccountService(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    // Creates a new account with the given details
    public Account createAccount(String name, String email, BigDecimal openingBalance) throws InvalidAmountException {
        if (openingBalance.compareTo(BigDecimal.ZERO) < 0) {
            throw new InvalidAmountException("Opening balance cannot be negative");
        }
        
        Account account = new Account();
        account.setHolderName(name);
        account.setEmail(email);
        account.setBalance(openingBalance);
        // Generate a random 10-digit account number (simplified for simulation)
        account.setAccountNumber(String.valueOf(Math.abs(UUID.randomUUID().getMostSignificantBits())).substring(0, 10));
        
        return accountRepository.save(account);
    }

    // Retrieves an account by its unique account number
    public Account getAccount(String accountNumber) throws AccountNotFoundException {
        return accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new AccountNotFoundException("Account with number " + accountNumber + " not found"));
    }

    // Returns a list of all accounts in the system
    public List<Account> listAllAccounts() {
        return accountRepository.findAll();
    }
}
