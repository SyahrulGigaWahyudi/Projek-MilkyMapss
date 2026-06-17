# CampusEats Password Reset & Email Setup

## Quick Start

### 1. Install Required Package

```bash
cd backend
npm install nodemailer dotenv
```

### 2. Create `.env` File

Copy the example file:
```bash
cp .env.example .env
```

### 3. Configure Email (Choose One Option)

#### Option A: Gmail (Easiest)
- Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
- Get your App Password (16 characters)
- Update `.env`:
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx
```

#### Option B: Mailtrap (Testing Recommended)
- Sign up at [mailtrap.io](https://mailtrap.io)
- Get SMTP credentials from settings
- Update `.env`:
```
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your-username
SMTP_PASS=your-password
```

#### Option C: Development Mode (No Email Provider)
- Leave SMTP settings blank
- Reset links display on page for testing
- Perfect for local development

### 4. Start Backend

```bash
npm run dev
```

### 5. Test the Feature

1. Go to Login page → "Lupa password?"
2. Enter any registered email
3. In **development mode**: Link displays on page
4. In **production mode**: Check email inbox for reset link

## Features

✅ **Secure Token Generation** - Uses crypto.randomBytes()  
✅ **Hashed Tokens** - Never stored in plain text  
✅ **30-Minute Expiry** - Tokens auto-expire  
✅ **Beautiful Email Template** - Professional HTML design  
✅ **Development Mode** - Link displays on page for testing  
✅ **Error Handling** - Graceful fallbacks if email fails  
✅ **User Feedback** - Clear success/error messages  

## Email Providers

| Provider | Cost | Best For | Setup Time |
|----------|------|----------|-----------|
| **Gmail** | Free | Personal projects | 5 min |
| **Mailtrap** | Free | Development/Testing | 5 min |
| **SendGrid** | Free tier (100/day) | Small projects | 10 min |
| **AWS SES** | Pay-per-use | High volume | 15 min |

## Troubleshooting

### Email not working?
1. Check `.env` file exists and is properly configured
2. Verify SMTP credentials are correct
3. Check backend console for error messages
4. In development: Reset link displays on page anyway

### Gmail giving errors?
- Use **App Password**, not regular password
- Need 2-Step Verification enabled
- Get it from [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)

### No email in inbox?
- Check spam/junk folder
- Verify email address is correct
- Test with Mailtrap (easier to debug)

## How It Works

```
User enters email
    ↓
Backend generates secure token
    ↓
Token saved to database (hashed)
    ↓
Email sent with reset link
    ↓
User clicks link in email
    ↓
Token verified on frontend
    ↓
User enters new password
    ↓
Password updated, token cleared
```

## Environment Variables

```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=CampusEats <noreply@campuseats.com>

# Frontend URL (for reset links)
FRONTEND_URL=http://localhost:5173

# Environment Mode
NODE_ENV=development
```

## For Production Deployment

1. Use production email service (SendGrid, AWS SES, etc.)
2. Set `NODE_ENV=production`
3. Update `FRONTEND_URL` to production domain
4. Store `.env` securely on server
5. Enable HTTPS for password reset links
6. Monitor email delivery rates

## Next Steps

- [📧 Full Email Setup Guide](./EMAIL_SETUP.md)
- [🔐 Password Reset Implementation](./backend/src/config/emailService.js)
- [🎨 Frontend Pages](./frontend/src/pages/ForgotPasswordPage.jsx)

---

**Questions?** Check the EMAIL_SETUP.md for detailed configuration guide!
