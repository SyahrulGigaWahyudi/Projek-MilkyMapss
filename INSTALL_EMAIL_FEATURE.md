# 📧 Email Password Reset Setup Instructions

## Overview

Your CampusEats project now has a complete password reset feature. Users can:
- Click "Lupa Password?" on login page
- Enter their email
- Receive reset password link via email (or see it in development mode)
- Reset their password securely

## Installation Steps

### Step 1: Install Dependencies

Navigate to the backend folder and install the required packages:

```bash
cd backend
npm install nodemailer dotenv
```

Or if you're using npm 6+:
```bash
npm install
```

This installs:
- **nodemailer** - For sending emails
- **dotenv** - For managing environment variables

### Step 2: Create Environment File

In the `backend` folder, create a `.env` file:

```bash
cp .env.example .env
```

This creates a file with template variables.

### Step 3: Choose Email Configuration

Edit the `.env` file and configure email. Pick **ONE** of these options:

#### ✅ Option 1: Gmail (Recommended - 5 minutes)

**Setup:**
1. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. You need 2-Step Verification enabled
3. Select "Mail" and "Windows Computer"
4. Google generates 16-character password: `xxxx xxxx xxxx xxxx`
5. Copy the password (with spaces)

**Add to `.env`:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx
SMTP_FROM=CampusEats <noreply@campuseats.com>
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

**Example:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=john@gmail.com
SMTP_PASS=abcd efgh ijkl mnop
SMTP_FROM=CampusEats <noreply@campuseats.com>
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

#### ✅ Option 2: Mailtrap (Best for Testing - 5 minutes)

Mailtrap captures emails in a testing inbox. Perfect for development!

