const pool = require('../database/connection');

async function fixImagePaths() {
  try {
    const sql = `
      UPDATE inventory
      SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
          inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/')
      WHERE inv_image NOT LIKE '%/vehicles/%'
    `;
    
    const result = await pool.query(sql);
    console.log('✅ Image paths updated successfully!');
    console.log(`Updated ${result.rowCount} vehicle(s)`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating image paths:', error.message);
    process.exit(1);
  }
}

fixImagePaths();
