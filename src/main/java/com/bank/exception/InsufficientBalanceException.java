package com.bank.exception;

// Thrown when the account balance is too low to complete the operation
public class InsufficientBalanceException extends RuntimeException {
    public InsufficientBalanceException(String message) {
        super(message);
    }
}
