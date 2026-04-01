package com.bank.repository;

import com.bank.entity.Transaction;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

// Spring Data MongoDB handles all queries automatically for the 'transactions' collection
@Repository
public interface TransactionRepository extends MongoRepository<Transaction, String> {

    // Get all transactions where money came from this account
    List<Transaction> findByFromAccountNumber(String accountNumber);

    // Get all transactions where money went into this account
    List<Transaction> findByToAccountNumber(String accountNumber);

    // Get full transaction history for an account — either as sender or receiver
    // Ordered by timestamp descending (newest first)
    List<Transaction> findByFromAccountNumberOrToAccountNumberOrderByTimestampDesc(
            String fromAccountNumber, String toAccountNumber);

    // Get all transactions in the system ordered by recency (bank employee dashboard)
    List<Transaction> findAllByOrderByTimestampDesc();
}
