const db = require('./src/config/databasis');

async function fixCampuses() {
  try {
    // Update Kampus A
    await db.query(
      `UPDATE campus_locations SET latitude = -6.332611, longitude = 106.841555 WHERE name LIKE '%Kampus A%'`
    );
    // Update Kampus B
    await db.query(
      `UPDATE campus_locations SET latitude = -6.352945, longitude = 106.832631 WHERE name LIKE '%Kampus B%'`
    );
    
    // Jika data belum ada sama sekali, kita buatkan
    const [rows] = await db.query(`SELECT COUNT(*) as count FROM campus_locations`);
    if (rows[0].count === 0) {
      await db.query(`
        INSERT INTO campus_locations (name, address, latitude, longitude) VALUES 
        ('Kampus A STT-NF', 'Jl. Situ Babakan', -6.332611, 106.841555),
        ('Kampus B STT-NF', 'Jl. Lenteng Agung', -6.352945, 106.832631)
      `);
      console.log('✅ Kampus A & B berhasil ditambahkan ke database.');
    } else {
      console.log('✅ Koordinat Kampus A & B berhasil diupdate di database.');
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

fixCampuses();
