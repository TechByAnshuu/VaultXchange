package com.bank.service;

import com.bank.entity.Account;
import com.bank.exception.InvalidAmountException;
import com.bank.repository.AccountRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

// Tests the AccountService logic in isolation using Mockito
@ExtendWith(MockitoExtension.class)
public class AccountServiceTest {

    @Mock
    private AccountRepository accountRepository;

    @InjectMocks
    private AccountService accountService;

    @Test
    void testCreateAccountSuccess() {
        // Given
        Account savedAccount = new Account();
        savedAccount.setId(1L);
        savedAccount.setHolderName("John Doe");
        savedAccount.setAccountNumber("1234567890");

        when(accountRepository.save(any(Account.class))).thenReturn(savedAccount);

        // When
        Account account = accountService.createAccount("John Doe", "john@test.com", new BigDecimal("100.00"));

        // Then
        assertNotNull(account);
        assertEquals(1L, account.getId());
        assertEquals("John Doe", account.getHolderName());
    }

    @Test
    void testCreateAccountNegativeBalanceFails() {
        // Expect an exception if balance is below zero
        assertThrows(InvalidAmountException.class, () -> {
            accountService.createAccount("Bad User", "bad@test.com", new BigDecimal("-50.00"));
        });
    }
}
