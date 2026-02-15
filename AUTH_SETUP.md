# Supabase Authentication Setup - Complete Implementation Guide

## Overview
Bulletproof authentication system for Wrong Club using Supabase Auth with email/password, Google OAuth, password reset, and protected routes.

## Files Created/Modified

### 1. Core Authentication
- **src/contexts/AuthContext.tsx** - Auth provider with hooks (useAuth, useUser)
- **src/app/auth/callback/route.ts** - OAuth callback handler
- **src/middleware.ts** - Route protection logic

### 2. Authentication Pages
- **src/app/(auth)/login/page.tsx** - Login with email/password & Google
- **src/app/(auth)/signup/page.tsx** - Sign up with validation
- **src/app/(auth)/forgot-password/page.tsx** - Password reset request
- **src/app/(auth)/reset-password/page.tsx** - Set new password
- **src/app/(auth)/layout.tsx** - Auth layout (no header/footer)

### 3. Components
- **src/components/ProtectedRoute.tsx** - Wrapper for protected pages

### 4. Layout Updates
- **src/app/layout.tsx** - Wrapped with AuthProvider

## Key Features

### Authentication Context (AuthContext.tsx)
```typescript
// Available methods
- signUp(email, password, username, displayName)
- signIn(email, password)
- signInWithGoogle()
- signOut()
- resetPassword(email)
- updatePassword(newPassword)
- updateProfile(updates)
- refreshProfile()

// Available state
- user (Supabase User object)
- profile (Profile from database)
- session (Supabase Session)
- isLoading (boolean)
- isAuthenticated (boolean)
```

### Sign Up Flow
1. Validate username (3-20 chars, lowercase, numbers, underscores)
2. Validate password (minimum 8 chars)
3. Check username availability
4. Create auth user
5. Database trigger creates profile
6. Confirmation email sent
7. User clicks link to activate

### Sign In Flow
1. Email/password validation
2. Fetch session
3. Retrieve profile from database
4. Redirect to home or specified URL

### Password Reset Flow
1. User requests reset from /forgot-password
2. Email sent with reset link
3. User clicks link → /reset-password
4. New password set → Redirect to home

### Protected Routes
Routes requiring authentication:
- `/clubhouse` - Seller dashboard
- `/settings` - User settings
- `/messages` - Messaging
- `/sell` - Create listings
- `/checkout` - Purchase flow

Unauthenticated users redirected to `/login?redirect=/path`

### OAuth Integration
- **Google OAuth** - Configured in Supabase
- Redirect: `https://yourdomain.com/auth/callback`
- Profile created automatically on first login

## Setup Instructions

### 1. Supabase Configuration
Ensure in Supabase Dashboard:
- Auth > Providers: Email enabled
- Auth > Providers: Google OAuth configured
- URL Configuration > Site URL: https://yourdomain.com
- URL Configuration > Redirect URLs:
  - https://yourdomain.com/auth/callback
  - https://yourdomain.com/

### 2. Environment Variables
Verify in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyxxxx
```

### 3. Database Schema
Run [src/db/schema.sql](src/db/schema.sql) in Supabase SQL Editor:
- Creates `profiles` table
- Creates `favorite_courses`, `follows`, `favorites` tables
- Sets up RLS policies
- Creates profile trigger on auth signup

### 4. Usage in Components

#### Use Auth Hook
```typescript
'use client'
import { useAuth } from '@/contexts/AuthContext'

export default function MyComponent() {
  const { user, profile, isAuthenticated, signOut } = useAuth()
  
  return (
    <>
      {isAuthenticated && (
        <>
          <p>Welcome {profile?.display_name}</p>
          <button onClick={signOut}>Log out</button>
        </>
      )}
    </>
  )
}
```

#### Protect a Page
```typescript
'use client'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function MyPage() {
  return (
    <ProtectedRoute>
      <h1>Protected Content</h1>
    </ProtectedRoute>
  )
}
```

#### Update Profile
```typescript
const { updateProfile } = useAuth()

