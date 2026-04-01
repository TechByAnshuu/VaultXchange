package com.bank.service;

import com.bank.dto.AccountDTO;
import com.bank.entity.Account;
import com.bank.exception.AccountNotFoundException;
import com.bank.exception.InvalidAmountException;
import com.bank.repository.AccountRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

// Service layer handling account business logic
@Service
@SuppressWarnings("null")
public class AccountService {

    private final AccountRepository accountRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    // Constructor injection
    public AccountService(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    // Creates a new account with the given details
    public Account createAccount(AccountDTO dto) throws InvalidAmountException {
        if (dto.getInitialBalance() == null || dto.getInitialBalance().compareTo(BigDecimal.ZERO) < 0) {
            throw new InvalidAmountException("Opening balance cannot be negative");
        }

        Account account = new Account();
        account.setHolderName(dto.getHolderName());
        account.setEmail(dto.getEmail());
        account.setPhone(dto.getPhone());

        if (dto.getDateOfBirth() != null && !dto.getDateOfBirth().trim().isEmpty()) {
            try {
                if (dto.getDateOfBirth().contains("-")) {
                    account.setDateOfBirth(LocalDate.parse(dto.getDateOfBirth()));
                } else {
                    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
                    account.setDateOfBirth(LocalDate.parse(dto.getDateOfBirth(), formatter));
                }
            } catch (Exception e) {
                // Ignore parse errors — DOB is optional
            }
        }

        account.setAddress(dto.getAddress());
        account.setIdType(dto.getIdType());
        account.setIdNumber(dto.getIdNumber());
        account.setBalance(dto.getInitialBalance());

        // Generate a random 10-digit account number
        account.setAccountNumber(
                String.format("%010d",
                        ThreadLocalRandom.current().nextLong(1_000_000_000L, 9_999_999_999L)));

        // Generate pseudo-random password if caller didn't supply one
        String plainPassword = dto.getPassword();
        if (plainPassword == null || plainPassword.trim().isEmpty()) {
            plainPassword = "VX" + UUID.randomUUID().toString().substring(0, 6);
        }

        // Hash it using BCrypt for database storage
        account.setPassword(passwordEncoder.encode(plainPassword));

        Account savedAccount = accountRepository.save(account);

        // Transient field so the controller can send the plain password back exactly once
        savedAccount.setPlainTextPassword(plainPassword);

        return savedAccount;
    }

    // Authenticate a user by account number and password
    public Account login(String accountNumber, String rawPassword) throws AccountNotFoundException {
        Account account = getAccount(accountNumber);
        if (passwordEncoder.matches(rawPassword, account.getPassword())) {
            return account;
        } else {
            throw new RuntimeException("Invalid credentials");
        }
    }

    // Retrieves an account by its unique account number
    public Account getAccount(String accountNumber) throws AccountNotFoundException {
        return accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() ->
                        new AccountNotFoundException("Account with number " + accountNumber + " not found"));
    }

    // Persists an Account document back to MongoDB.
    // Required because MongoDB does NOT have JPA dirty-checking —
    // balance changes made in TransactionService must be explicitly saved.
    public Account save(Account account) {
        return accountRepository.save(account);
    }

    // Returns a list of all accounts in the system
    public List<Account> listAllAccounts() {
        return accountRepository.findAll();
    }
}
