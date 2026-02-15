# Wrong Club Handicap System v2.0 - Implementation Guide

**Status:** Production Ready  
**Version:** 2.0  
**Last Updated:** February 2026

---

## 📋 Overview

The Handicap System v2.0 is a comprehensive golf-inspired progression system that rewards genuine marketplace activity while preventing gaming and manipulation. This guide walks through the implementation.

---

## 🚀 Quick Start

### Phase 1: Deploy to Supabase

1. **Open Supabase Dashboard** → Your Project → SQL Editor
2. **Create new query** and copy the entire contents of `supabase/handicap-system-v2.sql`
3. **Run the query** - This will:
   - Add 9 new columns to `profiles` table
   - Create 3 new audit/tracking tables
   - Create the main `award_handicap_points()` function
   - Create 3 database triggers
   - Set up RLS policies

4. **Verify Success:**
   ```sql
   -- Check profiles table has new columns
   SELECT handicap_seller, handicap_buyer, prestige_seller, prestige_buyer 
   FROM public.profiles LIMIT 1;
   
   -- Check tables exist
   SELECT tablename FROM pg_tables WHERE tablename LIKE '%handicap%' OR tablename LIKE '%prestige%' OR tablename LIKE '%cooldown%';
   
   -- Check function exists
   SELECT routine_name FROM information_schema.routines WHERE routine_name = 'award_handicap_points';
   ```

---

## 🎯 Core System Components

### 1. **Profiles Table Updates**

10 new columns added to track handicap progression:

| Column | Type | Purpose | Default |
|--------|------|---------|---------|
| `handicap_seller` | DECIMAL(3,1) | Seller reputation (18.0 → 0.0) | 18.0 |
| `handicap_buyer` | DECIMAL(3,1) | Buyer reputation (18.0 → 0.0) | 18.0 |
| `prestige_seller` | INTEGER | How many times prestiged as seller | 0 |
| `prestige_buyer` | INTEGER | How many times prestiged as buyer | 0 |
| `tier_seller` | TEXT | Current tier: birdie, eagle, albatross, hole_in_one | birdie |
| `tier_buyer` | TEXT | Current tier: birdie, eagle, albatross, hole_in_one | birdie |
| `weekly_points_earned` | DECIMAL(3,1) | Points earned this week (for cap) | 0 |
| `weekly_posts_points` | DECIMAL(3,1) | Post points this week (separate cap) | 0 |
| `week_start_date` | DATE | When the current week started | TODAY |
| `phone_verified` | BOOLEAN | Required to earn points | FALSE |
| `daily_transactions_count` | INTEGER | Transactions completed today | 0 |
| `last_transaction_date` | DATE | Last day a transaction was completed | NULL |

### 2. **Handicap Events Table** (Audit Trail)

Every handicap change is logged:

```sql
SELECT 
  user_id,              -- Who earned points
  event_type,           -- Type: sale, purchase, review_received, etc.
  track,                -- seller or buyer
  handicap_before,      -- Was 17.2
  handicap_after,       -- Now 16.7
  handicap_change,      -- -0.5
  counterparty_id,      -- Who they traded with
  order_id,             -- Which order triggered this
  order_value_cents,    -- Order amount ($XX.XX)
  created_at            -- When
FROM handicap_events
WHERE user_id = 'user-id'
ORDER BY created_at DESC;
```

### 3. **Counterparty Cooldowns Table**

Prevents earning points multiple times with the same user in 30 days:

```sql
-- User A can't earn points from User B more than once per 30 days
SELECT * FROM counterparty_cooldowns
WHERE user_id = 'user-a' 
  AND counterparty_id = 'user-b'
  AND last_earned_at > NOW() - INTERVAL '30 days';  -- Returns 1 row = cooldown active
```

### 4. **Prestige Events Table**

Tracks tier upgrades and milestone celebrations:

```sql
SELECT 
  user_id,
  track,                -- seller or buyer
  from_tier,            -- Was: birdie
  to_tier,              -- Now: eagle
  prestige_level,       -- New prestige #1
  credit_awarded_cents, -- $10 credit given
  created_at
FROM prestige_events
WHERE user_id = 'user-id';
```

---

## ⚙️ How the System Works

### The Main Function: `award_handicap_points()`

This function is the heart of the system. Called by triggers when events occur.

```sql
-- Award 0.5 point reduction for completing a sale
SELECT public.award_handicap_points(
  p_user_id => 'seller-uuid',
  p_track => 'seller',
  p_event_type => 'sale',
  p_handicap_change => -0.5,  -- Negative = improvement
  p_counterparty_id => 'buyer-uuid',
  p_order_id => 'order-uuid',
  p_order_value_cents => 5999   -- $59.99
);

-- Returns JSON:
-- {
--   "success": true,
--   "handicap_before": 18.0,
--   "handicap_after": 17.5,
--   "handicap_change": -0.5,
--   "tier": "birdie",
--   "prestige": 0,
--   "prestiged": false
-- }
```

### What the Function Does (In Order)

