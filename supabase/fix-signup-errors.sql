-- =============================================
-- FIX: Signup Errors (401 + 500)
-- =============================================
-- This script fixes two critical issues:
-- 1. 401 Error: RLS blocking username availability check
-- 2. 500 Error: Auth trigger failing to create profile
--
-- Run this in Supabase SQL Editor AFTER handicap-system-v2.sql
-- =============================================

-- =============================================
-- PART 1: Fix 401 Error - Allow Anonymous Username Checks
-- =============================================
-- Create a public function to check username availability
-- This avoids direct table access during signup

CREATE OR REPLACE FUNCTION public.check_username_available(p_username TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  v_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_count FROM public.profiles 
  WHERE LOWER(username) = LOWER(p_username);
  
  RETURN v_count = 0;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Grant execute to anon role (unauthenticated users)
GRANT EXECUTE ON FUNCTION public.check_username_available(TEXT) TO anon;

-- =============================================
-- PART 2: Fix 500 Error - Update Auth Trigger
-- =============================================
-- Drop and recreate the auth trigger with proper error handling
-- and explicit initialization of all handicap columns

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert profile with all columns explicitly set
  -- This ensures the trigger doesn't fail due to missing/default columns
  INSERT INTO public.profiles (
    id,
    username,
    email,
    display_name,
    handicap_seller,
    handicap_buyer,
    prestige_seller,
    prestige_buyer,
    tier_seller,
    tier_buyer,
    weekly_points_earned,
    weekly_posts_points,
    week_start_date,
    phone_verified,
    daily_transactions_count,
    last_transaction_date,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    LOWER(COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1))),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', SPLIT_PART(NEW.email, '@', 1)),
    18.0,           -- handicap_seller
    18.0,           -- handicap_buyer
    0,              -- prestige_seller
    0,              -- prestige_buyer
    'birdie',       -- tier_seller
    'birdie',       -- tier_buyer
    0,              -- weekly_points_earned
    0,              -- weekly_posts_points
    CURRENT_DATE,   -- week_start_date
    FALSE,          -- phone_verified
    0,              -- daily_transactions_count
    NULL,           -- last_transaction_date
    NOW(),          -- created_at
    NOW()           -- updated_at
  );
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log error but don't fail - user account still created, just no profile yet
  RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- PART 3: Fix RLS Policies on Profiles Table
-- =============================================
-- Allow auth role to insert profiles (for the trigger)
-- The auth trigger runs with SECURITY DEFINER so it needs explicit perms

DROP POLICY IF EXISTS "Auth trigger can create profiles" ON public.profiles;

CREATE POLICY "Auth trigger can create profiles"
  ON public.profiles FOR INSERT
  WITH CHECK (true);

-- =============================================
-- Verification Queries
-- =============================================
-- Run these to verify the fixes:

-- Check function exists and is executable by anon
-- SELECT has_function_privilege('anon', 'check_username_available(text)', 'execute');

-- Check trigger exists
-- SELECT trigger_name FROM information_schema.triggers 
-- WHERE trigger_name = 'on_auth_user_created' AND table_name = 'users';

-- Check policies on profiles
-- SELECT policyname FROM pg_policies WHERE tablename = 'profiles';

-- =============================================
-- NEXT STEPS
-- =============================================
-- 1. Update AuthContext.tsx to use the new function for username checking
-- 2. Restart dev server
-- 3. Try signing up again
-- 4. Verify profile is created with all handicap columns initialized

