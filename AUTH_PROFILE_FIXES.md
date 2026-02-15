# Auth/Profile Data Fixes - Complete Guide

## Issues Fixed

### ✅ ISSUE 1: Username Not Saving Correctly

**Problem:** Username entered during signup wasn't being saved to the profiles table.

**Root Cause:** The database trigger `handle_new_user` wasn't properly extracting the username from Supabase auth metadata.

**Solution Applied:**

1. **AuthContext.tsx** - signUp function (Already Correct)
   - The signUp method already passes username in metadata correctly:
   ```tsx
   const { error } = await supabase.auth.signUp({
     email,
     password,
     options: {
       data: {
         username: username.toLowerCase(),
         display_name: displayName || username,
       },
       emailRedirectTo: `${window.location.origin}/auth/callback`,
     },
   })
   ```

2. **Database Trigger** - Updated handle_new_user function
   - File: `supabase/update-trigger.sql`
   - The updated trigger now properly extracts username from metadata:
   ```sql
   CREATE OR REPLACE FUNCTION public.handle_new_user()
   RETURNS TRIGGER AS $$
   BEGIN
     INSERT INTO public.profiles (id, username, email, display_name)
     VALUES (
       NEW.id,
       LOWER(COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1))),
       NEW.email,
       COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1))
     );
     RETURN NEW;
   END;
   $$ LANGUAGE plpgsql SECURITY DEFINER;
   ```

**How to Deploy:**
1. Go to Supabase Dashboard > SQL Editor
2. Open file: `supabase/update-trigger.sql`
3. Copy entire content
4. Paste into Supabase SQL Editor
5. Click "Run"

---

### ✅ ISSUE 2: Pages Showing Mock Data Instead of Real User

**Problem:** Header, Clubhouse, and Settings pages were displaying hardcoded "Lachlan" and mock data instead of real authenticated user data.

**Solution Applied:**

#### 1. **Header Component** - `/src/components/layout/Header.tsx`

**Changes:**
- ✅ Imported `useAuth` from AuthContext
- ✅ Removed old `useStore()` hook dependency
- ✅ Uses real auth state: `user`, `profile`, `signOut`, `isLoading`
- ✅ Displays real user data: `profile?.display_name`, `profile?.username`
- ✅ Shows real tier from `profile?.tier`

**Before:**
```tsx
const { user, setUser, cart, hydrated, setHydrated } = useStore()
// Used mock user.name, user.username
```

**After:**
```tsx
const { user, profile, signOut, isLoading } = useAuth()
// Uses real profile?.display_name, profile?.username
```

---

#### 2. **Clubhouse Page** - `/src/app/(main)/clubhouse/page.tsx`

**Changes:**
- ✅ Imported `useAuth` hook
- ✅ Removed hardcoded `mockUser.name` and `mockUser.username`
- ✅ Added loading state while fetching profile
- ✅ Extracts real user data:
  - `displayName = profile?.display_name || profile?.username || 'User'`
  - `username = profile?.username || 'unknown'`
- ✅ Displays real data in header

**Before:**
```tsx
const mockUser = {
  name: 'Lachlan',
  username: 'lachlan',
  // ...
}
// Used in JSX: mockUser.name, mockUser.username
```

**After:**
```tsx
const { profile, isLoading } = useAuth()
const displayName = profile?.display_name || profile?.username || 'User'
const username = profile?.username || 'unknown'
// Used in JSX: displayName, username
```

---

#### 3. **Settings Page** - `/src/app/(main)/settings/page.tsx`

**Changes:**
- ✅ Imported `useAuth` hook
- ✅ Added loading state while fetching profile
- ✅ Updated profile photo avatar to use real initial: `profile?.display_name || profile?.username`
- ✅ All form fields now pull from real `profile` data:
  - Display Name: `profile?.display_name || ''`
  - Username: `profile?.username || ''`
  - Email: `profile?.email || ''`
  - Avatar initial: First letter of display name

**Before:**
```tsx
const mockSettings = {
  account: {
    name: 'Lachlan',
    username: 'lachlan',
    email: 'lachlan@email.com',
    // ...
  },
}
// Used in JSX: settings.account.name, etc.
```

**After:**
```tsx
const { profile, isLoading } = useAuth()
// Used in JSX: profile?.display_name, profile?.username, profile?.email
```

---

## Remaining Mock Data

The following components still use mock data for features not yet connected to Supabase:

- **Clubhouse - Listings Tab**: Mock listings until API is built
- **Clubhouse - Orders Tab**: Mock orders until order system is built
- **Clubhouse - Purchases Tab**: Mock purchases until purchase system is built
- **Clubhouse - Earnings Tab**: Mock earnings until payment system is built
- **Settings - Addresses**: Mock addresses until address CRUD API is built
- **Settings - Payment Methods**: Mock data until Stripe integration

These can be progressively replaced with real data as APIs are built.

---

## Testing Checklist

### Test Username Saving:
- [ ] Create new account with custom username (e.g., "testuser123")
- [ ] Confirm confirmation email arrives
- [ ] Click confirmation link
- [ ] Login to /clubhouse
- [ ] Username appears as "@testuser123" in header
- [ ] Check Supabase dashboard: profiles table shows correct username

### Test Real User Data Display:
- [ ] Click "Sign In" button in Header
- [ ] Login with test account
- [ ] Header shows avatar with correct initial letter
- [ ] Header shows "@" + correct username
- [ ] Visit /settings
- [ ] Display Name field shows correct profile name
- [ ] Username field shows "@" + correct username
- [ ] Email field shows correct email
- [ ] Avatar shows correct initial letter
- [ ] Visit /clubhouse
- [ ] Header shows correct user information
- [ ] All tabs are accessible

### Test Loading States:
- [ ] Slow down network in DevTools
- [ ] Loading spinner appears while fetching profile
- [ ] No "undefined" or "null" values display
- [ ] Content loads correctly after data arrives

---

## File Changes Summary

| File | Changes | Status |
|------|---------|--------|
| src/components/layout/Header.tsx | Import useAuth, remove useStore, display real profile data | ✅ |
| src/app/(main)/clubhouse/page.tsx | Import useAuth, use real profile data, add loading state | ✅ |
| src/app/(main)/settings/page.tsx | Import useAuth, use real profile data, add loading state | ✅ |
| supabase/update-trigger.sql | Database trigger for auto-creating profiles with username | ✅ |

---

## Next Steps

1. **Deploy Database Trigger** (Required)
   - Run SQL from `supabase/update-trigger.sql` in Supabase
   - This ensures usernames are saved for existing and new users

2. **Test Authentication Flows** (Required)
   - Create test account
   - Verify username is saved
   - Test profile display on all pages

3. **Replace Remaining Mock Data** (Future)
   - Build API endpoints for listings, orders, addresses
   - Connect pages to real data sources
   - Remove mockListings, mockOrders, mockAddresses, etc.

4. **Add Profile Editing** (Future)
   - Build API endpoint to update profile
   - Add form submission to Settings page
   - Add image upload for avatars

---

## Emergency Rollback

If you need to revert changes:

1. **Header**: `git checkout src/components/layout/Header.tsx`
2. **Clubhouse**: `git checkout src/app/(main)/clubhouse/page.tsx`
3. **Settings**: `git checkout src/app/(main)/settings/page.tsx`
4. **Database**: Restore original trigger from git history

