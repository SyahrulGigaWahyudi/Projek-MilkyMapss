# ⚠️ Apply Database Migration Manually

Your backend is running, but the database needs to be updated with the password reset columns. 

## Option 1: Using MySQL Workbench (GUI - Easiest)

1. **Open MySQL Workbench**
2. **Connect to your local MySQL server**
3. **Click on the "campuseats" database** in the left panel
4. **Open a new SQL tab** (File → New Query Tab OR Ctrl+T)
5. **Copy and paste this SQL:**

```sql
ALTER TABLE users
  ADD COLUMN reset_token VARCHAR(255) NULL,
  ADD COLUMN reset_token_expires DATETIME NULL;

CREATE INDEX idx_reset_token ON users(reset_token);
```

6. **Execute** (Ctrl+Shift+Enter or click the lightning bolt icon)
7. **You should see:** "2 rows affected" or similar success message
8. **Done!** The migration is applied ✓

## Option 2: Using MySQL Command Line

1. **Open Command Prompt or PowerShell**
2. **Navigate to the project:**
   ```bash
   cd D:\Projek-MilkyMapss
   ```

3. **Open MySQL and select the database:**
   ```bash
   mysql -u root campuseats
   ```

4. **Paste these commands:**
   ```sql
   ALTER TABLE users
     ADD COLUMN reset_token VARCHAR(255) NULL,
     ADD COLUMN reset_token_expires DATETIME NULL;

   CREATE INDEX idx_reset_token ON users(reset_token);
   ```

5. **Press Enter after each command**

6. **Exit MySQL:**
   ```sql
   EXIT;
   ```

## Verify the Migration

To confirm the columns were added, you can run:

```sql
DESCRIBE users;
```

You should see two new columns:
- `reset_token` - VARCHAR(255)
- `reset_token_expires` - DATETIME

## Current Status ✓

- ✅ Backend running on `http://localhost:3000`
- ✅ Frontend running on `http://localhost:5174` 
- ✅ Dependencies installed (nodemailer, dotenv)
- ✅ `.env` file created
- ⏳ **Waiting:** Database migration (apply using steps above)

## After Migration

Once you apply the migration:

1. **Test the feature:**
   - Go to `http://localhost:5174/login`
   - Click "Lupa password?"
   - Enter a registered email
   - You'll see the reset link displayed on the page (development mode)
   - Click "Buka Link" to test the reset password feature

2. **Optional: Add real email:**
   - Edit `.env` file and add Gmail or Mailtrap credentials
   - See [INSTALL_EMAIL_FEATURE.md](../INSTALL_EMAIL_FEATURE.md) for instructions

---

**Need Help?** The migration files are already prepared in [migrations/](../migrations/add_password_reset_columns.sql)
