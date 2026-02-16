# Sizing System Implementation Guide

## Overview
This document outlines the complete sizing system implementation for Wrong Club. The system includes:

1. **User Size Preferences** - Stored in the Settings page
2. **Listing Fit Indicators** - Set by sellers when creating listings
3. **Fit Recommendations** - Personalized recommendations based on user preferences
4. **Size-Based Filtering** - Browse listings by user's saved sizes

## Architecture

### Database Layer

#### Profiles Table Changes
```sql
-- User size preferences (nullable - users can opt-in)
size_tops TEXT
size_bottoms_waist TEXT
size_bottoms_length TEXT
size_footwear TEXT
size_headwear TEXT
size_gloves TEXT
gender_preference TEXT (values: 'mens', 'womens', 'all')
```

#### Listings Table Changes
```sql
-- Fit accuracy indicators (set by seller)
fit_scale INTEGER (-2 to 2, default 0)
  - -2: "Runs Large"
  - -1: "Slightly Large"
  - 0: "True to Size"
  - 1: "Slightly Small"
  - 2: "Runs Small"

is_one_size BOOLEAN (default FALSE)
  - TRUE: One Size / Adjustable item (ignore size comparisons)
```

### Application Layer

#### AuthContext Updates
```typescript
// Profile interface additions
interface Profile {
  size_tops?: string | null
  size_bottoms_waist?: string | null
  size_bottoms_length?: string | null
  size_footwear?: string | null
  size_headwear?: string | null
  size_gloves?: string | null
  gender_preference?: 'mens' | 'womens' | 'all' | null
}

// Existing updateProfile() function handles size updates
```

#### Sizing Utilities
Location: `/src/lib/sizing.ts`

```typescript
// Size options for all categories
export const SIZE_OPTIONS = {
  tops: { options: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'] },
  bottomsWaist: { options: ['28', '29', '30', ..., '42'] },
  bottomsLength: { options: ['28', '29', '30', ..., '36'] },
  footwear: { options: ['6', '6.5', '7', ..., '14'] },
  headwear: { options: ['one_size', 'small', 'medium', 'large', 'xl'] },
  gloves: { options: ['XS', 'S', 'M', 'M/L', 'L', 'XL'] },
}

// Fit scale options
export const FIT_SCALE = [
  { value: -2, label: 'Runs Large', emoji: '📏' },
  { value: -1, label: 'Slightly Large', emoji: '📐' },
  { value: 0, label: 'True to Size', emoji: '✅' },
  { value: 1, label: 'Slightly Small', emoji: '🤏' },
  { value: 2, label: 'Runs Small', emoji: '👕' },
]

// Gender options
export const GENDER_OPTIONS = ['mens', 'womens', 'all']

// Utility functions
getFitRecommendation(userSize, listingSize, fitScale, category)
  // Returns personalized recommendation string
  // e.g., "Should fit perfectly! ✓" or "May run slightly large"

getFitBadgeColor(fitScale)
  // Returns { bgColor, textColor, borderColor } for styling

getFitLabel(fitScale)
  // Returns { label, emoji } for fit scale display
```

### UI Components

#### 1. FitScaleSlider Component
Location: `/src/components/ui/FitScaleSlider.tsx`

**Purpose:** Interactive slider for selecting fit scale (-2 to +2)

**Features:**
- Visual gradient from red (runs large) to purple (runs small)
- Center marker for "True to Size"
- Emoji indicators for each position
- Quick-select buttons for each scale
- Smooth animations

**Usage:**
```tsx
import { FitScaleSlider } from '@/components/ui/FitScaleSlider'

<FitScaleSlider 
  value={fitScale}
  onChange={setFitScale}
  label="How does this item fit?"
  description="Select how this item fits compared to the size label"
/>
```

#### 2. FitBadge Component
Location: `/src/components/ui/FitBadge.tsx`

**Purpose:** Display fit information on listing pages

**Features:**
- Color-coded badge based on fit scale
- Emoji + label display
- Optional personalized recommendation
- One-size indicator support
- Size variants (sm, md, lg)

**Usage:**
```tsx
import { FitBadge } from '@/components/ui/FitBadge'

<FitBadge 
  fitScale={0}
  userSize="M"
  listingSize="M"
  category="tops"
  isOneSize={false}
  showRecommendation={true}
  size="md"
/>
```

