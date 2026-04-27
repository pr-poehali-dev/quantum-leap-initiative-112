CREATE TABLE t_p14924622_quantum_leap_initiat.transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES t_p14924622_quantum_leap_initiat.users(id),
  type VARCHAR(32) NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  description VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);