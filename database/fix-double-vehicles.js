const pool = require('./connection');

async function fixPaths() {
  try {
    const sql = `
      UPDATE inventory
      SET inv_image = REPLACE(inv_image, '/images/vehicles/vehicles/', '/images/vehicles/'),
          inv_thumbnail = REPLACE(inv_thumbnail, '/images/vehicles/vehicles/', '/images/vehicles/')
      WHERE inv_image LIKE '/images/vehicles/vehicles/%'
         OR inv_thumbnail LIKE '/images/vehicles/vehicles/%';
    `;
    const result = await pool.query(sql);
    console.log(`Updated ${result.rowCount} row(s)`);
  } catch (err) {
    console.error('Error fixing paths:', err.message);
  } finally {
    process.exit(0);
  }
}

fixPaths();
