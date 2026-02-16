# Testing Email Confirmation Flow

## Quick Test

### 1. Local Testing WITHOUT Supabase Setup (Dev Mode)
```bash
# Visit signup page
http://localhost:3000/signup

# Fill in:
# - Email: test@example.com
# - Password: testpass123 (8+ chars)
# - Username: testuser123
# - Display Name: Test User

# Click Sign Up
# You'll see a message from Supabase about email confirmation
```

### 2. Test Confirm Page Directly
Visit the confirm page with a test code:
```
http://localhost:3000/auth/confirm?code=test-code-here
```

You should see:
- ✓ Loading spinner briefly
- ✗ Error state (because test-code-here is invalid)
- Error message: "Code or link is invalid or has expired"
- Two buttons: "Try Signing Up Again" and "Go to Login"

### 3. Test Error Handling
```
http://localhost:3000/auth/confirm?error=invalid_request&error_description=The+auth+code+has+expired
```

You should see:
- ✗ Error state immediately
- Error message: "The auth code has expired"

## Full Setup for Production Testing

Once you configure Supabase (see EMAIL_CONFIRMATION_SETUP.md):

1. **Enable Email Confirmations in Supabase**
   - Go to Supabase Dashboard
   - Authentication → Settings
   - Enable "Enable email confirmations"

2. **Configure Redirect URL**
   - Authentication → URL Configuration
   - Add: `http://localhost:3000/auth/confirm`

3. **Sign Up and Check Email**
   ```
   http://localhost:3000/signup
   
   Email: yourreal@email.com
   Password: SecurePass123
   Username: testuser
   ```

4. **Receive Email**
   - Check your email for confirmation link
   - Link should be: `https://your-project.supabase.co/auth/v1/callback?code=...`

5. **Click the Link**
   - Supabase redirects to: `http://localhost:3000/auth/callback`
   - Your callback route forwards to: `http://localhost:3000/auth/confirm?code=...`
   - Confirmation page exchanges code for session
   - You see success state
   - Click "Start Browsing" → Goes to `/browse`

## Success Indicators

### ✅ Confirmation Page Loads
```
http://localhost:3000/auth/confirm
```

### ✅ Shows Loading State
Spinner appears briefly while exchanging code

### ✅ Shows Success State
- Green checkmark icon
- "Email Confirmed!" heading
- "Welcome to Wrong Club. Your account is ready to go." message
- "Start Browsing" button

### ✅ Success → Browse Redirect
Clicking "Start Browsing" takes you to `/browse`

### ✅ Error Handling
Invalid code shows:
- Red X icon
- "Confirmation Failed" heading
- Specific error message
- "Try Signing Up Again" button
- "Go to Login" button

## Network Requests

### Request Sequence (from browser DevTools Network tab):
1. `GET /auth/confirm?code=...` - Initial page load
2. `POST /auth/v1/token` - Code exchange to Supabase
3. `GET /browse` - Redirect after success

## Debugging

### Check Browser Console
```javascript
// Open DevTools Console (F12)
// You should see no errors

// Successful exchange logs:
// "✅ Auth successful, session established"
```

### Check Supabase Logs
Supabase Dashboard → Logs → Auth Events
- Should see `user_signup` event
- Should see `user_confirmation` event

### Check Session
After successful confirmation:
```javascript
// In browser console:
const supabase = createClient()
const { data: { session } } = await supabase.auth.getSession()
console.log(session) // Should show valid session object
```

## Common Issues & Solutions

### Issue: Confirmation page shows error immediately
- **Cause**: Invalid or expired code
- **Solution**: Generate new signup email or test with fresh code

### Issue: Redirect happens but no session
- **Cause**: Code exchange failed
- **Solution**: Check Supabase logs for errors

### Issue: Click "Start Browsing" but stays on confirm page
- **Cause**: JavaScript error or auth redirect issue
- **Solution**: Check browser console for errors

### Issue: Email never arrives
- **Cause**: Email confirmations not enabled in Supabase
- **Solution**: Follow setup guide to enable

## Files Modified

```
✅ src/app/auth/confirm/page.tsx          - NEW (confirmation page)
✅ src/contexts/AuthContext.tsx           - MODIFIED (redirect URL)
✅ src/app/auth/callback/route.ts         - MODIFIED (forwards to confirm)
✅ src/app/page.tsx                       - MODIFIED (simplified home)
✅ src/app/error.tsx                      - NEW (error boundary)
✅ src/app/global-error.tsx               - NEW (global error handler)
✅ src/app/not-found.tsx                  - MODIFIED (404 page)
```

## Expected User Flow

```
SIGNUP PAGE
   ↓
[Sign Up Form]
   ↓
Email confirmation link sent
   ↓
EMAIL INBOX
   ↓
Click: "Verify your email"
   ↓
CONFIRM PAGE (loading)
   ↓
Code exchanges with Supabase
   ↓
Session created
   ↓
CONFIRM PAGE (success)
   ↓
[Start Browsing Button]
   ↓
/browse page (authenticated ✅)
```

