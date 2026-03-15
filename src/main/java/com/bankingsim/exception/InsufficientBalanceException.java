package com.bankingsim.exception;

// Thrown when an account does not have enough funds to complete the operation
public class InsufficientBalanceException extends RuntimeException {
    public InsufficientBalanceException(String message) {
        super(message);
    }
}
