package com.bank.dto;

import com.bank.entity.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

// Response DTO used when returning transaction history to the client.
// Shape is identical to before — frontend does not break.
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionDTO {

    // MongoDB ObjectId string — replaces the old Long auto-increment id
    private String id;
    private TransactionType type;
    private BigDecimal amount;
    private LocalDateTime timestamp;
    // Account number of the sender — null for a pure external deposit
    private String fromAccountNumber;
    private String fromAccountName;
    // Account number of the receiver — null for a pure external withdrawal
    private String toAccountNumber;
    private String toAccountName;
    private String description;
}
