-- RPC function to get user's addresses
CREATE OR REPLACE FUNCTION get_my_addresses()
RETURNS TABLE (
  id uuid,
  full_name text,
  address_line_1 text,
  address_line_2 text,
  city text,
  state text,
  zip_code text,
  country text,
  phone text,
  is_default boolean,
  is_return_address boolean,
  created_at timestamp with time zone
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id,
    a.full_name,
    a.address_line_1,
    a.address_line_2,
    a.city,
    a.state,
    a.zip_code,
    a.country,
    a.phone,
    a.is_default,
    a.is_return_address,
    a.created_at
  FROM public.addresses a
  WHERE a.user_id = auth.uid()
  ORDER BY a.is_default DESC, a.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permission to call function
GRANT EXECUTE ON FUNCTION get_my_addresses() TO authenticated;
