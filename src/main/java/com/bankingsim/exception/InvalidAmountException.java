package com.bankingsim.exception;

// Thrown when an amount is zero, negative, or otherwise not allowed
public class InvalidAmountException extends RuntimeException {
    public InvalidAmountException(String message) {
        super(message);
    }
}
