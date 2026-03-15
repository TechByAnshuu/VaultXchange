package com.bank.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

// Request body for creating or updating an account
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccountDTO {

    @NotBlank(message = "Holder name is required")
    private String holderName;

    @Email(message = "Must be a valid email")
    @NotBlank(message = "Email is required")
    private String email;

    // Starting balance when creating the account
    @DecimalMin(value = "0.0", message = "Initial balance cannot be negative")
    private BigDecimal initialBalance;
}
