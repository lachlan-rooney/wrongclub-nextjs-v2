# Sizing System - Quick Start Guide

## For Developers

### 5-Minute Setup

#### 1. Deploy Database Migrations (5 min)
```bash
# Go to Supabase SQL Editor
# Run: supabase/add-user-size-preferences.sql
# Run: supabase/add-listing-fit-indicators.sql
# Verify columns were created
```

#### 2. Verify Settings Page Works (2 min)
```bash
# Start dev server
npm run dev

# Go to http://localhost:3001/settings
# Scroll to "Your Sizes" section
# Try saving a size preference
```

#### 3. You're Done! ✅
The sizing system is now live and ready to use.

---

## Using the Components

### Add Fit Scale Slider to Your Page

```tsx
import { FitScaleSlider } from '@/components'

export function MyPage() {
  const [fitScale, setFitScale] = useState(0)

  return (
    <FitScaleSlider
      value={fitScale}
      onChange={setFitScale}
      label="How does this item fit?"
      description="Select compared to size label"
    />
  )
}
```

### Display Fit Badge

```tsx
import { FitBadge } from '@/components'
import { useAuth } from '@/contexts/AuthContext'

export function ListingDetail({ listing }) {
  const { profile } = useAuth()

  return (
    <FitBadge
      fitScale={listing.fit_scale}
      userSize={profile?.size_tops}
      listingSize={listing.size}
      category="tops"
      isOneSize={listing.is_one_size}
    />
  )
}
```

### Get Fit Recommendation

```tsx
import { getFitRecommendation } from '@/lib/sizing'

const recommendation = getFitRecommendation(
  'M',        // user's size
  'L',        // listing's size
  -1,         // fit scale (runs small)
  'tops'      // category
)

// Result: "Should fit well" or similar
```

---

## Common Tasks

### Task: Add sizes to Sell page
1. Import `FitScaleSlider` component
2. Add state: `const [fitScale, setFitScale] = useState(0)`
3. Add to form: `<FitScaleSlider value={fitScale} onChange={setFitScale} />`
4. When saving listing, include: `fit_scale: fitScale`

### Task: Show fit on listing page
1. Import `FitBadge` component and `useAuth` hook
2. Get user sizes: `const { profile } = useAuth()`
3. Add to page: `<FitBadge fitScale={item.fit_scale} userSize={profile?.size_tops} listingSize={item.size} category="tops" />`

### Task: Filter by user's sizes
1. Import `getFitRecommendation` from sizing lib
2. Query: `WHERE size = $userSize OR is_one_size = TRUE`
3. Optional: Show fit badge on filtered results

---

## API Reference

### FitScaleSlider Props
```typescript
interface FitScaleSliderProps {
  value: number                    // Current value (-2 to 2)
  onChange: (value: number) => void
  label?: string                   // Default: "Fit Scale"
  description?: string             // Help text
  showLabels?: boolean             // Default: true
}
```

### FitBadge Props
```typescript
interface FitBadgeProps {
  fitScale: number                 // -2 to 2
  userSize?: string                // For comparison
  listingSize?: string             // For comparison
  category?: string                // Size category
  isOneSize?: boolean              // One-size item?
  showRecommendation?: boolean     // Show text recommendation
  size?: 'sm' | 'md' | 'lg'       // Badge size
}
```

### Sizing Functions
```typescript
// Get personalized recommendation
getFitRecommendation(userSize, listingSize, fitScale, category): string

// Get color styling
getFitBadgeColor(fitScale): { bgColor: string; textColor: string; borderColor: string }

// Get label and emoji
getFitLabel(fitScale): { label: string; emoji: string }
```

---

## Troubleshooting

**Problem:** Settings page not showing sizes
- [ ] Check if SQL migrations are deployed
- [ ] Verify user is logged in
- [ ] Check browser console for errors
- [ ] Clear cache and reload

**Problem:** FitScaleSlider not rendering
- [ ] Verify import path is correct
- [ ] Check that `value` and `onChange` props are provided
- [ ] Check for TypeScript errors

**Problem:** Fit recommendations not showing
- [ ] Verify user has set sizes in Settings
- [ ] Verify listing has `size` and `fit_scale` values
- [ ] Check that `showRecommendation={true}` prop is set

---

## Documentation

- **Full Details:** `/SIZING_IMPLEMENTATION.md`
- **Deployment:** `/SIZING_DEPLOYMENT.md`
- **Completion Summary:** `/SIZING_COMPLETE.md`
- **Code Examples:** This file or component JSDoc

---

## Next Steps

1. ✅ Database migrated
2. ✅ Settings page working
3. ⬜ Add to Sell page (TODO)
4. ⬜ Display on listing pages (TODO)
5. ⬜ Add filtering (TODO)

---

For more detailed information, see the full documentation files listed above.
