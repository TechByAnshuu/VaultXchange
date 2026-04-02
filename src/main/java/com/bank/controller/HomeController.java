package com.bank.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

/**
 * Handles the root URL to prevent "NoResourceFoundException" in production logs.
 */
@RestController
public class HomeController {

    @GetMapping("/")
    public Map<String, String> home() {
        return Map.of(
            "status", "online",
            "message", "VaultXchange Backend is live",
            "api_docs", "/api/accounts"
        );
    }
}
