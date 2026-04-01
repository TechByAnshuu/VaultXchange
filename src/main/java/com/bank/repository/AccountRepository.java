package com.bank.repository;

import com.bank.entity.Account;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

// Spring Data MongoDB handles all queries automatically for the 'accounts' collection
@Repository
public interface AccountRepository extends MongoRepository<Account, String> {

    // Find account by its unique account number string
    Optional<Account> findByAccountNumber(String accountNumber);

    // Find all accounts belonging to a particular email address
    List<Account> findByEmail(String email);

    // Check if an email is already registered before creating a new account
    boolean existsByEmail(String email);

    // Check if an account number is already in use
    boolean existsByAccountNumber(String accountNumber);
}
