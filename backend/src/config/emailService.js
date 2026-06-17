require('dotenv').config();
const nodemailer = require('nodemailer');

// Initialize transporter
let transporter = null;

const initializeMailer = () => {
  if (transporter) return transporter;

  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn('⚠ SMTP credentials are missing. Set SMTP_USER and SMTP_PASS in .env.');
      return null;
    }

    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    transporter.verify((error, success) => {
      if (error) {
        console.error('✗ Email service verification failed:', error.message);
      } else {
        console.log('✓ Email service verified');
      }
    });

    console.log('✓ Email service initialized');
    return transporter;
  } catch (err) {
    console.error('✗ Email service initialization failed:', err.message);
    return null;
  }
};

// Reset password email helper removed

// Send welcome email (optional)
const sendWelcomeEmail = async (email, fullName) => {
  try {
    const mailer = initializeMailer();
    
    if (!mailer) return true;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; border-radius: 8px; }
            .header { background: linear-gradient(135deg, #ff5f00 0%, #a63b00 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
            .content { background: white; padding: 20px; border-radius: 0 0 8px 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🍽️ Selamat Datang di CampusEats</h1>
            </div>
            <div class="content">
              <h2>Halo ${fullName || 'Mahasiswa'},</h2>
              <p>Terima kasih telah mendaftar di CampusEats! Akun Anda telah berhasil dibuat.</p>
              <p>Sekarang Anda dapat:</p>
              <ul>
                <li>Mengeksplorasi restoran dan warung makan di kampus</li>
                <li>Melihat menu dan harga terbaru</li>
                <li>Memberikan review dan rating</li>
                <li>Menyimpan favorit Anda</li>
              </ul>
              <p>Selamat menikmati! 😋</p>
              <p>© 2026 CampusEats</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.SMTP_FROM || 'CampusEats <noreply@campuseats.com>',
      to: email,
      subject: 'Selamat Datang ke CampusEats!',
      html: htmlContent,
    };

    await mailer.sendMail(mailOptions);
    console.log('✓ Welcome email sent to', email);
    return true;
  } catch (err) {
    console.error('✗ Failed to send welcome email:', err.message);
    return false;
  }
};

module.exports = {
  initializeMailer,
  sendWelcomeEmail,
};
