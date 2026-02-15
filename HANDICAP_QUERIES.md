# Handicap System - SQL Query Reference

Quick SQL queries for common operations and monitoring.

---

## 📊 User Handicap Queries

### Get User's Handicap & Tier Info

```sql
SELECT 
  username,
  handicap_seller,
  tier_seller,
  prestige_seller,
  handicap_buyer,
  tier_buyer,
  prestige_buyer,
  phone_verified,
  weekly_points_earned,
  last_transaction_date
FROM public.profiles
WHERE username = 'target_username';
```

### Show User's Full Progression History

```sql
SELECT 
  event_type,
  track,
  handicap_before,
  handicap_after,
  handicap_change,
  (SELECT username FROM public.profiles WHERE id = counterparty_id) as counterparty,
  order_value_cents,
  created_at
FROM public.handicap_events
WHERE user_id = 'user-uuid'
ORDER BY created_at DESC;
```

### Check Current Week's Points

```sql
SELECT 
  username,
  weekly_points_earned,
  weekly_posts_points,
  daily_transactions_count,
  week_start_date
FROM public.profiles
WHERE username = 'target_username';
```

---

## 🎯 Prestige & Tier Queries

### Show All Tier Upgrades

```sql
SELECT 
  (SELECT username FROM public.profiles WHERE id = prestige_events.user_id) as username,
  track,
  from_tier,
  to_tier,
  prestige_level,
  credit_awarded_cents,
  created_at
FROM public.prestige_events
ORDER BY created_at DESC;
```

### Users at Each Tier (Seller)

```sql
SELECT 
  tier_seller,
  COUNT(*) as user_count,
  AVG(handicap_seller) as avg_handicap,
  MAX(prestige_seller) as max_prestige
FROM public.profiles
GROUP BY tier_seller
ORDER BY prestige_seller DESC;
```

### Top Prestigious Users (Most Prestige Ups)

```sql
SELECT 
  (SELECT username FROM public.profiles WHERE id = prestige_events.user_id) as username,
  track,
  MAX(prestige_level) as highest_prestige,
  COUNT(*) as total_prestiges,
  MAX(created_at) as last_prestige
FROM public.prestige_events
GROUP BY user_id, track
ORDER BY highest_prestige DESC
LIMIT 20;
```

---

## 🛡️ Anti-Gaming Detection

### Users Hitting Daily Limit (Today)

```sql
SELECT 
  (SELECT username FROM public.profiles WHERE id = user_id) as username,
  track,
  COUNT(*) as event_count,
  SUM(ABS(handicap_change)) as total_improvement
FROM public.handicap_events
WHERE DATE(created_at) = CURRENT_DATE
GROUP BY user_id, track
HAVING COUNT(*) >= 5
ORDER BY COUNT(*) DESC;
```

### Users Hitting Weekly Cap

```sql
SELECT 
  (SELECT username FROM public.profiles WHERE id = user_id) as username,
  WEEK(created_at) as week,
  track,
  COUNT(*) as event_count,
  ROUND(SUM(ABS(handicap_change))::NUMERIC, 1) as total_improvement
FROM public.handicap_events
WHERE created_at > CURRENT_DATE - INTERVAL '7 days'
GROUP BY user_id, WEEK(created_at), track
HAVING SUM(ABS(handicap_change)) >= 2.0
ORDER BY total_improvement DESC;
```

### Potential Gaming: Same Counterparty Too Often

```sql
SELECT 
  (SELECT username FROM public.profiles WHERE id = user_id) as username,
  (SELECT username FROM public.profiles WHERE id = counterparty_id) as counterparty,
  COUNT(*) as transaction_count,
  MIN(created_at) as first_date,
  MAX(created_at) as last_date,
  ROUND(AVG(order_value_cents)::NUMERIC/100, 2) as avg_order_value
FROM public.handicap_events
WHERE counterparty_id IS NOT NULL
GROUP BY user_id, counterparty_id
HAVING COUNT(*) > 1
ORDER BY transaction_count DESC;
```

### Cooldown Status Check

```sql
SELECT 
  (SELECT username FROM public.profiles WHERE id = user_id) as username,
  (SELECT username FROM public.profiles WHERE id = counterparty_id) as counterparty,
  track,
  last_earned_at,
  CASE 
    WHEN last_earned_at > NOW() - INTERVAL '30 days' THEN 'ACTIVE'
    ELSE 'EXPIRED'
  END as cooldown_status,
  (last_earned_at + INTERVAL '30 days')::DATE as expires_on
FROM public.counterparty_cooldowns
WHERE last_earned_at > NOW() - INTERVAL '30 days'
ORDER BY last_earned_at DESC;
```

