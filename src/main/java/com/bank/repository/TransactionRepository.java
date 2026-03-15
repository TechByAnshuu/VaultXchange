package com.bank.repository;

import com.bank.entity.Account;
import com.bank.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

// Spring Data JPA handles all SQL queries automatically for transactions table
@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    // Get all transactions where money came from this account
    List<Transaction> findByFromAccount(Account account);

    // Get all transactions where money went into this account
    List<Transaction> findByToAccount(Account account);

    // Get full transaction history for an account – either side of the move
    List<Transaction> findByFromAccountOrToAccountOrderByTimestampDesc(Account from, Account to);
}
