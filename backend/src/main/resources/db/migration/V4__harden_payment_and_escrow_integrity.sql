-- Prevent duplicate financial events even if two application requests race.
ALTER TABLE escrow_accounts
    ADD COLUMN IF NOT EXISTS version BIGINT NOT NULL DEFAULT 0;

CREATE UNIQUE INDEX IF NOT EXISTS uk_payments_provider_order_id
    ON payments (provider_order_id);

CREATE UNIQUE INDEX IF NOT EXISTS uk_escrow_ledger_payment_id
    ON escrow_ledger (payment_id);

CREATE UNIQUE INDEX IF NOT EXISTS uk_escrow_ledger_milestone_type
    ON escrow_ledger (milestone_id, transaction_type);
