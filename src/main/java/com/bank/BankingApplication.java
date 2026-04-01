package com.bank;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

// Entry point for the Banking Simulation Spring Boot application
// @EnableMongoAuditing activates @CreatedDate on Account.createdAt
@SpringBootApplication
@EnableMongoAuditing
public class BankingApplication {
    public static void main(String[] args) {
        SpringApplication.run(BankingApplication.class, args);
    }
}
