-- Seed test listings for Caddie AI testing
-- Run this in Supabase SQL Editor

-- Get a seller ID (you or first user in DB)
WITH seller_user AS (
  SELECT id FROM public.profiles LIMIT 1
)
INSERT INTO public.listings (
  seller_id,
  title,
  description,
  brand,
  category,
  gender,
  condition,
  size,
  color,
  price_cents,
  shipping_price_cents,
  status
)
SELECT
  (SELECT id FROM seller_user),
  title,
  description,
  brand,
  category,
  gender,
  condition,
  size,
  color,
  price_cents,
  shipping_price_cents,
  'active'
FROM (VALUES
  (
    'Nike Dri-FIT Golf Polo - Navy',
    'Excellent condition Nike Dri-FIT polo in navy blue. Perfect for casual rounds or the range. Moisture-wicking fabric keeps you dry in warm weather.',
    'Nike',
    'tops',
    'mens',
    'Like New',
    'M',
    'Navy Blue',
    4500, -- $45
    500
  ),
  (
    'Adidas Golf Shorts - Khaki',
    'Lightweight Adidas golf shorts in khaki. Great for warm weather play. Flat front with modern fit.',
    'Adidas',
    'bottoms',
    'mens',
    'New without Tags',
    'L',
    'Khaki',
    3500, -- $35
    400
  ),
  (
    'FootJoy Pro Golf Shoes - White',
    'Barely worn FootJoy Pro SLX golf shoes in white. Excellent grip and comfort. Includes original box.',
    'FootJoy',
    'footwear',
    'mens',
    'Like New',
    '10',
    'White',
    12000, -- $120
    600
  ),
  (
    'Callaway Golf Cap - Black',
    'Classic black Callaway golf cap with adjustable strap. Great for sun protection on the course.',
    'Callaway',
    'headwear',
    'mens',
    'New with Tags',
    'One Size',
    'Black',
    1500, -- $15
    300
  ),
  (
    'Taylormade Golf Towel & Brush Set',
    'New Taylormade microfiber golf towel with club groove cleaner. Perfect for keeping clubs clean.',
    'Taylormade',
    'accessories',
    'unisex',
    'New without Tags',
    'One Size',
    'White',
    1200, -- $12
    250
  ),
  (
    'Ping Crew Neck Sweater - Charcoal',
    'Premium Ping crew neck golf sweater in charcoal. Perfect for cooler rounds. Minimal pilling.',
    'Ping',
    'tops',
    'mens',
    'Like New',
    'XL',
    'Charcoal',
    6500, -- $65
    500
  ),
  (
    'Titleist Golf Ball Marker Set',
    'Set of 4 authentic Titleist magnetic ball markers. New in package.',
    'Titleist',
    'accessories',
    'unisex',
    'New with Tags',
    'One Size',
    'Mixed',
    800, -- $8
    200
  ),
  (
    'Under Armour Stretch Polo - Red',
    'Under Armour stretch golf polo in bright red. Comfortable and breathable. Great condition.',
    'Under Armour',
    'tops',
    'mens',
    'Good',
    'M',
    'Red',
    3200, -- $32
    400
  ),
  (
    'Puma Golf Pants - Navy',
    'Navy Puma golf pants with modern tapered fit. Perfect for a polished look on the course.',
    'Puma',
    'bottoms',
    'mens',
    'Like New',
    '32',
    'Navy',
    5500, -- $55
    450
  ),
  (
    'Cobra Golf Visor - Black',
    'Black Cobra golf visor with adjustable back. Keeps sun out of your eyes without the hat hair.',
    'Cobra',
    'headwear',
    'unisex',
    'New without Tags',
    'One Size',
    'Black',
    1000, -- $10
    250
  ),
  (
    'Nike Dri-FIT Women Golf Polo - Pink',
    'Bright pink Nike Dri-FIT women''s polo. Excellent condition, perfect fit. Moisture-wicking for hot rounds.',
    'Nike',
    'tops',
    'womens',
    'Like New',
    'S',
    'Pink',
    4200, -- $42
    500
  ),
  (
    'Adidas Women Golf Shorts - White',
    'White Adidas women''s golf shorts with modern athletic fit. New without tags.',
    'Adidas',
    'bottoms',
    'womens',
    'New without Tags',
    'M',
    'White',
    3800, -- $38
    400
  ),
  (
    'FootJoy Women Golf Shoes - Gray',
    'Excellent condition FootJoy women''s golf shoes in gray and white. Comfortable all-day wear.',
    'FootJoy',
    'footwear',
    'womens',
    'Like New',
    '7',
    'Gray',
    11500, -- $115
    600
  ),
  (
    'Ping Women Crew Neck Sweater - Cream',
    'Cream colored Ping women''s crew neck golf sweater. Soft and warm. Like new condition.',
    'Ping',
    'tops',
    'womens',
    'Like New',
    'M',
    'Cream',
    6200, -- $62
    500
  )
) AS listings(title, description, brand, category, gender, condition, size, color, price_cents, shipping_price_cents);
