package com.bank.exception;

// Thrown when a transaction amount is zero, negative, or makes no sense
public class InvalidAmountException extends RuntimeException {
    public InvalidAmountException(String message) {
        super(message);
    }
}
