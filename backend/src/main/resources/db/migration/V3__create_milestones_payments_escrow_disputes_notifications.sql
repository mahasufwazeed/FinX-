-- FINX Migration V3: Milestones, Deliverables, Payments, Escrow Accounts, Escrow Ledger, Disputes & Notifications
-- Platform: B2B Milestone-based Fiat Escrow Platform

-- 1. Milestones Table
CREATE TABLE IF NOT EXISTS milestones (
    id UUID PRIMARY KEY,
    deal_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    sequence INT NOT NULL DEFAULT 1,
    amount NUMERIC(15, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    due_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_milestones_deal FOREIGN KEY (deal_id) REFERENCES deals(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_milestones_deal_id ON milestones(deal_id);
CREATE INDEX IF NOT EXISTS idx_milestones_status ON milestones(status);
CREATE INDEX IF NOT EXISTS idx_milestones_sequence ON milestones(deal_id, sequence);

-- 2. Deliverables Table
CREATE TABLE IF NOT EXISTS deliverables (
    id UUID PRIMARY KEY,
    milestone_id UUID NOT NULL,
    submitted_by UUID NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID,
    rejection_reason TEXT,
    CONSTRAINT fk_deliverables_milestone FOREIGN KEY (milestone_id) REFERENCES milestones(id) ON DELETE CASCADE,
    CONSTRAINT fk_deliverables_submitter FOREIGN KEY (submitted_by) REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT fk_deliverables_reviewer FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_deliverables_milestone_id ON deliverables(milestone_id);
CREATE INDEX IF NOT EXISTS idx_deliverables_submitted_by ON deliverables(submitted_by);
CREATE INDEX IF NOT EXISTS idx_deliverables_status ON deliverables(status);

-- 3. Payments Table
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY,
    deal_id UUID NOT NULL,
    milestone_id UUID NOT NULL,
    buyer_id UUID NOT NULL,
    amount NUMERIC(15, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    provider VARCHAR(50) NOT NULL DEFAULT 'RAZORPAY',
    provider_order_id VARCHAR(255),
    provider_payment_id VARCHAR(255),
    provider_signature VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    idempotency_key VARCHAR(255) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_payments_deal FOREIGN KEY (deal_id) REFERENCES deals(id) ON DELETE RESTRICT,
    CONSTRAINT fk_payments_milestone FOREIGN KEY (milestone_id) REFERENCES milestones(id) ON DELETE RESTRICT,
    CONSTRAINT fk_payments_buyer FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_payments_deal_id ON payments(deal_id);
CREATE INDEX IF NOT EXISTS idx_payments_milestone_id ON payments(milestone_id);
CREATE INDEX IF NOT EXISTS idx_payments_buyer_id ON payments(buyer_id);
CREATE INDEX IF NOT EXISTS idx_payments_provider_order_id ON payments(provider_order_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- 4. Escrow Accounts Table (1-to-1 with Deals)
CREATE TABLE IF NOT EXISTS escrow_accounts (
    id UUID PRIMARY KEY,
    deal_id UUID NOT NULL UNIQUE,
    balance NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_escrow_accounts_deal FOREIGN KEY (deal_id) REFERENCES deals(id) ON DELETE RESTRICT,
    CONSTRAINT chk_escrow_balance_non_negative CHECK (balance >= 0.00)
);

CREATE INDEX IF NOT EXISTS idx_escrow_accounts_deal_id ON escrow_accounts(deal_id);
CREATE INDEX IF NOT EXISTS idx_escrow_accounts_status ON escrow_accounts(status);

-- 5. Escrow Ledger Table (Double-entry / Immutable audit record)
CREATE TABLE IF NOT EXISTS escrow_ledger (
    id UUID PRIMARY KEY,
    escrow_account_id UUID NOT NULL,
    payment_id UUID,
    milestone_id UUID,
    transaction_type VARCHAR(50) NOT NULL,
    amount NUMERIC(15, 2) NOT NULL,
    balance_after NUMERIC(15, 2) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_escrow_ledger_account FOREIGN KEY (escrow_account_id) REFERENCES escrow_accounts(id) ON DELETE RESTRICT,
    CONSTRAINT fk_escrow_ledger_payment FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE SET NULL,
    CONSTRAINT fk_escrow_ledger_milestone FOREIGN KEY (milestone_id) REFERENCES milestones(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_escrow_ledger_account_id ON escrow_ledger(escrow_account_id);
CREATE INDEX IF NOT EXISTS idx_escrow_ledger_milestone_id ON escrow_ledger(milestone_id);
CREATE INDEX IF NOT EXISTS idx_escrow_ledger_type ON escrow_ledger(transaction_type);
CREATE INDEX IF NOT EXISTS idx_escrow_ledger_created_at ON escrow_ledger(created_at);

-- 6. Disputes Table
CREATE TABLE IF NOT EXISTS disputes (
    id UUID PRIMARY KEY,
    deal_id UUID NOT NULL,
    milestone_id UUID,
    raised_by UUID NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'OPEN',
    resolution_notes TEXT,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_disputes_deal FOREIGN KEY (deal_id) REFERENCES deals(id) ON DELETE RESTRICT,
    CONSTRAINT fk_disputes_milestone FOREIGN KEY (milestone_id) REFERENCES milestones(id) ON DELETE SET NULL,
    CONSTRAINT fk_disputes_raised_by FOREIGN KEY (raised_by) REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT fk_disputes_resolved_by FOREIGN KEY (resolved_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_disputes_deal_id ON disputes(deal_id);
CREATE INDEX IF NOT EXISTS idx_disputes_status ON disputes(status);

-- 7. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY,
    recipient_user_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    route VARCHAR(255),
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notifications_recipient FOREIGN KEY (recipient_user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(recipient_user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);
