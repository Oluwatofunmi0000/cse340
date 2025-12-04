-- Add Reviews Table for Vehicle Review Enhancement
-- This table stores user reviews for inventory items
CREATE TABLE IF NOT EXISTS review (
    review_id SERIAL PRIMARY KEY,
    inv_id INTEGER NOT NULL REFERENCES inventory(inv_id) ON DELETE CASCADE,
    account_id INTEGER NOT NULL REFERENCES account(account_id) ON DELETE CASCADE,
    review_rating INTEGER NOT NULL CHECK (
        review_rating >= 1
        AND review_rating <= 5
    ),
    review_text TEXT NOT NULL,
    review_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(inv_id, account_id)
);
-- Create index for faster queries by inventory
CREATE INDEX IF NOT EXISTS idx_review_inv_id ON review(inv_id);
CREATE INDEX IF NOT EXISTS idx_review_account_id ON review(account_id);