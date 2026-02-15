# Handicap System v2.0 - Testing Checklist

Complete this checklist after deploying the migration to Supabase.

---

## ✅ Pre-Deployment Verification

- [ ] Read through `supabase/handicap-system-v2.sql` entirely
- [ ] Understand all 10 steps in the migration
- [ ] Back up current database (if production)
- [ ] Have Supabase SQL Editor open and ready
- [ ] Have test user accounts prepared

---

## 🗄️ Phase 1: Database Verification

### Table Creation

```sql
-- Run each query and verify results
```

- [ ] **Profiles table columns added**
  ```sql
  SELECT column_name FROM information_schema.columns 
  WHERE table_name = 'profiles' 
  AND column_name LIKE 'handicap%' OR column_name LIKE 'prestige%' OR column_name LIKE 'phone%';
  ```
  Expected: 12 new columns visible

- [ ] **handicap_events table exists**
  ```sql
  SELECT * FROM public.handicap_events LIMIT 1;
  ```
  Expected: Table exists but empty (0 rows)

- [ ] **counterparty_cooldowns table exists**
  ```sql
  SELECT * FROM public.counterparty_cooldowns LIMIT 1;
  ```
  Expected: Table exists but empty (0 rows)

- [ ] **prestige_events table exists**
  ```sql
  SELECT * FROM public.prestige_events LIMIT 1;
  ```
  Expected: Table exists but empty (0 rows)

### Function Verification

- [ ] **award_handicap_points function exists**
  ```sql
  SELECT routine_name, routine_type 
  FROM information_schema.routines 
  WHERE routine_name = 'award_handicap_points';
  ```
  Expected: 1 row, routine_type = 'FUNCTION'

- [ ] **Helper functions exist**
  ```sql
  SELECT routine_name FROM information_schema.routines 
  WHERE routine_name IN ('get_tier_from_prestige', 'can_earn_this_week');
  ```
  Expected: 2 rows

### Trigger Verification

- [ ] **on_order_completed_trigger exists**
  ```sql
  SELECT trigger_name FROM information_schema.triggers 
  WHERE trigger_name = 'on_order_completed_trigger';
  ```
  Expected: 1 row

- [ ] **on_review_created_trigger exists**
  ```sql
  SELECT trigger_name FROM information_schema.triggers 
  WHERE trigger_name = 'on_review_created_trigger';
  ```
  Expected: 1 row

- [ ] **on_order_refunded_trigger exists**
  ```sql
  SELECT trigger_name FROM information_schema.triggers 
  WHERE trigger_name = 'on_order_refunded_trigger';
  ```
  Expected: 1 row

### RLS Policy Verification

- [ ] **RLS enabled on new tables**
  ```sql
  SELECT tablename FROM pg_tables 
  WHERE tablename IN ('handicap_events', 'counterparty_cooldowns', 'prestige_events')
  AND schemaname = 'public';
  ```
  Expected: 3 tables

---

## 🧪 Phase 2: Function Testing

### Test Setup

1. [ ] **Prepare test user**
   ```sql
   UPDATE public.profiles
   SET phone_verified = TRUE
   WHERE username = 'testuser1';
   ```

2. [ ] **Verify test user is ready**
   ```sql
   SELECT username, handicap_seller, prestige_seller, phone_verified 
   FROM public.profiles 
   WHERE username = 'testuser1';
   ```
   Expected: handicap_seller = 18.0, prestige_seller = 0, phone_verified = TRUE

### Test 1: Award Sale Points

```sql
SELECT public.award_handicap_points(
  p_user_id => (SELECT id FROM public.profiles WHERE username = 'testuser1'),
  p_track => 'seller',
  p_event_type => 'sale',
  p_handicap_change => -0.5,
  p_counterparty_id => (SELECT id FROM public.profiles WHERE username = 'testuser2'),
  p_order_id => 'test-order-1'::UUID,
  p_order_value_cents => 5999
);
```

- [ ] Function returns success: true
- [ ] handicap_before: 18.0
- [ ] handicap_after: 17.5
- [ ] handicap_change: -0.5
- [ ] tier: 'birdie'
- [ ] prestige: 0
- [ ] prestiged: false

### Test 2: Verify Profile Update

```sql
SELECT handicap_seller, prestige_seller 
FROM public.profiles 
WHERE username = 'testuser1';
```

- [ ] handicap_seller is now 17.5 (was 18.0)
- [ ] prestige_seller is still 0

### Test 3: Verify Audit Trail

```sql
SELECT * FROM public.handicap_events 
WHERE user_id = (SELECT id FROM public.profiles WHERE username = 'testuser1')
ORDER BY created_at DESC LIMIT 1;
```

- [ ] event_type: 'sale'
- [ ] track: 'seller'
- [ ] handicap_before: 18.0
- [ ] handicap_after: 17.5
- [ ] handicap_change: -0.5
- [ ] counterparty_id: testuser2's ID

### Test 4: Verify Cooldown

