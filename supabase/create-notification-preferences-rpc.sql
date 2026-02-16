-- RPC function to get user's notification preferences
CREATE OR REPLACE FUNCTION get_my_notification_preferences()
RETURNS TABLE (
  id uuid,
  push_messages boolean,
  push_sold boolean,
  push_price_drops boolean,
  push_new_items boolean,
  push_order_updates boolean,
  push_drops boolean,
  email_orders boolean,
  email_shipping boolean,
  email_marketing boolean,
  email_digest boolean,
  email_seller_tips boolean,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    np.id,
    np.push_messages,
    np.push_sold,
    np.push_price_drops,
    np.push_new_items,
    np.push_order_updates,
    np.push_drops,
    np.email_orders,
    np.email_shipping,
    np.email_marketing,
    np.email_digest,
    np.email_seller_tips,
    np.created_at,
    np.updated_at
  FROM public.notification_preferences np
  WHERE np.user_id = auth.uid()
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permission to call function
GRANT EXECUTE ON FUNCTION get_my_notification_preferences() TO authenticated;
