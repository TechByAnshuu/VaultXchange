package com.bank.controller;

import com.bank.dto.AccountDTO;
import com.bank.dto.AccountResponseDTO;
import com.bank.entity.Account;
import com.bank.service.AccountService;
import com.bank.util.AccountMapper;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

// Exposes Account logic via RESTful APIs for the React frontend
@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    private final AccountService accountService;
    private final AccountMapper mapper;

    // Constructor injection
    public AccountController(AccountService accountService, AccountMapper mapper) {
        this.accountService = accountService;
        this.mapper = mapper;
    }

    // List all accounts
    @GetMapping
    public ResponseEntity<List<AccountResponseDTO>> getAllAccounts() {
        List<AccountResponseDTO> accounts = accountService.listAllAccounts().stream()
                .map(mapper::toAccountResponseDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(accounts);
    }

    // Get a specific account details by account number
    @GetMapping("/{accountNumber}")
    public ResponseEntity<AccountResponseDTO> getAccount(@PathVariable String accountNumber) {
        Account account = accountService.getAccount(accountNumber);
        return ResponseEntity.ok(mapper.toAccountResponseDTO(account));
    }

    // Create a new account
    @PostMapping
    public ResponseEntity<AccountResponseDTO> createAccount(@Valid @RequestBody AccountDTO dto) {
        Account newAccount = accountService.createAccount(
                dto.getHolderName(),
                dto.getEmail(),
                dto.getInitialBalance()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(mapper.toAccountResponseDTO(newAccount));
    }
}
