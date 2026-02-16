-- =============================================
-- DEBUG: Check Profile Data
-- =============================================
-- Run this in Supabase SQL Editor to see what's actually stored

-- Check your latest profile
SELECT id, username, display_name, email, handicap_seller, tier_seller
FROM public.profiles 
ORDER BY created_at DESC 
LIMIT 5;

-- Check if auth metadata was stored
SELECT id, email, raw_user_meta_data
FROM auth.users
WHERE email LIKE '%lachlan%' OR email LIKE '%rondon%'
ORDER BY created_at DESC
LIMIT 5;
