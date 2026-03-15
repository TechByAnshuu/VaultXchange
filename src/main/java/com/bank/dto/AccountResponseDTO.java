package com.bank.dto;

import com.bank.entity.AccountStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

// Response body returned after any account read or create operation
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccountResponseDTO {

    private Long id;
    private String accountNumber;
    private String holderName;
    private String email;
    private BigDecimal balance;
    private AccountStatus status;
    // Show the client exactly when this account was opened
    private LocalDateTime createdAt;
}
