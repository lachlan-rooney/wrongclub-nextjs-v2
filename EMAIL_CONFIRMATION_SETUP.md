# Email Confirmation Flow Setup Guide

## ✅ Completed Changes

### 1. Created `/auth/confirm/page.tsx`
A dedicated confirmation page that:
- Exchanges auth codes for sessions
- Shows loading, success, and error states
- Handles error parameters from Supabase
- Provides user-friendly error messages and recovery options

### 2. Updated `AuthContext.tsx` 
Modified the `signUp()` function to redirect to:
```tsx
emailRedirectTo: `${window.location.origin}/auth/confirm`
```

### 3. Updated `/auth/callback/route.ts`
Changed to forward requests to `/auth/confirm` with proper parameter handling

### 4. Simplified Home Page (`/page.tsx`)
- Checks auth state and redirects appropriately
- If authenticated → redirects to `/browse`
- If not authenticated → redirects to `/login`
- No longer handles code exchange directly

## 🔧 Remaining Supabase Dashboard Setup

To complete the email confirmation flow, you need to configure Supabase:

### Step 1: Set Site URL
Go to **Supabase Dashboard → Authentication → URL Configuration**

Set the **Site URL** to:
```
http://localhost:3000
```

### Step 2: Add Redirect URLs
In **Supabase Dashboard → Authentication → URL Configuration**, add to **Redirect URLs**:
```
http://localhost:3000/auth/confirm
https://wrongclub-demo.vercel.app/auth/confirm
```

### Step 3: Enable Email Confirmations
In **Supabase Dashboard → Authentication → Settings**

Turn ON: **"Enable email confirmations"**

### Step 4: Email Template (Auto-Configured)
Supabase automatically uses the `emailRedirectTo` parameter we set in the signUp function.

The email will contain a link like:
```
https://yourproject.supabase.co/auth/v1/callback?code=xxx&type=signup
```

Which Supabase will redirect to our `/auth/confirm` page via the redirect URL setting.

## 🧪 Testing the Flow

### Local Testing
1. Sign up at `http://localhost:3000/signup`
2. Supabase will show a confirmation message (in dev mode)
3. Click the confirmation link or visit:
   ```
   http://localhost:3000/auth/confirm?code=<test-code>
   ```
4. Should see success state and "Start Browsing" button
5. Clicking the button takes you to `/browse`

### Production Testing
1. Deploy to Vercel
2. Update Supabase redirect URL to your production URL
3. Sign up with real email address
4. Check email for confirmation link
5. Click link → Should be redirected to `/auth/confirm` with code
6. Flow completes as expected

## 📊 Error Handling

The confirmation page handles:
- ✅ Valid codes → Session created → Success state
- ✅ Invalid/expired codes → Error state with retry option
- ✅ Missing codes → Error state with instructions
- ✅ Network errors → Generic error message
- ✅ Supabase errors → Specific error messages from Supabase

## 🔄 Email Confirmation States

### Loading State
- Shows spinner and "Confirming your email..." message
- Exchanges code for session

### Success State
- Shows checkmark icon
- "Email Confirmed!" message
- "Start Browsing" button → Goes to `/browse`

### Error State
- Shows error icon
- Specific error message
- "Try Signing Up Again" button → Goes to `/signup`
- "Go to Login" button → Goes to `/login`
- Support contact email link

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] Supabase Site URL configured
- [ ] Supabase Redirect URLs added
- [ ] Email confirmations enabled in Supabase settings
- [ ] Test with real email (use spam folder if no inbox)
- [ ] Verify redirect URL in email link matches Supabase config
- [ ] Test error cases (expired link, invalid code, etc.)

## 📝 Key Files

- `src/app/auth/confirm/page.tsx` - Main confirmation page
- `src/contexts/AuthContext.tsx` - Updated signUp redirect
- `src/app/auth/callback/route.ts` - Forwards to confirm page
- `src/app/page.tsx` - Simplified home page

## 🎯 Flow Summary

```
User Signs Up
    ↓
Email sent with /auth/confirm?code=xxx
    ↓
User clicks link
    ↓
/auth/confirm page exchanges code for session
    ↓
Success → User clicks "Start Browsing"
    ↓
Redirected to /browse (authenticated)
```

## ✨ Next Steps

1. Configure Supabase dashboard settings (3 steps above)
2. Test locally with signup flow
3. Deploy to production
4. Test with real email addresses
5. Monitor error logs for any issues

