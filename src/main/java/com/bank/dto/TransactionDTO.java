package com.bank.dto;

import com.bank.entity.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

// Response DTO used when returning transaction history to the client
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionDTO {

    private Long id;
    private TransactionType type;
    private BigDecimal amount;
    private LocalDateTime timestamp;
    // Account number of the sender – null for pure deposit
    private String fromAccountNumber;
    private String fromAccountName;
    // Account number of the receiver – null for pure withdrawal
    private String toAccountNumber;
    private String toAccountName;
    private String description;
}
