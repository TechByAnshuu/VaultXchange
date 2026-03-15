package com.bank.entity;

// Three operation types that a transaction can represent
public enum TransactionType {
    DEPOSIT,   // money credited from outside the system
    WITHDRAW,  // money debited to outside the system
    TRANSFER   // internal move between two accounts
}