### Phone Verification Status

```sql
-- Count verified vs unverified
SELECT 
  phone_verified,
  COUNT(*) as user_count,
  ROUND(100.0 * COUNT(*) / (SELECT COUNT(*) FROM public.profiles), 1) as percentage
FROM public.profiles
GROUP BY phone_verified;

-- Unverified users (cannot earn points yet)
SELECT 
  username,
  email,
  created_at,
  tier_seller,
  handicap_seller
FROM public.profiles
WHERE phone_verified = FALSE
ORDER BY created_at DESC;
```

---

## 📈 Analytics & Trends

### Point-Earning Event Breakdown

```sql
SELECT 
  event_type,
  track,
  COUNT(*) as event_count,
  ROUND(AVG(ABS(handicap_change))::NUMERIC, 2) as avg_reduction,
  ROUND(SUM(ABS(handicap_change))::NUMERIC, 1) as total_reductions
FROM public.handicap_events
WHERE created_at > CURRENT_DATE - INTERVAL '30 days'
GROUP BY event_type, track
ORDER BY total_reductions DESC;
```

### Most Active Point Earners (Last 7 Days)

```sql
SELECT 
  (SELECT username FROM public.profiles WHERE id = user_id) as username,
  COUNT(*) as events,
  ROUND(SUM(ABS(handicap_change))::NUMERIC, 1) as total_improvement,
  ROUND(AVG(order_value_cents)::NUMERIC/100, 2) as avg_order_value,
  MIN(created_at) as first_event,
  MAX(created_at) as last_event
FROM public.handicap_events
WHERE created_at > CURRENT_DATE - INTERVAL '7 days'
GROUP BY user_id
ORDER BY total_improvement DESC
LIMIT 20;
```

### Prestige Rate (Progression Velocity)

```sql
SELECT 
  DATE_TRUNC('day', created_at)::DATE as date,
  COUNT(*) as prestiges_per_day,
  COUNT(DISTINCT user_id) as unique_users_prestiged
FROM public.prestige_events
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY date DESC;
```

### Average Time to Next Tier

```sql
-- This is estimation based on recent activity
WITH user_rates AS (
  SELECT 
    user_id,
    AVG(ABS(handicap_change)) as avg_daily_improvement
  FROM public.handicap_events
  WHERE created_at > CURRENT_DATE - INTERVAL '30 days'
  GROUP BY user_id
)
SELECT 
  (SELECT username FROM public.profiles WHERE id = ur.user_id) as username,
  (SELECT handicap_seller FROM public.profiles WHERE id = ur.user_id) as current_handicap,
  ROUND(ur.avg_daily_improvement * 365 / 18::NUMERIC, 1) as estimated_years_to_prestige
FROM user_rates ur
WHERE ur.avg_daily_improvement > 0
ORDER BY estimated_years_to_prestige ASC
LIMIT 20;
```

---

## 🔧 Maintenance Queries

### Reset Weekly Counters Manually

```sql
-- Run this if week_start_date is incorrect
UPDATE public.profiles
SET 
  weekly_points_earned = 0,
  weekly_posts_points = 0,
  week_start_date = CURRENT_DATE
WHERE week_start_date < DATE_TRUNC('week', CURRENT_DATE)::DATE;
```

### Reset Daily Counters Manually

```sql
-- Run this at start of each day (e.g., via scheduled task)
UPDATE public.profiles
SET 
  daily_transactions_count = 0,
  last_transaction_date = NULL
WHERE last_transaction_date < CURRENT_DATE;
```

### Manual Point Award (Admin Use Only)

```sql
-- Award points manually (e.g., for referral bonus, milestone detection, etc.)
-- Only use if trigger didn't fire properly
SELECT public.award_handicap_points(
  p_user_id => 'user-uuid'::UUID,
  p_track => 'seller',  -- or 'buyer'
  p_event_type => 'sale',  -- or other event type
  p_handicap_change => -0.5,  -- negative = improvement
  p_counterparty_id => 'counterparty-uuid'::UUID,
  p_order_id => 'order-uuid'::UUID,
  p_order_value_cents => 5999
);
```

