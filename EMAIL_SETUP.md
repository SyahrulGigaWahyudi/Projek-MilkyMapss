# Email Setup Guide - CampusEats Password Reset

This guide explains how to set up email functionality for the password reset feature in CampusEats.

## Quick Setup for Development

### Option 1: Using Gmail (Recommended for Development)

1. **Install Nodemailer** (if not already installed):
```bash
cd backend
npm install nodemailer
```

2. **Enable Gmail App Passwords**:
   - Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
   - You must have 2-Step Verification enabled on your account
   - Select "Mail" and "Windows Computer" (or your device)
   - Google will generate a 16-character app password
   - Copy this password

3. **Create `.env` file in backend directory**:
```bash
cd backend
cp .env.example .env
```

4. **Update `.env` with your Gmail settings**:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx    # The 16-character app password (spaces included)
SMTP_FROM=CampusEats <noreply@campuseats.com>
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### Option 2: Using Mailtrap (Free Inbox Testing)

Mailtrap is perfect for testing email without sending real emails.

1. **Sign up at** [mailtrap.io](https://mailtrap.io)

2. **Create a new Email Testing Inbox**

3. **Get SMTP credentials from Mailtrap**:
   - Go to Inbox Settings → SMTP Settings
   - Copy the credentials

4. **Update `.env` file**:
```env
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your-mailtrap-username
SMTP_PASS=your-mailtrap-password
SMTP_FROM=CampusEats <noreply@campuseats.com>
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### Option 3: Development Mode (No Email Provider)

If you don't want to set up email, the system works in **development mode**:

1. **Leave SMTP settings empty** in `.env`

2. **The reset link will be displayed directly on the page** during testing:
   - User enters email and submits form
   - Frontend displays the reset link
   - User can copy or click the link directly
   - No actual email is sent

To enable development mode:
```env
NODE_ENV=development
```

## How It Works

### Password Reset Flow:

1. **User requests password reset**:
   - User enters email on `/forgot-password` page
   - Backend generates a secure token (32 random bytes)
   - Token is hashed and stored in database with 30-minute expiry

2. **Email is sent** (in production/with email configured):
   - Beautiful HTML email with reset link
   - Link includes the reset token
   - Email remains in inbox if configuration missing

3. **Token verification** on `/reset-password` page:
   - System verifies token is valid and not expired
   - Displays user's email for confirmation

4. **Password reset**:
   - User enters new password
   - System validates password strength
   - Password is hashed and updated in database
   - Reset token is cleared from database

## Testing in Development

### With Email Configured:

1. Start the backend:
```bash
cd backend
npm run dev
```

2. Go to `/forgot-password` page

3. Enter your test email

4. **Check your email inbox** (or Mailtrap inbox) for the reset link

5. Click the link to reset your password

### Without Email (Development Mode):

1. The reset link is displayed on the page immediately

2. Click the "Buka Link" button or copy the link

3. Complete the password reset process

## Troubleshooting

### "Email service not available" warning

This means:
- SMTP credentials are not configured in `.env`
- Email service will still work in development mode
- Reset link is displayed on the page for testing

### Gmail "Less secure app access" error

Gmail blocks app passwords for less secure apps. Solution:
- Use an **App Password** instead of your regular password
- Enable 2-Step Verification on your Gmail account
- Get app password from [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)

### "Invalid login" error from Mailtrap

- Check that SMTP_USER and SMTP_PASS are correct
- Copy credentials directly from Mailtrap dashboard
- Don't include extra spaces

### Email not sending but no error

- Check backend console for error logs
- Verify SMTP settings are correct
- Test internet connection
- Some emails might go to spam folder

## Email Template

The reset password email includes:

✅ Beautiful HTML design with gradient header  
✅ Clear call-to-action button  
✅ Direct link for copying  
✅ 30-minute expiry warning  
✅ Security notice  
✅ Footer with company info  

## Security Notes

- ✅ Tokens are hashed before storage (never stored in plain text)
- ✅ Tokens expire after 30 minutes
- ✅ Tokens are cleared after password reset
- ✅ Email addresses are never revealed (security)
- ✅ Password must be at least 6 characters
- ✅ Passwords are hashed with bcrypt

## For Production

When deploying to production:

1. **Set NODE_ENV=production** to disable development mode
2. **Use a professional email service**:
   - AWS SES
   - SendGrid
   - Postmark
   - Your own mail server
3. **Update FRONTEND_URL** to your production domain
4. **Use strong SMTP credentials** (store securely in environment)
5. **Enable HTTPS** for password reset links
6. **Monitor email delivery** and bounce rates

## Environment Variables Reference

```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=campuseats

# JWT
JWT_SECRET=your-secret-key

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=CampusEats <noreply@campuseats.com>

# Frontend URL for reset links
FRONTEND_URL=http://localhost:5173

# Environment
NODE_ENV=development
```

Need help? Check the backend logs for detailed error messages!
