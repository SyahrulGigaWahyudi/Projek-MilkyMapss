const db = require('./src/config/databasis');

async function fixCampuses() {
  try {
    // Update Kampus A
    await db.query(
      `UPDATE campus_locations SET latitude = -6.3627739, longitude = 106.8444527 WHERE name LIKE '%Kampus A%'`
    );
    console.log('✅ Koordinat Kampus A berhasil diupdate ke lokasi yang baru.');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

fixCampuses();