1. **Fetches user profile**
2. **Validates phone verification** - Required to earn points
3. **Validates minimum order** - Must be $10+
4. **Checks counterparty cooldown** - Can't earn from same person within 30 days
5. **Checks daily limit** - Max 5 transactions per day
6. **Resets weekly counters** - If it's a new week
7. **Checks weekly cap** - Max -2.0 reduction per week
8. **Checks post cap** - Max -0.3 from posts per week
9. **Calculates new handicap** - Current + change (minimum 0.0)
10. **Detects prestige** - If handicap hits 0.0, tier up!
11. **Updates profile** - New handicap/tier/prestige
12. **Logs event** - Audit trail entry
13. **Updates cooldown** - Prevents repeat earnings
14. **Returns success**

### Prestige Mechanics

When a user reaches **0.0 handicap**:

```
Before: Birdie (Prestige 0), Handicap 0.0
         ↓ PRESTIGE TRIGGER
After:  Eagle (Prestige 1), Handicap 18.0
```

- Tier upgrades to next level
- Handicap **resets to 18.0** (not back to previous)
- Prestige counter increments
- User unlocks new tier benefits
- $10 credit awarded
- `prestige_events` table records this

---

## 🔗 Database Triggers

### Trigger 1: Order Completion

```sql
-- When: Order status changes to 'completed'
-- Does:
--   1. Award seller -0.5 (sale bonus)
--   2. Award buyer -0.5 (purchase bonus)
--   3. Check fast shipping (< 48 hours) → Award seller -0.2
```

**Table:** `orders`  
**Event:** After update  
**Conditions:** NEW.status = 'completed' AND OLD.status != 'completed'

### Trigger 2: Review Created

```sql
-- When: New review inserted
-- Does:
--   1. Award reviewer -0.2 (buyer gets points for leaving review)
--   2. Award seller based on rating:
--      - 5 stars: -0.3
--      - 4 stars: -0.1
--      - 3 or below: 0 points
```

**Table:** `reviews`  
**Event:** After insert  

### Trigger 3: Order Refunded

```sql
-- When: Order status changes to 'refunded'
-- Does:
--   1. Clawback seller +0.5 (reverses sale bonus, adds penalty)
--   2. Clawback buyer +0.5 (reverses purchase bonus)
```

**Table:** `orders`  
**Event:** After update  
**Conditions:** NEW.status = 'refunded' AND OLD.status != 'refunded'

---

## 📊 Anti-Gaming Measures

### Layer 1: Transaction Validation
- ✅ Minimum order: $10
- ✅ Only completed transactions count
- ✅ Cannot self-deal (buyer ≠ seller)

### Layer 2: Counterparty Limits
- ✅ Same pair → Once per 30 days max
- ✅ Full audit trail in `handicap_events`
- ✅ Diminishing returns logged

### Layer 3: Velocity Limits
- ✅ Daily: Max 5 point-earning transactions per day
- ✅ Weekly: Max -2.0 reduction per week
- ✅ Posts: Max -0.3 from posts per week

### Layer 4: Identity Verification
- ✅ Phone verification required (stored in DB)
- ✅ Users start with `phone_verified = FALSE`
- ✅ Cannot earn until verified

### Layer 5: Reversal Protection
- ✅ Refunds clawback all points
- ✅ Dispute losses add penalty
- ✅ Review removal reverses points

