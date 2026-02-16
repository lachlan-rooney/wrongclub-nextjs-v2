-- =============================================
-- FIX: Update Auth Trigger for Handicap System
-- =============================================
-- This script fixes the profile creation trigger to handle
-- the new handicap system columns properly.
--
-- The issue: The old trigger only sets 4 columns, so the
-- new handicap columns use their DEFAULT values, which should work.
-- However, if there's a constraint issue, we need to explicitly
-- handle all columns.
--
-- Run this in Supabase SQL Editor after handicap-system-v2.sql
-- =============================================

-- Drop old trigger to avoid conflicts
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop old function
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create new function that explicitly sets all profile columns
-- This ensures new users get the correct defaults for the handicap system
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    username, 
    email, 
    display_name,
    -- Handicap columns (use defaults)
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
    last_transaction_date
  )
  VALUES (
    NEW.id,
    LOWER(COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1))),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', SPLIT_PART(NEW.email, '@', 1)),
    -- Handicap columns with explicit defaults
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
    NULL            -- last_transaction_date
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- Verification
-- =============================================
-- Run these queries to verify the trigger is working:

-- Check function exists
-- SELECT proname FROM pg_proc WHERE proname = 'handle_new_user';

-- Check trigger exists
-- SELECT trigger_name FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created';

-- =============================================
-- Complete
-- =============================================
-- The auth trigger is now fixed and ready for new signups.
-- All new users will have their handicap system columns initialized properly.
