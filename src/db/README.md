# Wrong Club Database Schema

## Setup Instructions

1. Go to your Supabase Dashboard
2. Click "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy the contents of `schema.sql`
5. Paste and click "Run"

## Storage Buckets

After running the SQL, create these storage buckets:

1. Go to Storage in Supabase Dashboard
2. Create bucket: `avatars` (public)
3. Create bucket: `listings` (public)
4. Create bucket: `headers` (public)

## Tables Overview

| Table | Purpose |
|-------|---------|
| profiles | User accounts & seller info |
| listings | Items for sale |
| listing_images | Photos for listings |
| orders | Purchase transactions |
| conversations | Message threads |
| messages | Individual messages |
| follows | User following relationships |
| favorites | Saved listings |
| favorite_courses | Saved sellers |
| reviews | Buyer reviews of sellers |
| cart_items | Shopping cart |
| notifications | User notifications |
| addresses | Shipping/return addresses |

## Row Level Security

All tables have RLS enabled. Policies ensure:
- Public data (listings, profiles) is readable by all
- Private data (orders, messages) only accessible to involved parties
- Users can only modify their own data

## Key Features

### Profiles Table
- User identity, seller information, preferences
- Tier system (birdie, eagle, albatross, hole_in_one)
- Course display settings (header image, terrain, etc.)
- Buyer size preferences stored for recommendation engine

### Listings Table
- Full product information with pricing
- Status tracking (draft, active, sold, archived)
- Featured/promoted item flags
- Positional coordinates for course display overlay
- Auto-updated timestamps

### Orders Table
- Complete transaction record
- Pricing breakdown (item, shipping, buyer protection, seller earnings)
- Shipping details with tracking
- Status progression pipeline
- Automatic order number generation

### Conversations & Messages
- Direct messaging between buyers and sellers
- Linked to listings and orders for context
- Read status tracking
- RLS ensures only participants can view

### Follows & Favorites
- User can follow/unfollow sellers
- Save favorite listings and sellers
- Unique constraints prevent duplicates

### Reviews
- Seller reviews by buyers
- Linked to specific orders
- 1-5 star rating system

## Triggers & Functions

### Auto-profile Creation
- Creates user profile when new auth user signs up
- Uses email username if not provided

### Timestamps
- `created_at` - Set on insert, never changes
- `updated_at` - Updated on every record modification

### Order Number Generation
- Format: `WC-2026-12345`
- Auto-generated on order creation
- Guaranteed unique

## Extending the Schema

To add new features:

1. Add new table with proper references
2. Enable RLS on the table
3. Add appropriate security policies
4. Create indexes for frequently queried fields
5. Update `src/types/database.ts` with `npm run db:generate`

## Maintenance

### Backup
Use Supabase Dashboard > Settings > Backups

### Monitor Performance
- Check Query Performance in Supabase Dashboard
- Review slow queries in logs
- Ensure indexes are being used

### Update Type Definitions
```bash
npm run db:generate
```

This regenerates `src/types/database.ts` with latest schema types.
