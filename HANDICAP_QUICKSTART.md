# 🚀 Handicap System v2.0 - Quick Start (5 Minutes)

Read this first if you want to understand the system in 5 minutes.

---

## 🎯 The Big Picture

**Problem:** How do we reward users for being good sellers/buyers?  
**Solution:** Golf-inspired progression system (start at 18, improve to 0, then level up)

---

## 📊 In 30 Seconds

```
New users start at 18.0 handicap (beginner golfer)
↓
As they complete sales/purchases/reviews, handicap decreases
↓
Reach 0.0 = automatic tier up (birdie → eagle → albatross → hole-in-one)
↓
Handicap resets to 18.0, but they keep all new benefits
↓
Rinse and repeat
```

---

## ⚙️ How Points are Earned

### Seller (For Selling)
- **Sale:** -0.5 ✅ Automatic
- **5-star review:** -0.3 ✅ Automatic  
- **Fast shipping (<48h):** -0.2 ✅ Automatic
- **Referral:** -1.0 (need to build)

### Buyer (For Buying)
- **Purchase:** -0.5 ✅ Automatic
- **Review left:** -0.2 ✅ Automatic
- **Referral:** -1.0 (need to build)

**✅ = Automatic (trigger fires)** | **📝 = Manual (need to build)**

---

## 🛡️ Anti-Gaming (What Prevents Cheating)

1. **Phone verification** - Can't earn without it
2. **Minimum order** - Must be $10+
3. **Cooldown** - Can't earn from same person for 30 days
4. **Daily cap** - Max 5 transactions per day
5. **Weekly cap** - Max 2.0 points per week
6. **Refund clawback** - Get points back if refunded

---

## 🎁 Tier Benefits

| Tier | Prestige | Fee | Payout | Drop Access |
|------|----------|-----|--------|-------------|
| 🐦 Birdie | 0 | 10% | 5 days | None |
| 🦅 Eagle | 1 | 9.5% | 3 days | 1 hour early |
| 🌟 Albatross | 2 | 9% | 2 days | 2 hours early |
| 🏆 Hole-in-One | 3+ | 8.5% | 1 day | 3 hours early |

Each tier gets better fees, faster payouts, and early drop access.

---

## 📦 What Was Built

| File | Purpose | Size |
|------|---------|------|
| `supabase/handicap-system-v2.sql` | Database migration | 1,400 lines |
| `HANDICAP_IMPLEMENTATION.md` | Setup guide | 500 lines |
| `HANDICAP_TESTING.md` | Testing checklist | 400 lines |
| `HANDICAP_QUERIES.md` | SQL queries | 350 lines |
| `HANDICAP_SUMMARY.md` | Detailed summary | 300 lines |

---

## ⏱️ Deployment Timeline

| Phase | Time | What |
|-------|------|------|
| **Deploy** | 5 min | Copy SQL to Supabase |
| **Verify** | 5 min | Run verification queries |
| **Test** | 1-2 hrs | Run test suite |
| **Frontend** | 1-2 hrs | Update React code |
| **Launch** | 1 hr | Final checks, go live |
| **Monitor** | Ongoing | Watch for anomalies |

---

## 🔧 Technical Architecture

### Database (3 new tables)

1. **handicap_events** - Audit trail (every point change logged)
2. **counterparty_cooldowns** - 30-day protection against repeat earnings
3. **prestige_events** - Milestone tracking (when users tier up)

### Main Function

```sql
award_handicap_points(user_id, track, event_type, change, ...)
```

Handles ALL validation and point awarding. Called by:
- Triggers (automatic)
- Manual calls (for special bonuses)

### Triggers (3 automatic)

1. **Order completes** → Award seller & buyer
2. **Review created** → Award based on stars
3. **Order refunded** → Clawback points

---

## ✨ What Happens Automatically

After you deploy:

✅ **Order Completion Trigger**
```
Admin marks order complete → Seller gets -0.5 → Buyer gets -0.5
+ If shipped <48h: Seller also gets -0.2 bonus
```

✅ **Review Trigger**
```
Buyer leaves 5-star review → Buyer gets -0.2 → Seller gets -0.3
```

✅ **Prestige Detection**
```
User reaches 0.0 handicap → Tier upgrades → Handicap resets to 18.0
+ Prestige increases (permanent)
```

