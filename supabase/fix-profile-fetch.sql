-- =============================================
-- FIX: Allow Authenticated Users to Fetch Their Profile
-- =============================================
-- Create a function that authenticated users can call to get their own profile
-- This bypasses RLS complexity and ensures they can always read their own data

CREATE OR REPLACE FUNCTION public.get_my_profile()
RETURNS TABLE (
  id UUID,
  username TEXT,
  email TEXT,
  display_name TEXT,
  handicap_seller DECIMAL,
  handicap_buyer DECIMAL,
  tier_seller TEXT,
  tier_buyer TEXT,
  prestige_seller INTEGER,
  prestige_buyer INTEGER,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.username,
    p.email,
    p.display_name,
    p.handicap_seller,
    p.handicap_buyer,
    p.tier_seller,
    p.tier_buyer,
    p.prestige_seller,
    p.prestige_buyer,
    p.created_at
  FROM public.profiles p
  WHERE p.id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION public.get_my_profile() TO authenticated;

-- =============================================
-- Verification
-- =============================================
-- After deploying, test with:
-- SELECT * FROM public.get_my_profile();
