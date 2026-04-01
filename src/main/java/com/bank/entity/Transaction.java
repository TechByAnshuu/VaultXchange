package com.bank.entity;

import jakarta.validation.constraints.DecimalMin;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;

// MongoDB document recording every monetary movement: deposit, withdraw, or transfer
@Document(collection = "transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transaction {

    // MongoDB ObjectId stored as a hex string
    @Id
    private String id;

    // Stored as a string in MongoDB (DEPOSIT / WITHDRAW / TRANSFER)
    private TransactionType type;

    @DecimalMin(value = "0.01", message = "Amount must be greater than zero")
    private BigDecimal amount;

    // Automatically stamped with current time when the document is saved
    @CreatedDate
    private LocalDateTime timestamp;

    // Denormalized — storing account number strings instead of @DBRef references
    // Avoids extra round-trips and foreign-key complexity that doesn't exist in MongoDB

    // Source account number — null for a pure external deposit
    private String fromAccountNumber;

    // Source account display name — denormalized for fast history display
    private String fromAccountName;

    // Destination account number — null for a pure external withdrawal
    private String toAccountNumber;

    // Destination account display name — denormalized for fast history display
    private String toAccountName;

    // Optional note the user can attach to describe the transaction
    private String description;
}
