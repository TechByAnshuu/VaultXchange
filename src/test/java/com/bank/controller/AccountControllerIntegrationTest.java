package com.bank.controller;

import com.bank.dto.AccountDTO;
import com.bank.entity.Account;
import com.bank.repository.AccountRepository;
import com.bank.repository.TransactionRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

// Full integration test standing up the Spring Context and testing the HTTP endpoints with H2 DB
@SpringBootTest
@AutoConfigureMockMvc
public class AccountControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        transactionRepository.deleteAll();
        accountRepository.deleteAll();
    }

    @Test
    void testCreateAndGetAccountFlow() throws Exception {
        // 1. Create Account via POST
        AccountDTO dto = new AccountDTO("Alice", "alice@test.com", new BigDecimal("500.00"));

        String responseJson = mockMvc.perform(post("/api/accounts")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.holderName").value("Alice"))
                .andExpect(jsonPath("$.balance").value(500.00))
                .andExpect(jsonPath("$.accountNumber").exists())
                .andReturn().getResponse().getContentAsString();

        // Extract generated account number
        String accNum = objectMapper.readTree(responseJson).get("accountNumber").asText();

        // 2. Retrieve the account via GET
        mockMvc.perform(get("/api/accounts/" + accNum))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.holderName").value("Alice"))
                .andExpect(jsonPath("$.balance").value(500.00));
    }
}
