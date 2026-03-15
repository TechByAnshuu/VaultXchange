-- Insert mock accounts for testing purposes
INSERT INTO accounts (account_number, holder_name, email, balance, status) VALUES
('1000000001', 'Alice Johnson', 'alice@test.com', 1500.00, 'ACTIVE'),
('1000000002', 'Bob Smith', 'bob@test.com', 2500.00, 'ACTIVE')
ON DUPLICATE KEY UPDATE id=id;

-- Insert a sample deposit transaction manually (from_account_id is NULL for pure deposit)
INSERT INTO transactions (type, amount, to_account_id, description) VALUES
('DEPOSIT', 1500.00, 1, 'Initial opening deposit for Alice'),
('DEPOSIT', 2500.00, 2, 'Initial opening deposit for Bob');
