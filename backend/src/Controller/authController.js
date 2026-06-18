const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/databasis");

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT_SECRET environment variable is required");
const JWT_EXPIRES = "7d";

// POST /api/auth/register
async function register(req, res) {
  const {
    username,
    email,
    password,
    full_name,
    student_id,
    faculty,
    phone_number,
  } = req.body;

  if (!username || !email || !password || !full_name) {
    return res.status(400).json({
      message: "Username, email, password, dan nama lengkap wajib diisi.",
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Format email tidak valid." });
  }
  if (password.length < 8) {
    return res.status(400).json({ message: "Password minimal 8 karakter." });
  }

  try {
    const [existing] = await db.query(
      "SELECT id FROM users WHERE email = ? OR username = ?",
      [email, username]
    );
    if (existing.length > 0) {
      return res.status(409).json({ message: "Email atau username sudah digunakan." });
    }

    const hashed = await bcrypt.hash(password, 12);

    const [userResult] = await db.query(
      "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
      [username, email, hashed, "customer"]
    );
    const userId = userResult.insertId;

    await db.query(
      "INSERT INTO customer_profiles (user_id, full_name, phone_number, faculty, student_id) VALUES (?, ?, ?, ?, ?)",
      [userId, full_name, phone_number || null, faculty || null, student_id || null]
    );

    const token = jwt.sign({ id: userId, role: "customer" }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES,
    });

    res.status(201).json({
      message: "Registrasi berhasil.",
      token,
      user: { id: userId, username, email, role: "customer", full_name },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan server." });
  }
}

// POST /api/auth/login
async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email dan password wajib diisi." });
  }

  try {
    const [rows] = await db.query(
      `SELECT u.*, cp.full_name, cp.phone_number, cp.faculty, cp.student_id, cp.profile_picture
       FROM users u
       LEFT JOIN customer_profiles cp ON cp.user_id = u.id
       WHERE u.email = ? OR u.username = ?`,
      [email, email]
    );

    // Dummy hash untuk mencegah timing attack
    const dummyHash = "$2a$12$dummyhashfortimingxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
    const hash = rows.length > 0 ? rows[0].password : dummyHash;
    const match = await bcrypt.compare(password, hash);

    if (rows.length === 0 || !match) {
      return res.status(401).json({ message: "Email atau password salah." });
    }

    const user = rows[0];

    if (!user.is_active) {
      return res.status(403).json({ message: "Akun tidak aktif." });
    }

    await db.query("UPDATE users SET last_login_at = NOW() WHERE id = ?", [user.id]);

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES,
    });

    res.json({
      message: "Login berhasil.",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        full_name: user.full_name,
        phone_number: user.phone_number,
        faculty: user.faculty,
        student_id: user.student_id,
        profile_picture: user.profile_picture,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan server." });
  }
}

// GET /api/auth/me
async function getMe(req, res) {
  try {
    const [rows] = await db.query(
      `SELECT u.id, u.username, u.email, u.role, u.is_active,
              cp.full_name, cp.phone_number, cp.faculty, cp.student_id, cp.profile_picture
       FROM users u
       LEFT JOIN customer_profiles cp ON cp.user_id = u.id
       WHERE u.id = ?`,
      [req.user.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "User tidak ditemukan." });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan server." });
  }
}

module.exports = { register, login, getMe };