✅ **Weekly Reset**
```
Every Sunday 00:00 UTC → Point counters reset
```

---

## 🚨 What Still Needs Building

These don't auto-trigger yet:

- [ ] Referral detection (when referred user signs up)
- [ ] Milestone detection (10th listing, 10 saves)
- [ ] Caddie outfit detection (3+ items in order)
- [ ] Dispute penalties (when disputes resolved)
- [ ] Phone verification UI (verification form)
- [ ] Prestige notifications (when user tiers up)
- [ ] Rewards claims ($10 credit redemption)

---

## 📱 Frontend Updates Needed

1. **AuthContext** - Add new profile fields:
   ```tsx
   handicap_seller: number
   handicap_buyer: number
   prestige_seller: number
   tier_seller: string
   phone_verified: boolean
   ```

2. **Header Component** - Show handicap:
   ```tsx
   {profile.tier_seller} • {profile.handicap_seller.toFixed(1)} Handicap
   ```

3. **Profile Page** - Show tier benefits and progress bar

4. **Phone Verification** - Build UI for verification flow

---

## 🧪 Testing (20 minutes)

Run these key tests:

```sql
-- Test 1: Award points
SELECT public.award_handicap_points(user_id, 'seller', 'sale', -0.5, ...);

-- Test 2: Verify prestige
UPDATE profiles SET handicap_seller = 0.1 WHERE username = 'testuser';
SELECT award_handicap_points(..., -0.1, ...);  -- Should tier up

-- Test 3: Anti-gaming
-- Try to award twice to same counterparty → Should fail
```

See HANDICAP_TESTING.md for full test suite.

---

## 📊 Live Monitoring

Once deployed, monitor these:

```sql
-- Gaming attempts (daily)
SELECT COUNT(*) FROM handicap_events WHERE DATE(created_at) = CURRENT_DATE;

-- Prestige rate (weekly)
SELECT COUNT(*) FROM prestige_events WHERE created_at > NOW() - INTERVAL '7 days';

-- Weekly cap enforcement (weekly)
SELECT SUM(ABS(handicap_change)) FROM handicap_events 
WHERE created_at > CURRENT_DATE - INTERVAL '7 days' 
GROUP BY user_id;
```

---

## ❓ FAQs

### Q: Can users lose their tier?
**A:** No - prestige is permanent. Even if handicap goes up later, tier stays.

### Q: What if someone's order is refunded?
**A:** Points are clawed back automatically (trigger handles it).

### Q: How much does prestige boost earning?
**A:** -10% for Eagle, -15% for Albatross, -20% for Hole-in-One (algorithm boost).

### Q: Can someone prestige multiple times?
**A:** Yes - they can reach 0.0 multiple times if they keep earning enough.

### Q: Are there any limits?
**A:** Yes - weekly cap (-2.0), daily cap (5 transactions), 30-day cooldown per pair.

### Q: What if the trigger fails?
**A:** Use manual `award_handicap_points()` function call (documented in queries).

---

## 🎯 Success Metrics

After going live, watch for:

✅ **Usage:** Are users seeing their handicap?  
✅ **Progression:** Are users reaching 0.0 and prestiging?  
✅ **Gaming:** Are anti-gaming measures working?  
✅ **Performance:** Are queries fast enough?  
✅ **Revenue:** Are prestige tiers incentivizing better behavior?

---

## 🚀 Ready to Deploy?

1. **Read:** HANDICAP_IMPLEMENTATION.md (full guide)
2. **Deploy:** Copy `supabase/handicap-system-v2.sql` to Supabase SQL Editor
3. **Test:** Run HANDICAP_TESTING.md test suite
4. **Build:** Update frontend code
5. **Monitor:** Use HANDICAP_QUERIES.md monitoring queries
6. **Launch:** Go live! 🎉

---

## 📞 Need More Details?

| Question | Document |
|----------|----------|
| How do I deploy? | HANDICAP_IMPLEMENTATION.md |
| How do I test? | HANDICAP_TESTING.md |
| What queries can I run? | HANDICAP_QUERIES.md |
| Full technical spec? | Your specification doc |
| System overview? | HANDICAP_SUMMARY.md |

---

**Ready?** Start with HANDICAP_IMPLEMENTATION.md → Deploy → Test → Launch! 🚀
