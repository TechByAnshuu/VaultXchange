package com.bank.dto;

import com.bank.entity.AccountStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonInclude;

// Response body returned after any account read or create operation.
// NOTE: password is NEVER included here — security by design.
// plainTextPassword is included ONLY when generated during creation.
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AccountResponseDTO {

    // MongoDB ObjectId string — replaces the old Long auto-increment id
    private String id;
    private String accountNumber;
    private String holderName;
    private String email;
    private String phone;
    private BigDecimal balance;
    private AccountStatus status;
    // Show the client exactly when this account was opened
    private LocalDateTime createdAt;

    // Will be null (and thus omitted from JSON) for all calls EXCEPT creation
    private String plainTextPassword;
}
