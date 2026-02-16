-- RPC function to get user's privacy settings
CREATE OR REPLACE FUNCTION get_my_privacy_settings()
RETURNS TABLE (
  id uuid,
  profile_public boolean,
  show_handicap boolean,
  show_sales boolean,
  show_purchases boolean,
  allow_messages_all boolean,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ps.id,
    ps.profile_public,
    ps.show_handicap,
    ps.show_sales,
    ps.show_purchases,
    ps.allow_messages_all,
    ps.created_at,
    ps.updated_at
  FROM public.privacy_settings ps
  WHERE ps.user_id = auth.uid()
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permission to call function
GRANT EXECUTE ON FUNCTION get_my_privacy_settings() TO authenticated;
