CREATE TABLE IF NOT EXISTS accounts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    account_number VARCHAR(20) UNIQUE NOT NULL,
    holder_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    balance DECIMAL(19,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(10) NOT NULL DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(20) NOT NULL,
    amount DECIMAL(19,2) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    from_account_id BIGINT,
    to_account_id BIGINT,
    description VARCHAR(255),
    CONSTRAINT fk_from FOREIGN KEY (from_account_id) REFERENCES accounts(id),
    CONSTRAINT fk_to FOREIGN KEY (to_account_id) REFERENCES accounts(id)
);
