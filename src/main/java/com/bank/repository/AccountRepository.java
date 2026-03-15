package com.bank.repository;

import com.bank.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

// Spring Data JPA handles all SQL queries automatically for accounts table
@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {

    // Find account by its unique account number string
    Optional<Account> findByAccountNumber(String accountNumber);

    // Find all accounts belonging to a particular email address
    List<Account> findByEmail(String email);

    // Check if an email is already registered before creating a new account
    boolean existsByEmail(String email);
}
