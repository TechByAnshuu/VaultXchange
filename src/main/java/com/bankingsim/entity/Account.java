package com.bankingsim.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

// JPA entity mapped to the 'accounts' table in MySQL
@Entity
@Table(name = "accounts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Unique bank account number assigned by the system
    @Column(name = "account_number", unique = true, nullable = false, length = 20)
    private String accountNumber;

    @NotBlank(message = "Holder name is required")
    @Column(name = "holder_name", nullable = false, length = 100)
    private String holderName;

    @Email(message = "Must be a valid email address")
    @NotBlank(message = "Email is required")
    @Column(name = "email", nullable = false, length = 100)
    private String email;

    // Balance must never go below zero
    @DecimalMin(value = "0.0", message = "Balance cannot be negative")
    @Column(name = "balance", nullable = false, precision = 19, scale = 2)
    private BigDecimal balance;

    // Auto-populated when the row is first inserted
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // Status tracks if the account is active or closed
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 10)
    @Builder.Default
    private AccountStatus status = AccountStatus.ACTIVE;
}
