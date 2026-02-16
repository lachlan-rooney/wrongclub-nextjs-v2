# Sizing System Database Deployment Guide

## Overview
This guide walks you through deploying the new sizing system to your Supabase database. The sizing system includes:
- **User size preferences** (tops, bottoms waist/length, footwear, headwear, gloves, gender preference)
- **Listing fit indicators** (fit scale from -2 to +2, one-size checkbox)
- **Personalized fit recommendations** (based on user preferences and listing fit)

## Prerequisites
- Access to Supabase dashboard for your project
- SQL editor access (SQL Editor tab in Supabase console)

## Migration Files

### 1. add-user-size-preferences.sql
**Purpose:** Adds size preference columns to the `profiles` table  
**Changes:**
- Adds 6 new columns: `size_tops`, `size_bottoms_waist`, `size_bottoms_length`, `size_footwear`, `size_headwear`, `size_gloves`
- Adds `gender_preference` column with values: 'mens', 'womens', or 'all'
- Creates indexes for better query performance

**Location:** `/supabase/add-user-size-preferences.sql`

### 2. add-listing-fit-indicators.sql
**Purpose:** Adds fit scale and one-size flag to the `listings` table  
**Changes:**
- Adds `fit_scale` column (INTEGER -2 to +2, default 0)
- Adds `is_one_size` column (BOOLEAN, default FALSE)
- Creates indexes for filtering queries

**Location:** `/supabase/add-listing-fit-indicators.sql`

## Deployment Steps

### Option A: Supabase Dashboard (Recommended for quick setup)

1. **Go to SQL Editor**
   - Navigate to your Supabase project dashboard
   - Click on "SQL Editor" in the left sidebar

2. **Deploy User Size Preferences**
   - Click "New Query"
   - Copy the entire contents of `/supabase/add-user-size-preferences.sql`
   - Paste into the SQL editor
   - Click "Run" button
   - Wait for success message: "Success. No rows returned"

3. **Deploy Listing Fit Indicators**
   - Click "New Query" again
   - Copy the entire contents of `/supabase/add-listing-fit-indicators.sql`
   - Paste into the SQL editor
   - Click "Run" button
   - Wait for success message

### Option B: Supabase CLI (if installed)

```bash
# Install Supabase CLI if needed
brew install supabase/tap/supabase

# Link your project
supabase link --project-ref YOUR_PROJECT_ID

# Push migrations
supabase migration up
```

### Option C: Programmatic (Node.js)

```bash
# From the project root
node scripts/deploy-migrations.js
```

## Verification Checklist

After deploying migrations, verify the changes:

1. **Check profiles table**
   ```sql
   SELECT column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name = 'profiles' 
   AND column_name IN ('size_tops', 'size_bottoms_waist', 'size_bottoms_length', 'size_footwear', 'size_headwear', 'size_gloves', 'gender_preference');
   ```

2. **Check listings table**
   ```sql
   SELECT column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name = 'listings' 
   AND column_name IN ('fit_scale', 'is_one_size');
   ```

3. **Check indexes were created**
   ```sql
   SELECT indexname FROM pg_indexes 
   WHERE tablename IN ('profiles', 'listings') 
   AND indexname LIKE 'idx_%';
   ```

## Frontend Integration

The Settings page is now ready to use once migrations are deployed:

1. **Settings Page - Your Sizes Section**
   - Location: `/src/app/(main)/settings/page.tsx`
   - Features:
     - Gender preference selector (mens, womens, all)
     - Size dropdowns for 6 categories
     - Real-time database saving
     - Auto-populated from user's profile

2. **AuthContext Integration**
   - Location: `/src/contexts/AuthContext.tsx`
   - All size preferences automatically fetch on login
   - `updateProfile()` function saves sizes to database
   - Profile interface includes all size fields

3. **Sizing Utilities**
   - Location: `/src/lib/sizing.ts`
   - `SIZE_OPTIONS` - All available sizes by category
   - `getFitRecommendation()` - Personalized fit calculation
   - `getFitBadgeColor()` - Color coding for fit indicators
   - `getFitLabel()` - Display labels and emojis

## Next Steps

After deployment is complete:

1. **Test Settings Page**
   - Navigate to `/settings`
   - Go to "Your Sizes" section
   - Select sizes and save
   - Verify data persists after page refresh

2. **Implement Listing Fit Scale**
   - Add fit scale slider to the "Sell" page
   - Allow sellers to set fit scale (-2 to +2)
   - Add "One Size / Adjustable" checkbox

3. **Add Fit Indicators to Listings**
   - Display fit badge on listing detail pages
   - Show personalized fit recommendations
   - Use `getFitRecommendation()` utility

4. **Implement Size-Based Filtering**
   - Add "My Sizes Only" filter on browse page
   - Show one-size items in all filters
   - Query: `WHERE size = $userSize OR is_one_size = TRUE`

## Rollback (if needed)

If you need to rollback the migrations:

```sql
-- Remove user size preferences
ALTER TABLE public.profiles DROP COLUMN IF EXISTS size_tops;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS size_bottoms_waist;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS size_bottoms_length;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS size_footwear;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS size_headwear;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS size_gloves;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS gender_preference;

-- Remove listing fit indicators
ALTER TABLE public.listings DROP COLUMN IF EXISTS fit_scale;
ALTER TABLE public.listings DROP COLUMN IF EXISTS is_one_size;
```

## Troubleshooting

### "Column already exists" error
- This is normal if migrations have run before
- The `IF NOT EXISTS` clause prevents duplicate errors
- Safe to run migrations multiple times

### "Permission denied" error
- Ensure you're using a role with sufficient permissions
- Use the project's service role key, not anon key
- Check RLS policies on the table

### Indexes not created
- Verify the CREATE INDEX statements ran successfully
- Check for typos in index names
- Indexes are optional but improve query performance

## Support

For issues or questions:
1. Check Supabase documentation: https://supabase.com/docs
2. Review migration files for exact SQL syntax
3. Check browser console for frontend errors
4. Verify network requests in browser DevTools
