/* ***********************************************
 * Database Connection Pool
 * This file creates and exports the connection pool
 * for the PostgreSQL database using environment variables.
 *************************************************/
const { Pool } = require("pg");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

/* ***********************************************
 * Connection Pool
 * SSL Object needed for local testing of app
 * But will cause problems in production
 * If - else will make determination which to use
 *************************************************/
let pool;
// Always enable SSL for Render-managed PostgreSQL (safe locally too)
pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Export helper with logging in development, plain pool otherwise
if (process.env.NODE_ENV === 'development') {
  module.exports = {
    async query(text, params) {
      try {
        const res = await pool.query(text, params);
        console.log("executed query", { text });
        return res;
      } catch (error) {
        console.error("error in query", { text, error: error.message });
        throw error;
      }
    }
  };
} else {
  module.exports = pool;
}