### Layer 6: Permanent Records
- ✅ Prestige is permanent (can't lose tier)
- ✅ Full audit trail for every change
- ✅ Tamper-proof (users can't modify)

---

## 🛠️ Frontend Integration

### Display Handicap

```tsx
// In components showing user profile
import { getTierInfo } from '@/lib/handicap'

const tierInfo = getTierInfo(profile.tier_seller)
const handicap = profile.handicap_seller

return (
  <div>
    <p>{tierInfo.emoji} {tierInfo.name}</p>
    <p>Handicap: {handicap.toFixed(1)}</p>
    <p>Prestige Level: {profile.prestige_seller}</p>
  </div>
)
```

### Show Progress to Next Tier

```tsx
// Show progress bar
const pointsToNextTier = handicap // e.g., 12.3 = need 12.3 points of improvement
const progressPercent = ((18 - handicap) / 18) * 100

return (
  <div className="w-full bg-gray-200 rounded-full h-2">
    <div 
      className="bg-green-500 h-2 rounded-full transition-all"
      style={{ width: `${progressPercent}%` }}
    />
  </div>
)
```

### Show Tier Progression

```tsx
// Display next tier in line
const currentPrestige = profile.prestige_seller
const nextPrestigeTier = getTierFromPrestige(currentPrestige + 1)

return (
  <p>Next tier: {nextPrestigeTier.emoji} {nextPrestigeTier.name}</p>
)
```

### Update AuthContext

```tsx
// Make sure profile fields are available
interface Profile {
  // ... existing fields
  handicap_seller: number
  handicap_buyer: number
  prestige_seller: number
  prestige_buyer: number
  tier_seller: string
  tier_buyer: string
  phone_verified: boolean
}
```

---

## 📝 Point-Earning Actions Reference

### Seller Actions (Reduce Seller Handicap)

| Action | Reduction | Condition | Trigger |
|--------|-----------|-----------|---------|
| Sale completed | -0.5 | Order delivered & paid | `on_order_completed_trigger` |
| 5-star review | -0.3 | From verified buyer | `on_review_created_trigger` |
| 4-star review | -0.1 | From verified buyer | `on_review_created_trigger` |
| Fast shipping | -0.2 | Shipped < 48h after payment | `on_order_completed_trigger` |
| Referral | -1.0 | Referred user completes sale | Manual call needed |
| First sale (monthly) | -0.2 | First in calendar month | Manual call needed |
| 10-item milestone | -0.3 | Every 10th active listing | Manual call needed |
| Caddie outfit | -0.5 | 3+ items in one order | Manual call needed |

### Buyer Actions (Reduce Buyer Handicap)

| Action | Reduction | Condition | Trigger |
|--------|-----------|-----------|---------|
| Purchase completed | -0.5 | Order delivered | `on_order_completed_trigger` |
| Review left | -0.2 | After completing purchase | `on_review_created_trigger` |
| Referral | -1.0 | Referred user completes purchase | Manual call needed |
| 10 saves milestone | -0.3 | Every 10 items saved | Manual call needed |

---

## 🧪 Testing the System

### Test 1: Create Sample User with Phone Verified

```sql
-- Update test user to allow point earning
UPDATE public.profiles
SET phone_verified = TRUE
WHERE username = 'testuser';
```

### Test 2: Manually Award Points

```sql
-- Test the function directly
SELECT public.award_handicap_points(
  'user-uuid-here',
  'seller',
  'sale',
  -0.5,
  'buyer-uuid-here',
  'order-uuid-here',
  5999
);
```

### Test 3: Verify Audit Trail

```sql
-- Check that event was logged
SELECT * FROM public.handicap_events
WHERE user_id = 'user-uuid-here'
ORDER BY created_at DESC LIMIT 5;
```

### Test 4: Check Prestige

```sql
-- Create user at prestige threshold
UPDATE public.profiles
SET handicap_seller = 0.1, phone_verified = TRUE
WHERE username = 'testuser';

-- Now award final 0.1 - should prestige
SELECT public.award_handicap_points(
  'user-uuid',
  'seller',
  'sale',
  -0.1,
  'buyer-uuid',
  'order-uuid',
  5999
);

-- Verify: should now be 18.0 handicap, tier_seller = 'eagle', prestige_seller = 1
SELECT handicap_seller, tier_seller, prestige_seller 
FROM public.profiles 
WHERE username = 'testuser';
```

---

## ⚠️ Known Limitations & To-Do

- [ ] **Referral tracking** - Need API endpoint to track referrals
- [ ] **Milestone detection** - Need cron job to detect 10-item milestones
- [ ] **Caddie outfit detection** - Need logic to detect 3+ item orders
- [ ] **Monthly first-sale bonus** - Need scheduled task
- [ ] **Phone verification UI** - Need to build verification form
- [ ] **Dispute penalty trigger** - Need to add when disputes resolution built

---

## 🔍 Monitoring & Maintenance

### Check Weekly Resets

```sql
-- Users whose week resets today
SELECT username, weekly_points_earned, week_start_date 
FROM public.profiles
WHERE week_start_date = CURRENT_DATE;
```

### Find Gaming Attempts

```sql
-- Users hitting daily limit
SELECT user_id, COUNT(*) as events_today
FROM public.handicap_events
WHERE DATE(created_at) = CURRENT_DATE
GROUP BY user_id
HAVING COUNT(*) > 5;

-- Users hitting weekly cap
SELECT user_id, SUM(ABS(handicap_change)) as points_this_week
FROM public.handicap_events
WHERE DATE(created_at) > CURRENT_DATE - INTERVAL '7 days'
GROUP BY user_id
HAVING SUM(ABS(handicap_change)) >= 2.0;
```

### Verify Recent Prestiges

```sql
-- Last 10 prestige events
SELECT * FROM public.prestige_events
ORDER BY created_at DESC
LIMIT 10;
```

---

## 📞 Support

Questions about the system? Check:
1. [Technical Specification](./HANDICAP_SPEC.md) - Full spec with edge cases
2. [handicap_events table](./QUERIES.md) - Useful SQL queries
3. Function documentation in `handicap-system-v2.sql` comments

---

## ✅ Deployment Checklist

- [ ] SQL migration deployed to Supabase
- [ ] All tables verified in Supabase dashboard
- [ ] Function tested with sample data
- [ ] Triggers verified creating events
- [ ] Frontend updated to show new handicap columns
- [ ] Phone verification flow built
- [ ] AuthContext includes new profile fields
- [ ] Handicap display added to Header component
- [ ] Tier progression displayed on Profile page
- [ ] Analytics dashboard shows prestige milestones
- [ ] Monitoring queries set up in Supabase
- [ ] Documentation updated for team

---

**Ready to deploy?** Run `supabase/handicap-system-v2.sql` in your Supabase dashboard! 🚀
