-- =============================================
-- FIX: Allow Public Profile Viewing
-- =============================================
-- Update RLS policies to allow anyone to read profiles (public profile viewing)

-- First, make sure RLS is enabled on the table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies to start fresh
DROP POLICY IF EXISTS "profiles_read_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_public_read" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_self" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_self" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete_self" ON public.profiles;

-- Grant basic select to anon and authenticated roles
GRANT SELECT ON public.profiles TO anon;
GRANT SELECT ON public.profiles TO authenticated;

-- Create a single permissive SELECT policy that allows everyone
CREATE POLICY "Enable read access for all users"
ON public.profiles
AS PERMISSIVE
FOR SELECT
TO public
USING (true);

-- Create policy for authenticated users to insert their own profile
CREATE POLICY "Enable insert for authenticated users"
ON public.profiles
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Create policy for authenticated users to update their own profile
CREATE POLICY "Enable update for authenticated users"
ON public.profiles
AS PERMISSIVE
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Create policy for authenticated users to delete their own profile
CREATE POLICY "Enable delete for authenticated users"
ON public.profiles
AS PERMISSIVE
FOR DELETE
TO authenticated
USING (auth.uid() = id);

-- =============================================
-- Verification
-- =============================================
-- Test with:
-- SELECT * FROM profiles LIMIT 1;  -- Should work for anon
-- SELECT * FROM profiles WHERE username = 'lachlans_links';  -- Should work for anon
