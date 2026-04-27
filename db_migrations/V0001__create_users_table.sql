CREATE TABLE t_p14924622_quantum_leap_initiat.users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  balance NUMERIC(12,2) DEFAULT 0,
  referral_code VARCHAR(32) UNIQUE,
  referred_by INTEGER REFERENCES t_p14924622_quantum_leap_initiat.users(id),
  session_token VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);