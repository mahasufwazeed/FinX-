-- FINX Migration V2: B2B Deals Table
-- Platform: B2B Milestone-based Fiat Escrow Platform

CREATE TABLE IF NOT EXISTS deals (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    buyer_id UUID NOT NULL,
    seller_id UUID NOT NULL,
    total_amount NUMERIC(15, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_deals_buyer FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT fk_deals_seller FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_deals_buyer_id ON deals(buyer_id);
CREATE INDEX IF NOT EXISTS idx_deals_seller_id ON deals(seller_id);
CREATE INDEX IF NOT EXISTS idx_deals_status ON deals(status);
CREATE INDEX IF NOT EXISTS idx_deals_created_at ON deals(created_at);