await updateProfile({
  display_name: 'New Name',
  bio: 'My bio',
  is_seller: true,
  course_name: 'My Course',
})
```

## Security Features

1. **Row-Level Security (RLS)**
   - Users can only access their own data
   - Public data readable by all
   - Private conversations restricted to participants

2. **Password Requirements**
   - Minimum 8 characters
   - Real-time validation feedback
   - Confirmation matching

3. **Username Validation**
   - 3-20 characters
   - Lowercase, numbers, underscores only
   - Uniqueness check
   - Auto-lowercase input

4. **Session Management**
   - Supabase Auth handles JWT tokens
   - Automatic refresh
   - Logout clears cookies

5. **Protected Routes**
   - Middleware checks session
   - Redirects to login if needed
   - Preserves redirect URL

## Middleware Behavior

### Route Protection Matrix
| Path | Authenticated | Unauthenticated |
|------|--------------|-----------------|
| `/login` | → `/` | Allow |
| `/signup` | → `/` | Allow |
| `/forgot-password` | → `/` | Allow |
| `/clubhouse` | Allow | → `/login?redirect=/clubhouse` |
| `/settings` | Allow | → `/login?redirect=/settings` |
| `/messages` | Allow | → `/login?redirect=/messages` |
| `/sell` | Allow | → `/login?redirect=/sell` |
| `/checkout` | Allow | → `/login?redirect=/checkout` |
| Other paths | Allow | Allow |

## Troubleshooting

### Issue: "useAuth must be used within an AuthProvider"
**Solution:** Ensure AuthProvider wraps component tree in root layout.

### Issue: Profile not loading
**Solution:** 
1. Check database `profiles` table exists
2. Verify RLS policies allow read access
3. Check Supabase trigger is working

### Issue: OAuth redirect not working
**Solution:**
1. Verify redirect URLs in Supabase dashboard
2. Check `auth/callback` route exists
3. Ensure domain matches Site URL

### Issue: Passwords not matching validation
**Solution:** Password must be minimum 8 characters and match exactly.

### Issue: Username taken error but user doesn't exist
**Solution:** Check username case-sensitivity (all lowercase).

## File Structure
```
src/
├── contexts/
│   └── AuthContext.tsx          # Auth provider & hooks
├── components/
│   └── ProtectedRoute.tsx       # Protected page wrapper
├── app/
│   ├── layout.tsx               # Root layout with AuthProvider
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts         # OAuth callback
│   └── (auth)/
│       ├── layout.tsx           # Auth pages layout
│       ├── login/
│       │   └── page.tsx         # Login page
│       ├── signup/
│       │   └── page.tsx         # Sign up page
│       ├── forgot-password/
│       │   └── page.tsx         # Reset request
│       └── reset-password/
│           └── page.tsx         # Set new password
└── middleware.ts                # Route protection
```

## API Methods Reference

### signUp
```typescript
const { error } = await signUp(email, password, username, displayName)
// Returns: { error: Error | null }
```

### signIn
```typescript
const { error } = await signIn(email, password)
// Returns: { error: Error | null }
// Sets user, profile, session automatically
```

### signInWithGoogle
```typescript
const { error } = await signInWithGoogle()
// Returns: { error: Error | null }
// Redirects to Google, then to /auth/callback
```

### signOut
```typescript
await signOut()
// Clears session, redirects to home
```

### resetPassword
```typescript
const { error } = await resetPassword(email)
// Returns: { error: Error | null }
// Sends reset email
```

### updatePassword
```typescript
const { error } = await updatePassword(newPassword)
// Returns: { error: Error | null }
// Updates auth password
```

### updateProfile
```typescript
const { error } = await updateProfile({
  display_name: 'New Name',
  bio: 'Bio',
  course_name: 'Course',
  is_seller: true,
  tier: 'eagle',
  // ... other fields
})
// Returns: { error: Error | null }
```

### refreshProfile
```typescript
await refreshProfile()
// Fetches latest profile from database
```

## Next Steps

1. **Test Authentication**
   - Sign up with email
   - Sign in with email
   - Try Google OAuth
   - Test password reset

2. **Customize Profile**
   - Update display name
   - Add bio
   - Set seller info
   - Upload avatar

3. **Protected Pages**
   - Add ProtectedRoute wrapper
   - Test login redirects
   - Verify session persistence

4. **Deploy**
   - Test on production domain
   - Update Supabase redirect URLs
   - Monitor auth logs

