-- Wrong Club Seed Data
-- Run after schema.sql for test data

-- ============================================
-- TEST USERS (you'll need to create these in Auth first)
-- ============================================
-- These are placeholder IDs - replace with actual auth.users IDs after signup

-- insert into public.users (id, email, name, username, handicap, bio, city, state) values
--   ('user-uuid-1', 'seller1@test.com', 'Mike Palmer', 'mikepalmer', 12.4, 'Golf enthusiast. Selling gear I no longer use.', 'Scottsdale', 'AZ'),
--   ('user-uuid-2', 'seller2@test.com', 'Sarah Links', 'sarahlinks', 8.2, 'LPGA hopeful. Upgrading my wardrobe.', 'Orlando', 'FL'),
--   ('user-uuid-3', 'buyer1@test.com', 'Tom Bogey', 'tombogey', 18.5, 'Weekend warrior looking for deals.', 'Austin', 'TX');

-- ============================================
-- SAMPLE LISTINGS
-- ============================================
-- Uncomment and update seller_id with real user IDs

-- insert into public.listings (seller_id, title, description, brand, category, gender, condition, size, price, original_price, images, status, position_x, position_y) values
-- (
--   'user-uuid-1',
--   'Malbon Script Bucket Hat',
--   'White cotton bucket hat with embroidered Malbon script logo. Worn twice, excellent condition.',
--   'Malbon Golf',
--   'headwear',
--   'mens',
--   'like_new',
--   'One Size',
--   4500, -- $45.00
--   6500, -- $65.00 original
--   array['https://your-supabase-url.supabase.co/storage/v1/object/public/listings/malbon-hat.jpg'],
--   'active',
--   48,
--   62
-- ),
-- (
--   'user-uuid-1',
--   'FootJoy DryJoys Premiere',
--   'Premium leather golf shoes. Classic styling, waterproof. Size 10.',
--   'FootJoy',
--   'footwear',
--   'mens',
--   'good',
--   '10',
--   12500,
--   21000,
--   array['https://your-supabase-url.supabase.co/storage/v1/object/public/listings/footjoy.jpg'],
--   'active',
--   32,
--   48
-- ),
-- (
--   'user-uuid-2',
--   'Travis Mathew Heater Polo',
--   'Navy blue performance polo. 4-way stretch, moisture wicking.',
--   'Travis Mathew',
--   'tops',
--   'mens',
--   'new_with_tags',
--   'L',
--   6500,
--   9500,
--   array['https://your-supabase-url.supabase.co/storage/v1/object/public/listings/travis-polo.jpg'],
--   'active',
--   62,
--   35
-- ),
-- (
--   'user-uuid-2',
--   'G/FORE Gallivanter Shoes',
--   'Women''s golf shoes in Snow/Blush. Worn one round.',
--   'G/FORE',
--   'footwear',
--   'womens',
--   'like_new',
--   '8',
--   15500,
--   22500,
--   array['https://your-supabase-url.supabase.co/storage/v1/object/public/listings/gfore.jpg'],
--   'active',
--   22,
--   68
-- );

-- ============================================
-- QUICK TEST QUERY
-- ============================================
-- Run this to verify schema is working:

select 
  'users' as table_name, count(*) as row_count from public.users
union all
select 
  'listings', count(*) from public.listings
union all
select 
  'brands', count(*) from public.brands
union all
select 
  'transactions', count(*) from public.transactions;
