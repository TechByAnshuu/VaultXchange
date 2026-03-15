package com.bank.util;

import com.bank.dto.AccountDTO;
import com.bank.dto.AccountResponseDTO;
import com.bank.dto.TransactionDTO;
import com.bank.entity.Account;
import com.bank.entity.Transaction;
import org.springframework.stereotype.Component;

// Manual mapper to convert between Entity and DTO objects
@Component
public class AccountMapper {

    // Convert Account entity to safely exposed Response DTO
    public AccountResponseDTO toAccountResponseDTO(Account account) {
        if (account == null) return null;
        
        return new AccountResponseDTO(
                account.getId(),
                account.getAccountNumber(),
                account.getHolderName(),
                account.getEmail(),
                account.getBalance(),
                account.getStatus(),
                account.getCreatedAt()
        );
    }
    
    // Convert Transaction entity to safely exposed Response DTO
    public TransactionDTO toTransactionDTO(Transaction tx) {
        if (tx == null) return null;
        
        String fromAcc = (tx.getFromAccount() != null) ? tx.getFromAccount().getAccountNumber() : null;
        String toAcc = (tx.getToAccount() != null) ? tx.getToAccount().getAccountNumber() : null;
        
        return new TransactionDTO(
                tx.getId(),
                tx.getType(),
                tx.getAmount(),
                tx.getTimestamp(),
                fromAcc,
                toAcc,
                tx.getDescription()
        );
    }
}