```sql
SELECT * FROM public.counterparty_cooldowns 
WHERE user_id = (SELECT id FROM public.profiles WHERE username = 'testuser1')
AND counterparty_id = (SELECT id FROM public.profiles WHERE username = 'testuser2');
```

- [ ] Record exists
- [ ] last_earned_at is recent (within last minute)

### Test 5: Phone Verification Required

```sql
UPDATE public.profiles SET phone_verified = FALSE WHERE username = 'testuser1';

SELECT public.award_handicap_points(
  p_user_id => (SELECT id FROM public.profiles WHERE username = 'testuser1'),
  p_track => 'seller',
  p_event_type => 'sale',
  p_handicap_change => -0.5,
  p_counterparty_id => (SELECT id FROM public.profiles WHERE username = 'testuser2'),
  p_order_id => 'test-order-2'::UUID,
  p_order_value_cents => 5999
);
```

- [ ] Function returns success: false
- [ ] error: 'Phone verification required'

### Test 6: Minimum Order Value

```sql
UPDATE public.profiles SET phone_verified = TRUE WHERE username = 'testuser1';

SELECT public.award_handicap_points(
  p_user_id => (SELECT id FROM public.profiles WHERE username = 'testuser1'),
  p_track => 'seller',
  p_event_type => 'sale',
  p_handicap_change => -0.5,
  p_counterparty_id => (SELECT id FROM public.profiles WHERE username = 'testuser2'),
  p_order_id => 'test-order-3'::UUID,
  p_order_value_cents => 500  -- $5.00, below $10 minimum
);
```

- [ ] Function returns success: false
- [ ] error: 'Order below minimum value'

### Test 7: Counterparty Cooldown

```sql
SELECT public.award_handicap_points(
  p_user_id => (SELECT id FROM public.profiles WHERE username = 'testuser1'),
  p_track => 'seller',
  p_event_type => 'sale',
  p_handicap_change => -0.5,
  p_counterparty_id => (SELECT id FROM public.profiles WHERE username = 'testuser2'),
  p_order_id => 'test-order-4'::UUID,
  p_order_value_cents => 5999
);
```

- [ ] Function returns success: false
- [ ] error: 'Counterparty cooldown active'

---

## 📊 Phase 3: Prestige Testing

### Setup: Get User to Edge of Prestige

1. [ ] **Set user handicap to 0.5**
   ```sql
   UPDATE public.profiles
   SET handicap_seller = 0.5, phone_verified = TRUE
   WHERE username = 'testuser3';
   ```

2. [ ] **Verify setup**
   ```sql
   SELECT handicap_seller, tier_seller, prestige_seller 
   FROM public.profiles 
   WHERE username = 'testuser3';
   ```
   Expected: 0.5, 'birdie', 0

### Test: Award Final Points to Prestige

```sql
SELECT public.award_handicap_points(
  p_user_id => (SELECT id FROM public.profiles WHERE username = 'testuser3'),
  p_track => 'seller',
  p_event_type => 'sale',
  p_handicap_change => -0.5,
  p_counterparty_id => (SELECT id FROM public.profiles WHERE username = 'testuser4'),
  p_order_id => 'test-prestige-1'::UUID,
  p_order_value_cents => 5999
);
```

- [ ] Function returns success: true
- [ ] handicap_before: 0.5
- [ ] handicap_after: 18.0 (reset!)
- [ ] tier: 'eagle' (upgraded!)
- [ ] prestige: 1 (incremented!)
- [ ] prestiged: true

### Test: Verify Prestige Event

```sql
SELECT * FROM public.prestige_events 
WHERE user_id = (SELECT id FROM public.profiles WHERE username = 'testuser3')
ORDER BY created_at DESC LIMIT 1;
```

- [ ] from_tier: 'birdie'
- [ ] to_tier: 'eagle'
- [ ] prestige_level: 1
- [ ] credit_awarded_cents: 1000 ($10)

### Test: Verify Profile After Prestige

```sql
SELECT handicap_seller, tier_seller, prestige_seller 
FROM public.profiles 
WHERE username = 'testuser3';
```

- [ ] handicap_seller: 18.0 (reset to start)
- [ ] tier_seller: 'eagle'
- [ ] prestige_seller: 1

---

## ⏱️ Phase 4: Weekly Cap Testing

### Setup

1. [ ] **Set up capped user**
   ```sql
   UPDATE public.profiles
   SET 
     phone_verified = TRUE,
     weekly_points_earned = 1.9,
     week_start_date = CURRENT_DATE
   WHERE username = 'testuser5';
   ```

### Test: Can Award 0.1

```sql
SELECT public.award_handicap_points(
  p_user_id => (SELECT id FROM public.profiles WHERE username = 'testuser5'),
  p_track => 'seller',
  p_event_type => 'sale',
  p_handicap_change => -0.1,
  p_counterparty_id => NULL,
  p_order_id => 'test-cap-1'::UUID,
  p_order_value_cents => 5999
);
```

- [ ] success: true (1.9 + 0.1 = 2.0, at cap but allowed)

### Test: Cannot Award More

