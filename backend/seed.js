const bcrypt = require('bcryptjs');
const db = require('./src/config/databasis');

async function seedAdmin() {
  const username = 'admin';
  const email = 'admin@milkymaps.com';
  const password = 'admin123'; // <-- ini password admin nya
  const role = 'admin';

  const hashed = await bcrypt.hash(password, 12);

  try {
    // Cek apakah admin sudah ada
    const [existing] = await db.query('SELECT id FROM users WHERE role = "admin" LIMIT 1');
    
    if (existing.length > 0) {
      // Update password admin yang sudah ada
      await db.query('UPDATE users SET password = ?, username = ?, email = ? WHERE id = ?', 
        [hashed, username, email, existing[0].id]);
      console.log('✅ Password admin berhasil direset!');
      console.log(`   ID: ${existing[0].id}`);
    } else {
      // Buat admin baru
      const [result] = await db.query(
        'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
        [username, email, hashed, role]
      );
      console.log('✅ Akun admin berhasil dibuat!');
      console.log(`   ID: ${result.insertId}`);
    }

    console.log(`   Username: ${username}`);
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log('');
    console.log('🔑 Gunakan email atau username untuk login di tab "Admin"');
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

seedAdmin();
