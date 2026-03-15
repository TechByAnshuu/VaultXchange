package com.bankingsim.entity;

// The three kinds of money movements a bank account supports
public enum TransactionType {
    DEPOSIT,   // money coming in from outside
    WITHDRAW,  // money leaving to outside
    TRANSFER   // internal move from one account to another
}
