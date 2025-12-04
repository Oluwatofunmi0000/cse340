const pool = require('../database/connection');

async function checkImagePaths() {
  try {
    const sql = `SELECT inv_id, inv_make, inv_model, inv_image FROM inventory LIMIT 5`;
    const result = await pool.query(sql);
    console.log('Current image paths in database:');
    result.rows.forEach(row => {
      console.log(`${row.inv_make} ${row.inv_model}: ${row.inv_image}`);
    });
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkImagePaths();
