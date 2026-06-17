/**
 * Script Migrasi Foto ke Cloudinary
 * Jalankan SEKALI sebelum deploy:
 * cd backend
 * node migrate_to_cloudinary.js
 */

require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Config Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Config DB
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'campuseats',
};

const uploadsDir = path.join(__dirname, 'uploads');

async function uploadToCloudinary(localPath, folder) {
  try {
    const result = await cloudinary.uploader.upload(localPath, {
      folder: `milkymaps/${folder}`,
      resource_type: 'image',
    });
    return result.secure_url;
  } catch (err) {
    console.error(`  ❌ Gagal upload ${localPath}:`, err.message);
    return null;
  }
}

async function migrate() {
  console.log('🚀 Mulai migrasi foto ke Cloudinary...\n');

  const db = await mysql.createConnection(dbConfig);
  let total = 0, berhasil = 0, gagal = 0;

  // ── 1. Foto tempat makan (thumbnail) ──────────────────
  console.log('📸 Migrasi thumbnail tempat makan...');
  const [foodPlaces] = await db.query(
    "SELECT id, thumbnail FROM food_places WHERE thumbnail LIKE '/uploads/%'"
  );
  console.log(`   Ditemukan ${foodPlaces.length} foto tempat makan\n`);

  for (const fp of foodPlaces) {
    total++;
    const filename = fp.thumbnail.replace('/uploads/', '');
    const localPath = path.join(uploadsDir, filename);

    if (!fs.existsSync(localPath)) {
      console.log(`  ⚠️  File tidak ditemukan: ${filename}`);
      gagal++;
      continue;
    }

    process.stdout.write(`  Uploading ${filename}... `);
    const cloudUrl = await uploadToCloudinary(localPath, 'food-places');

    if (cloudUrl) {
      await db.query('UPDATE food_places SET thumbnail = ? WHERE id = ?', [cloudUrl, fp.id]);
      console.log('✅');
      berhasil++;
    } else {
      gagal++;
    }
  }

  // ── 2. Foto profil user ──────────────────────────────
  console.log('\n👤 Migrasi foto profil user...');
  const [profiles] = await db.query(
    "SELECT user_id, profile_picture FROM customer_profiles WHERE profile_picture LIKE '/uploads/%'"
  );
  console.log(`   Ditemukan ${profiles.length} foto profil\n`);

  for (const p of profiles) {
    total++;
    const filename = p.profile_picture.replace('/uploads/', '');
    const localPath = path.join(uploadsDir, filename);

    if (!fs.existsSync(localPath)) {
      console.log(`  ⚠️  File tidak ditemukan: ${filename}`);
      gagal++;
      continue;
    }

    process.stdout.write(`  Uploading ${filename}... `);
    const cloudUrl = await uploadToCloudinary(localPath, 'avatars');

    if (cloudUrl) {
      await db.query('UPDATE customer_profiles SET profile_picture = ? WHERE user_id = ?', [cloudUrl, p.user_id]);
      console.log('✅');
      berhasil++;
    } else {
      gagal++;
    }
  }

  // ── 3. Foto di food_place_images ────────────────────
  console.log('\n🖼️  Migrasi foto tambahan tempat makan...');
  const [images] = await db.query(
    "SELECT id, image_url FROM food_place_images WHERE image_url LIKE '/uploads/%'"
  );
  console.log(`   Ditemukan ${images.length} foto tambahan\n`);

  for (const img of images) {
    total++;
    const filename = img.image_url.replace('/uploads/', '');
    const localPath = path.join(uploadsDir, filename);

    if (!fs.existsSync(localPath)) {
      console.log(`  ⚠️  File tidak ditemukan: ${filename}`);
      gagal++;
      continue;
    }

    process.stdout.write(`  Uploading ${filename}... `);
    const cloudUrl = await uploadToCloudinary(localPath, 'food-places');

    if (cloudUrl) {
      await db.query('UPDATE food_place_images SET image_url = ? WHERE id = ?', [cloudUrl, img.id]);
      console.log('✅');
      berhasil++;
    } else {
      gagal++;
    }
  }

  await db.end();

  console.log('\n─────────────────────────────────');
  console.log(`✅ Berhasil : ${berhasil} foto`);
  console.log(`❌ Gagal    : ${gagal} foto`);
  console.log(`📊 Total    : ${total} foto`);
  console.log('─────────────────────────────────');
  console.log('\n🎉 Migrasi selesai! Semua URL di database sudah diupdate ke Cloudinary.');
  console.log('   Sekarang bisa deploy ke Railway + Vercel.\n');
}

migrate().catch(err => {
  console.error('💥 Error:', err.message);
  process.exit(1);
});
