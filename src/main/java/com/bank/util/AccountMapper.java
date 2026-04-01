package com.bank.util;

import com.bank.dto.AccountResponseDTO;
import com.bank.entity.Account;
import org.springframework.stereotype.Component;

// Manual mapper to convert between Entity and DTO objects.
// TransactionDTO mapping is now handled directly in TransactionService.toDTO()
// since Transaction no longer holds Account object references.
@Component
public class AccountMapper {

    // Convert Account document to safely exposed Response DTO.
    // id is now String (MongoDB ObjectId) — matches AccountResponseDTO.id type.
    public AccountResponseDTO toAccountResponseDTO(Account account) {
        if (account == null) return null;

        return new AccountResponseDTO(
                account.getId(),           // String ObjectId
                account.getAccountNumber(),
                account.getHolderName(),
                account.getEmail(),
                account.getPhone(),
                account.getBalance(),
                account.getStatus(),
                account.getCreatedAt(),
                account.getPlainTextPassword()  // null except immediately after creation
        );
    }
}
