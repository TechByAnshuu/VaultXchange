package com.bank.service;

import com.bank.entity.Account;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

// Service to handle alerts for large transactions
@Service
public class AlertService {

    private static final Logger log = LoggerFactory.getLogger(AlertService.class);
    
    private final BigDecimal alertLimit;

    // Constructor injection configured from application properties/defaults
    public AlertService(@Value("${app.alert.limit:1000}") BigDecimal alertLimit) {
        this.alertLimit = alertLimit;
    }

    // Checks transaction amount and sends alert if it exceeds the limit
    public void checkAndAlert(Account account, BigDecimal amount, String transactionType) {
        if (amount.compareTo(alertLimit) >= 0) {
            System.out.println("ALERT: Large " + transactionType + " of " + amount + " on account " + account.getAccountNumber());
            log.warn("High value transaction alert for account: {}", account.getAccountNumber());
        }
    }
}
