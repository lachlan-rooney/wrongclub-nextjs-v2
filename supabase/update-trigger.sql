-- =============================================
-- UPDATE DATABASE TRIGGER FOR USERNAME HANDLING
-- =============================================
-- Run this in Supabase SQL Editor to fix username saving
-- Location: Supabase Dashboard > SQL Editor > Paste this entire script

-- Drop existing trigger first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop existing function first
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create updated function with proper username handling
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

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- VERIFICATION QUERIES
-- =============================================
-- Run these queries to verify the trigger works:

-- Check that the trigger exists:
-- SELECT * FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created';

-- Check that the function was created:
-- SELECT proname FROM pg_proc WHERE proname = 'handle_new_user';

-- Test the trigger by creating a new user manually (Supabase will run this automatically)
-- The profile should be auto-created in the profiles table
