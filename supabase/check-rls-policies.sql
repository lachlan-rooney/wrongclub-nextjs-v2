-- =============================================
-- CHECK: RLS Policies on Profiles Table
-- =============================================
-- View all policies on the profiles table

SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY policyname;

-- Also check if user can SELECT their own profile
-- (This query should return data if RLS allows it)
SELECT id, username, display_name, email
FROM public.profiles
WHERE id = auth.uid()
LIMIT 1;
