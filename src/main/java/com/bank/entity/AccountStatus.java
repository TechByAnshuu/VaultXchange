package com.bank.entity;

// Possible lifecycle states for a bank account
public enum AccountStatus {
    ACTIVE,   // account is fully operational
    INACTIVE, // temporarily suspended by the bank
    CLOSED    // permanently closed, no more transactions allowed
}
