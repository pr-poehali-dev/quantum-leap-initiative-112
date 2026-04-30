CREATE TABLE IF NOT EXISTS t_p14924622_quantum_leap_initiat.payments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES t_p14924622_quantum_leap_initiat.users(id),
    payment_id VARCHAR(255) NOT NULL UNIQUE,
    amount NUMERIC(12, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
