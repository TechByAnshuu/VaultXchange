package com.bank.service;

import com.bank.dto.AccountDTO;
import com.bank.entity.Account;
import com.bank.exception.AccountNotFoundException;
import com.bank.exception.InvalidAmountException;
import com.bank.repository.AccountRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder; // from spring-security-crypto
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

// Service layer handling account business logic
@Service
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
                    account.setDateOfBirth(LocalDate.parse(dto.getDateOfBirth())); // usually YYYY-MM-DD from HTML5
                } else {
                    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
                    account.setDateOfBirth(LocalDate.parse(dto.getDateOfBirth(), formatter));
                }
            } catch (Exception e) {
                // Ignore parse errors
            }
        }
        
        account.setAddress(dto.getAddress());
        account.setIdType(dto.getIdType());
        account.setIdNumber(dto.getIdNumber());
        account.setBalance(dto.getInitialBalance());

        // Generate a random 10-digit account number
        account.setAccountNumber(String.format("%010d", ThreadLocalRandom.current().nextLong(1_000_000_000L, 9_999_999_999L)));
        
        // Generate pseudo-random password if caller didn't supply one
        String plainPassword = dto.getPassword();
        if (plainPassword == null || plainPassword.trim().isEmpty()) {
            plainPassword = "VX" + UUID.randomUUID().toString().substring(0, 6);
        }
        
        // Hash it using BCrypt for database storage
        account.setPassword(passwordEncoder.encode(plainPassword));
        
        Account savedAccount = accountRepository.save(account);
        // Transient field so the controller can send it back exactly once
        savedAccount.setPlainTextPassword(plainPassword);
        
        return savedAccount;
    }

    // Authenticate a user
    public Account login(String accountNumber, String rawPassword) throws AccountNotFoundException {
        Account account = getAccount(accountNumber);
        if (passwordEncoder.matches(rawPassword, account.getPassword())) {
            return account;
        } else {
            // Throw generic exception for now, handled by GlobalExceptionHandler if needed
            throw new RuntimeException("Invalid credentials");
        }
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