#### 3. Settings Page - Your Sizes Section
Location: `/src/app/(main)/settings/page.tsx` (SECTION 6)

**Features:**
- Gender preference selector (radio buttons)
- 6 dropdown selects for different size categories
- Real-time database saving
- Auto-populated from user profile
- Visual feedback on save ("✓ Saved!")

**State Management:**
```tsx
const [sizes, setSizes] = useState({
  tops: profile?.size_tops || '',
  bottoms_waist: profile?.size_bottoms_waist || '',
  bottoms_length: profile?.size_bottoms_length || '',
  footwear: profile?.size_footwear || '',
  headwear: profile?.size_headwear || '',
  gloves: profile?.size_gloves || '',
  gender_preference: profile?.gender_preference || 'mens',
})

// Save handler
const handleSaveSizes = async () => {
  const { error } = await updateProfile({
    size_tops: sizes.tops || null,
    // ... other fields
  })
}
```

## Implementation Roadmap

### Phase 1: Database & Settings (✅ COMPLETE)
- [x] Add size columns to profiles table
- [x] Add fit indicators to listings table
- [x] Update Profile interface in AuthContext
- [x] Create sizing.ts utilities
- [x] Implement Settings page sizing section
- [x] Create deployment guide

### Phase 2: Seller Interface (IN PROGRESS)
- [ ] Add FitScaleSlider to Sell page
- [ ] Store fit_scale and is_one_size when creating listings
- [ ] Update listing creation API to save fit data
- [ ] Add validation (fit scale must be -2 to 2)

### Phase 3: Buyer Display (PENDING)
- [ ] Add FitBadge to listing detail pages
- [ ] Display fit recommendation if user has sizes
- [ ] Add fit indicators to listing cards (browse page)
- [ ] Show "One Size" indicator prominently

### Phase 4: Advanced Filtering (PENDING)
- [ ] Add "My Sizes Only" filter on browse page
- [ ] Implement size-based search refinements
- [ ] Show "One Size" items in all filters
- [ ] Add size-based recommendation algorithm

## Implementation Details

### Seller: Adding Fit Scale

**File:** `/src/app/(main)/sell/page.tsx`

```tsx
import { FitScaleSlider } from '@/components/ui/FitScaleSlider'

// In your form:
const [fitScale, setFitScale] = useState(0)
const [isOneSize, setIsOneSize] = useState(false)

// In JSX:
<FitScaleSlider
  value={fitScale}
  onChange={setFitScale}
  label="Fit Scale"
  description="How does this item fit compared to the size?"
/>

<label className="flex items-center gap-2">
  <input
    type="checkbox"
    checked={isOneSize}
    onChange={(e) => setIsOneSize(e.target.checked)}
  />
  <span>This is a One Size / Adjustable item</span>
</label>

// When creating listing:
await createListing({
  // ... other fields
  fit_scale: isOneSize ? 0 : fitScale,
  is_one_size: isOneSize,
})
```

### Buyer: Displaying Fit Information

**File:** `/src/app/(main)/listing/[id]/page.tsx` (or similar)

```tsx
import { FitBadge } from '@/components/ui/FitBadge'
import { useAuth } from '@/contexts/AuthContext'

export function ListingDetail({ listing }) {
  const { profile } = useAuth()
  
  // Get user's size for this category
  const userSize = profile?.size_tops // or other category
  
  return (
    <div>
      {/* ... other content ... */}
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-3">Fit Information</h3>
        
        <FitBadge
          fitScale={listing.fit_scale}
          userSize={userSize}
          listingSize={listing.size}
          category={listing.category}
          isOneSize={listing.is_one_size}
          showRecommendation={true}
          size="md"
        />
      </div>
    </div>
  )
}
```

### Browse Page: Size Filtering

**File:** `/src/app/(main)/browse/page.tsx` (or similar)

