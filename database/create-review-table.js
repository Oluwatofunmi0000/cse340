const pool = require("./connection");

async function createReviewTable() {
  try {
    console.log("Creating review table...");
    
    const sql = `
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
      
      CREATE INDEX IF NOT EXISTS idx_review_inv_id ON review(inv_id);
      CREATE INDEX IF NOT EXISTS idx_review_account_id ON review(account_id);
    `;
    
    // Execute each statement separately
    const statements = sql.split(';').filter(s => s.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        await pool.query(statement.trim());
        console.log("✅ Executed:", statement.trim().substring(0, 50) + "...");
      }
    }
    
    console.log("✅ Review table created successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating review table:", error.message);
    process.exit(1);
  }
}

createReviewTable();
