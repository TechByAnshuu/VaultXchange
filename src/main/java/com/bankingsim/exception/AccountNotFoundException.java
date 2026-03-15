package com.bankingsim.exception;

// Thrown when a bank account cannot be found by ID or account number
public class AccountNotFoundException extends RuntimeException {
    public AccountNotFoundException(String message) {
        super(message);
    }
}
