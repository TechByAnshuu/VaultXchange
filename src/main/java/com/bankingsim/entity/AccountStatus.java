package com.bankingsim.entity;

// Possible states of a bank account
public enum AccountStatus {
    ACTIVE,   // account is usable for transactions
    INACTIVE, // account is disabled by the bank
    CLOSED    // account has been permanently closed
}