```tsx
// Add filter option
const [sizesFilter, setSizesFilter] = useState<string | null>(null)

// Build query
const buildQuery = () => {
  let query = supabase.from('listings').select('*')
  
  if (sizesFilter) {
    query = query.or(
      `size.eq.${sizesFilter},is_one_size.eq.true`
    )
  }
  
  return query
}

// In JSX - add filter control
<button
  onClick={() => setSizesFilter(profile?.size_tops || null)}
  className="px-4 py-2 rounded-lg bg-[#5f6651] text-white hover:opacity-90"
>
  👕 My Sizes Only
</button>
```

## Error Handling

### User Perspective
- Missing size preferences: Show "Set your sizes in Settings" prompt
- Invalid fit scale: Validate -2 to 2 range
- One-size items: Skip size comparison logic
- Database errors: Show friendly error message with retry option

### Developer Perspective
```typescript
// Validate fit scale
if (fitScale < -2 || fitScale > 2) {
  throw new Error('Fit scale must be between -2 and 2')
}

// Validate sizes
const validTopSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']
if (size && !validTopSizes.includes(size)) {
  throw new Error(`Invalid top size: ${size}`)
}

// Handle one-size items
if (isOneSize) {
  // Skip size comparison logic
  return { recommendation: 'One Size Fits All' }
}
```

## Testing Checklist

### Database
- [ ] Size columns exist on profiles table
- [ ] Fit columns exist on listings table
- [ ] Indexes created successfully
- [ ] RLS policies allow size data access
- [ ] Migrations are idempotent (can run multiple times)

### Frontend
- [ ] Settings page loads without errors
- [ ] Size dropdowns display correct options
- [ ] Sizes save and persist on page refresh
- [ ] Gender preference changes reflect in profile
- [ ] FitScaleSlider renders correctly
- [ ] Fit badges display with correct colors
- [ ] Personalized recommendations show for users with sizes

### Integration
- [ ] Seller can set fit scale when creating listing
- [ ] Seller can mark item as "One Size"
- [ ] Buyer sees fit badge on listing detail
- [ ] Buyer sees personalized recommendation
- [ ] "My Sizes Only" filter works correctly
- [ ] One-size items show in all filter results

## Troubleshooting

### Sizes Not Saving
1. Check browser console for errors
2. Verify Supabase connection in AuthContext
3. Check RLS policies allow updates to profiles table
4. Verify user is authenticated (check `user` in AuthContext)

### Fit Recommendations Not Showing
1. Verify user has set sizes in Settings
2. Check that listing has fit_scale value
3. Verify listing has size matching a category
4. Check getFitRecommendation() function works correctly

### Database Migrations Failing
1. Run migrations one at a time
2. Check for syntax errors in SQL files
3. Verify you have write permissions to tables
4. Review Supabase error messages in SQL Editor

## Performance Considerations

### Queries
- Use indexes on `size_tops`, `gender_preference` for fast filtering
- Index `fit_scale`, `is_one_size` for listing queries
- Consider materialized view for size-based recommendations

### Frontend
- Memoize FitBadge component to prevent re-renders
- Lazy-load FitScaleSlider if on heavy pages
- Cache fit recommendations in context

### Database
- Consider caching user sizes in AuthContext
- Only fetch sizes once on login
- Batch updates when possible

## Future Enhancements

1. **Size Recommendations**
   - ML model to predict size based on brand, category
   - Community sizing data (avg size for each item)
   - Brand-specific size charts

2. **Advanced Filtering**
   - Multi-select size filter
   - Size range filter ("S to L")
   - Gender-specific filtering

3. **Analytics**
   - Track which fit scales are most popular
   - Identify sizing issues by brand
   - Show sellers how their items fit

4. **Notifications**
   - Alert when new size comes in stock
   - Notify if similar item has better fit
   - Size availability notifications

## Related Documentation

- [SIZING_DEPLOYMENT.md](./SIZING_DEPLOYMENT.md) - Database deployment guide
- [src/lib/sizing.ts](./src/lib/sizing.ts) - Sizing utilities
- [src/components/ui/FitScaleSlider.tsx](./src/components/ui/FitScaleSlider.tsx) - Slider component
- [src/components/ui/FitBadge.tsx](./src/components/ui/FitBadge.tsx) - Badge component

## Support & Questions

For implementation questions:
1. Review this guide and related documentation
2. Check browser DevTools for errors
3. Review Supabase error logs
4. Test with sample data first
