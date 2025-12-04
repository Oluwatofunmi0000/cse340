const pool = require("../database/connection");

/* *****************************
 * Get all reviews for a specific vehicle
 * ***************************** */
async function getReviewsByInventory(inv_id) {
  try {
    const sql = `
      SELECT r.review_id, r.review_rating, r.review_text, r.review_created_at,
             a.account_firstname, a.account_lastname, a.account_id
      FROM review r
      JOIN account a ON r.account_id = a.account_id
      WHERE r.inv_id = $1
      ORDER BY r.review_created_at DESC
    `;
    const result = await pool.query(sql, [inv_id]);
    return result.rows;
  } catch (error) {
    console.error("getReviewsByInventory error: " + error.message);
    return [];
  }
}

/* *****************************
 * Get review statistics for a vehicle (average rating, count)
 * ***************************** */
async function getReviewStats(inv_id) {
  try {
    const sql = `
      SELECT 
        COUNT(*) as review_count,
        ROUND(AVG(review_rating)::numeric, 1) as average_rating
      FROM review
      WHERE inv_id = $1
    `;
    const result = await pool.query(sql, [inv_id]);
    return result.rows[0];
  } catch (error) {
    console.error("getReviewStats error: " + error.message);
    return { review_count: 0, average_rating: 0 };
  }
}

/* *****************************
 * Add a new review
 * ***************************** */
async function addReview(inv_id, account_id, review_rating, review_text) {
  try {
    const sql = `
      INSERT INTO review (inv_id, account_id, review_rating, review_text)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const result = await pool.query(sql, [inv_id, account_id, review_rating, review_text]);
    return result.rows[0];
  } catch (error) {
    console.error("addReview error: " + error.message);
    throw error;
  }
}

/* *****************************
 * Get a single review by review_id
 * ***************************** */
async function getReviewById(review_id) {
  try {
    const sql = "SELECT * FROM review WHERE review_id = $1";
    const result = await pool.query(sql, [review_id]);
    return result.rows[0];
  } catch (error) {
    console.error("getReviewById error: " + error.message);
    return null;
  }
}

/* *****************************
 * Delete a review
 * ***************************** */
async function deleteReview(review_id) {
  try {
    const sql = "DELETE FROM review WHERE review_id = $1 RETURNING *";
    const result = await pool.query(sql, [review_id]);
    return result.rows[0];
  } catch (error) {
    console.error("deleteReview error: " + error.message);
    throw error;
  }
}

/* *****************************
 * Check if user already reviewed this vehicle
 * ***************************** */
async function checkExistingReview(inv_id, account_id) {
  try {
    const sql = "SELECT review_id FROM review WHERE inv_id = $1 AND account_id = $2";
    const result = await pool.query(sql, [inv_id, account_id]);
    return result.rows[0];
  } catch (error) {
    console.error("checkExistingReview error: " + error.message);
    return null;
  }
}

module.exports = {
  getReviewsByInventory,
  getReviewStats,
  addReview,
  getReviewById,
  deleteReview,
  checkExistingReview,
};