**Setup:**
1. Sign up at [mailtrap.io](https://mailtrap.io) (free)
2. Go to Inbox → Settings → SMTP Settings
3. Copy your SMTP credentials
4. Copy API token if needed

**Add to `.env`:**
```env
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your-mailtrap-user-id
SMTP_PASS=your-mailtrap-password
SMTP_FROM=CampusEats <noreply@campuseats.com>
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

#### ✅ Option 3: No Email Provider (Development Mode)

If you don't have email setup, the system works in development mode:
- Reset link displays directly on the page
- User can copy or click the link immediately
- No actual email is sent
- Perfect for quick testing!

**Add to `.env`:**
```env
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

**Note:** Leave SMTP settings empty or don't define them.

### Step 4: Update Database

Add the password reset columns to your database:

**Using MySQL Console:**
```bash
mysql -u root -p campuseats < migrations/add_password_reset_columns.sql
```

Or manually run this SQL:
```sql
ALTER TABLE users
  ADD COLUMN reset_token VARCHAR(255) NULL,
  ADD COLUMN reset_token_expires DATETIME NULL;

CREATE INDEX idx_reset_token ON users(reset_token);
```

### Step 5: Start the Backend

```bash
npm run dev
```

You should see:
```
✓ Email service initialized
Server listening on port 3000
```

### Step 6: Test the Feature

**In Browser:**
1. Open `http://localhost:5173/login`
2. Click "Lupa password?" link
3. Enter a registered email address
4. Choose action:
   - **With Email Configured**: Check your email (Gmail inbox or Mailtrap inbox)
   - **Development Mode**: Copy reset link from page or click "Buka Link" button
5. Click the reset link
6. Enter new password and confirm
7. Successfully reset! Redirect to login

## Features Implemented

### Backend
✅ POST `/api/auth/forgot-password` - Send reset email  
✅ POST `/api/auth/verify-reset-token` - Validate token  
✅ POST `/api/auth/reset-password` - Update password  
✅ Beautiful HTML email template  
✅ 30-minute token expiry  
✅ Secure token hashing  

### Frontend
✅ `/forgot-password` page with email form  
✅ `/reset-password` page with password reset  
✅ Token verification on page load  
✅ Development mode link display  
✅ Real-time form validation  
✅ Loading and success states  

### Security
✅ Tokens hashed with SHA-256  
✅ Tokens never stored in plain text  
✅ 30-minute expiration  
✅ Password minimum 6 characters  
✅ Bcrypt password hashing  
✅ Email verification flow  

## Troubleshooting

### Problem: "Email service not available" warning

**Cause:** SMTP credentials not configured  
**Solution:** 
1. Check `.env` file exists
2. Verify SMTP settings are correct
3. In development mode, links display on page anyway - this is normal!

### Problem: Gmail won't let me log in

**Cause:** Using regular Gmail password instead of App Password  
**Solution:**
1. Use **App Password** (16 characters) from [apppasswords](https://myaccount.google.com/apppasswords)
2. Must have 2-Step Verification enabled
3. Copy password exactly as shown (including spaces)

### Problem: "Invalid login" from Mailtrap

**Cause:** Wrong credentials  
**Solution:**
1. Go to Mailtrap dashboard → Inbox → Settings
2. Copy SMTP username and password exactly
3. Verify SMTP_PORT=2525

### Problem: Email not received in Gmail

**Cause:** Might be in spam folder or delivery issue  
**Solution:**
1. Check spam/junk folder
2. Check backend console for errors
3. Test with Mailtrap instead (easier to debug)
4. Verify email address is correct

### Problem: Nodemailer not found error

**Cause:** Package not installed  
**Solution:**
```bash
npm install nodemailer
```

### Problem: "dotenv is not defined"

**Cause:** dotenv not installed  
**Solution:**
```bash
npm install dotenv
```

## Testing Checklist

- [ ] `.env` file created in `backend` folder
- [ ] SMTP credentials configured (or left blank for dev mode)
- [ ] Database migration applied
- [ ] Backend running without errors
- [ ] Can navigate to `/forgot-password` page
- [ ] Can submit email form
- [ ] Reset link appears (either in email or on page)
- [ ] Can open reset password page
- [ ] Can reset password successfully
- [ ] Redirected to login after reset
- [ ] Can login with new password

## Files Modified/Created

**Created:**
- `backend/.env.example` - Environment variable template
- `backend/src/config/emailService.js` - Email service module
- `frontend/src/pages/ForgotPasswordPage.jsx` - Forgot password page
- `frontend/src/pages/ResetPasswordPage.jsx` - Reset password page
- `migrations/add_password_reset_columns.sql` - Database migration
- `EMAIL_SETUP.md` - Detailed email setup guide
- `SETUP_EMAIL.md` - Quick setup guide

**Modified:**
- `backend/src/Controller/authController.js` - Added password reset endpoints
- `backend/src/routes/auth.js` - Added new routes
- `backend/app.js` - Added .env loading
- `backend/package.json` - Added nodemailer and dotenv
- `frontend/src/pages/LoginPage.jsx` - Added forgot password link
- `frontend/src/pages/ForgotPasswordPage.jsx` - Updated for dev mode
- `frontend/src/services/api.js` - Added API functions
- `frontend/src/App.jsx` - Added routes
- `frontend/src/styles/custom.css` - Added pulse animation

## Production Deployment

When deploying to production:

1. **Use professional email service:**
   - SendGrid (free tier: 100/day)
   - AWS SES (pay-per-use)
   - Postmark
   - Your own mail server

2. **Environment variables:**
   - Set `NODE_ENV=production`
   - Use production email credentials
   - Update `FRONTEND_URL` to production domain

3. **Security:**
   - Enable HTTPS only
   - Store `.env` securely on server
   - Use environment variable secrets from hosting platform
   - Never commit `.env` to git

4. **Monitoring:**
   - Track email delivery rates
   - Monitor bounce rates
   - Set up alerts for failures

## Support

For detailed information, see:
- [EMAIL_SETUP.md](./EMAIL_SETUP.md) - Comprehensive email guide
- [authController.js](./backend/src/Controller/authController.js) - Backend logic
- [emailService.js](./backend/src/config/emailService.js) - Email sending logic
- [ForgotPasswordPage.jsx](./frontend/src/pages/ForgotPasswordPage.jsx) - Frontend page

---

**Next steps:**
1. Run `npm install` in backend folder
2. Copy and configure `.env` file
3. Apply database migration
4. Test the feature!

Happy coding! 🚀
