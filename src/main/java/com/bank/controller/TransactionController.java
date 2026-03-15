package com.bank.controller;

import com.bank.service.TransactionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

// Exposes financial transactions (deposit, withdraw, transfer) to external clients
@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    // Constructor injection matching professor's plain Java style
    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    // Expected JSON body: { "accountNumber": "123456789", "amount": 500.00 }
    @PostMapping("/deposit")
    public ResponseEntity<Map<String, String>> deposit(@RequestBody Map<String, Object> request) {
        String accNo = request.get("accountNumber").toString();
        BigDecimal amount = new BigDecimal(request.get("amount").toString());
        
        transactionService.deposite(accNo, amount);
        return ResponseEntity.ok(Map.of("message", "Deposit successful"));
    }

    // Expected JSON body: { "accountNumber": "123456789", "amount": 200.00 }
    @PostMapping("/withdraw")
    public ResponseEntity<Map<String, String>> withdraw(@RequestBody Map<String, Object> request) {
        String accNo = request.get("accountNumber").toString();
        BigDecimal amount = new BigDecimal(request.get("amount").toString());
        
        transactionService.withdraw(accNo, amount);
        return ResponseEntity.ok(Map.of("message", "Withdrawal successful"));
    }

    // Expected JSON body: { "fromAccount": "111", "toAccount": "222", "amount": 150.00 }
    @PostMapping("/transfer")
    public ResponseEntity<Map<String, String>> transfer(@RequestBody Map<String, Object> request) {
        String fromAcc = request.get("fromAccount").toString();
        String toAcc = request.get("toAccount").toString();
        BigDecimal amount = new BigDecimal(request.get("amount").toString());
        
        transactionService.transfer(fromAcc, toAcc, amount);
        return ResponseEntity.ok(Map.of("message", "Transfer successful"));
    }
}