```sql
SELECT public.award_handicap_points(
  p_user_id => (SELECT id FROM public.profiles WHERE username = 'testuser5'),
  p_track => 'seller',
  p_event_type => 'sale',
  p_handicap_change => -0.1,
  p_counterparty_id => NULL,
  p_order_id => 'test-cap-2'::UUID,
  p_order_value_cents => 5999
);
```

- [ ] success: false
- [ ] error: 'Weekly points cap reached'

---

## 🔄 Phase 5: Trigger Testing

### Prerequisite: Orders Table Check

```sql
-- Verify orders table has these columns:
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'orders' 
AND column_name IN ('seller_id', 'buyer_id', 'status', 'total_cents', 'shipped_at', 'paid_at');
```

- [ ] All required columns exist

### Test 1: Order Completion Trigger

```sql
-- Update an order to 'completed' status
UPDATE public.orders
SET status = 'completed', paid_at = NOW(), shipped_at = NOW() + INTERVAL '24 hours'
WHERE id = 'test-order-uuid';

-- Check if points were awarded
SELECT COUNT(*) FROM public.handicap_events
WHERE order_id = 'test-order-uuid' AND event_type IN ('sale', 'purchase');
```

- [ ] 2 new handicap_events created (seller + buyer)

### Test 2: Review Trigger

```sql
-- Insert a test review
INSERT INTO public.reviews (id, order_id, reviewer_id, seller_id, rating)
VALUES (
  'test-review-1'::UUID,
  'test-order-uuid'::UUID,
  (SELECT id FROM public.profiles WHERE username = 'testuser1'),
  (SELECT id FROM public.profiles WHERE username = 'testuser2'),
  5
);

-- Check if points were awarded
SELECT COUNT(*) FROM public.handicap_events
WHERE order_id = 'test-order-uuid' AND event_type IN ('review_given', 'review_received');
```

- [ ] 2 new handicap_events created (reviewer -0.2, seller -0.3 for 5 stars)

---

## 🧹 Phase 6: Cleanup & Reset

After all tests complete:

- [ ] **Delete test events**
  ```sql
  DELETE FROM public.handicap_events 
  WHERE order_id LIKE 'test-order-%' OR order_id LIKE 'test-prestige-%';
  ```

- [ ] **Delete test prestige events**
  ```sql
  DELETE FROM public.prestige_events 
  WHERE user_id IN (SELECT id FROM public.profiles WHERE username LIKE 'testuser%');
  ```

- [ ] **Delete test cooldowns**
  ```sql
  DELETE FROM public.counterparty_cooldowns 
  WHERE user_id IN (SELECT id FROM public.profiles WHERE username LIKE 'testuser%');
  ```

- [ ] **Reset test profiles**
  ```sql
  UPDATE public.profiles
  SET 
    handicap_seller = 18.0,
    handicap_buyer = 18.0,
    prestige_seller = 0,
    prestige_buyer = 0,
    tier_seller = 'birdie',
    tier_buyer = 'birdie',
    phone_verified = FALSE,
    weekly_points_earned = 0,
    daily_transactions_count = 0
  WHERE username LIKE 'testuser%';
  ```

---

## 📋 Phase 7: Production Readiness

- [ ] All tests passed ✅
- [ ] No errors in function execution
- [ ] Triggers working correctly
- [ ] Audit trail entries created
- [ ] Anti-gaming measures functional
- [ ] Frontend code reviewed (not deployed yet)
- [ ] Team notified of changes
- [ ] Monitoring setup (queries saved)
- [ ] Rollback plan documented
- [ ] Performance baseline recorded

### Performance Baseline

```sql
-- Record query performance before high-volume testing
EXPLAIN ANALYZE
SELECT * FROM public.handicap_events 
WHERE user_id = 'user-uuid' 
ORDER BY created_at DESC LIMIT 10;

EXPLAIN ANALYZE
SELECT * FROM public.counterparty_cooldowns
WHERE user_id = 'user-uuid' 
AND last_earned_at > NOW() - INTERVAL '30 days';
```

- [ ] Query time: ___ ms (document)
- [ ] Index usage: efficient ✅

---

## 🚀 Deployment Checklist

When ready to go live:

- [ ] SQL migration deployed to production database
- [ ] All tables verified in production
- [ ] Triggers confirmed active
- [ ] Test data cleaned up
- [ ] Frontend code deployed (includes new handicap columns)
- [ ] AuthContext updated with new profile fields
- [ ] Header component showing handicap
- [ ] Profile page showing tier/prestige
- [ ] Phone verification flow implemented
- [ ] Monitoring queries running
- [ ] Alerts configured for anti-gaming
- [ ] Team trained on new system
- [ ] Documentation updated
- [ ] Blog post scheduled (optional)
- [ ] Launch announcement ready

---

## 📞 Issues Found During Testing?

Document here:

### Issue #1
```
Description:
Reproduction:
Solution:
Status: [ ] Fixed [ ] Pending
```

### Issue #2
```
Description:
Reproduction:
Solution:
Status: [ ] Fixed [ ] Pending
```

---

**All tests passing?** Great! You're ready to deploy to production! 🎉
