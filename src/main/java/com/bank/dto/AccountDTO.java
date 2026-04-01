package com.bank.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

// Request body for creating a new account — includes full KYC fields
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccountDTO {

    @NotBlank(message = "Holder name is required")
    private String holderName;

    @Email(message = "Must be a valid email")
    @NotBlank(message = "Email is required")
    private String email;

    // 10-digit Indian mobile number
    private String phone;

    // Date of birth as string DD/MM/YYYY or ISO (parsed in service)
    private String dateOfBirth;

    // Residential address
    private String address;

    // Government ID type: AADHAR, PAN, PASSPORT
    private String idType;

    // Government ID number
    private String idNumber;

    // Initial balance when creating the account
    @DecimalMin(value = "0.0", message = "Initial balance cannot be negative")
    private BigDecimal initialBalance;

    // Optional: client-provided password. If null/empty, backend generates one.
    private String password;
}