### Manual Point Clawback (Dispute/Fraud)

```sql
-- Clawback points for disputed/fraudulent activity
SELECT public.award_handicap_points(
  p_user_id => 'user-uuid'::UUID,
  p_track => 'seller',
  p_event_type => 'dispute_penalty',
  p_handicap_change => +0.5,  -- positive = penalty
  p_counterparty_id => NULL,
  p_order_id => 'order-uuid'::UUID,
  p_order_value_cents => NULL
);
```

### Verify Phone for User

```sql
-- When user completes phone verification
UPDATE public.profiles
SET phone_verified = TRUE
WHERE username = 'target_username';
```

---

## 🐛 Debugging Queries

### Check Function Execution

```sql
-- See if award_handicap_points function exists and is working
SELECT routine_name, routine_type, routine_definition
FROM information_schema.routines
WHERE routine_name = 'award_handicap_points';
```

### Check Trigger Status

```sql
-- Verify triggers are enabled
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_orientation,
  action_statement
FROM information_schema.triggers
WHERE event_object_table IN ('orders', 'reviews')
ORDER BY trigger_name;
```

### Find Failed Function Calls

```sql
-- If function returned errors, check the JSON response
-- This requires logging in your app layer
-- But you can see when points DON'T update:
SELECT 
  user_id,
  MAX(created_at) as last_points_earned
FROM public.handicap_events
WHERE user_id = 'user-uuid'
GROUP BY user_id;

-- Then compare to order dates to see gaps
```

### Verify Database Integrity

```sql
-- Check for orphaned records
SELECT COUNT(*) as orphaned_events
FROM public.handicap_events
WHERE user_id NOT IN (SELECT id FROM public.profiles);

SELECT COUNT(*) as orphaned_cooldowns
FROM public.counterparty_cooldowns
WHERE user_id NOT IN (SELECT id FROM public.profiles)
  OR counterparty_id NOT IN (SELECT id FROM public.profiles);
```

---

## 📋 Scheduled Task Examples

If you're using a cron/job scheduler:

### Daily: Reset Transaction Counters

```sql
-- Run at 00:00 UTC daily
UPDATE public.profiles
SET 
  daily_transactions_count = 0,
  last_transaction_date = NULL
WHERE last_transaction_date < CURRENT_DATE
  AND daily_transactions_count > 0;
```

### Weekly: Log Weekly Cap Report

```sql
-- Run at 00:00 UTC on Monday
SELECT 
  username,
  track,
  SUM(ABS(handicap_change)) as weekly_points,
  COUNT(*) as events
FROM public.handicap_events
JOIN public.profiles ON handicap_events.user_id = profiles.id
WHERE handicap_events.created_at > CURRENT_DATE - INTERVAL '7 days'
GROUP BY user_id, username, track
HAVING SUM(ABS(handicap_change)) >= 2.0;
```

### Monthly: Prestige Anniversary

```sql
-- Run on first of month
SELECT 
  username,
  tier_seller,
  prestige_seller,
  MAX(created_at) as last_prestige_date
FROM public.prestige_events
JOIN public.profiles ON prestige_events.user_id = profiles.id
WHERE EXTRACT(MONTH FROM created_at) = EXTRACT(MONTH FROM CURRENT_DATE)
GROUP BY user_id, username, tier_seller, prestige_seller;
```

---

## 💡 Export for Analysis

### Export All Events (Last 30 Days)

```sql
\COPY (
  SELECT 
    (SELECT username FROM public.profiles WHERE id = user_id) as username,
    event_type,
    track,
    handicap_before,
    handicap_after,
    order_value_cents,
    created_at
  FROM public.handicap_events
  WHERE created_at > CURRENT_DATE - INTERVAL '30 days'
  ORDER BY created_at DESC
) TO '/tmp/handicap_events.csv' WITH CSV HEADER;
```

### Export Prestige Milestones

```sql
\COPY (
  SELECT 
    (SELECT username FROM public.profiles WHERE id = user_id) as username,
    track,
    from_tier,
    to_tier,
    prestige_level,
    credit_awarded_cents,
    created_at
  FROM public.prestige_events
  ORDER BY created_at DESC
) TO '/tmp/prestige_events.csv' WITH CSV HEADER;
```

---

**Questions?** Check the implementation guide or technical specification!
