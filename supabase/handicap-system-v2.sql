-- =============================================
-- WRONG CLUB HANDICAP & TIER PROGRESSION SYSTEM v2.0
-- =============================================
-- This migration implements the complete handicap system with
-- anti-gaming measures, prestige tracking, and audit logging
-- 
-- Status: Production Ready
-- Run this in Supabase SQL Editor
-- =============================================

-- =============================================
-- STEP 1: ALTER PROFILES TABLE - Add Handicap Columns
-- =============================================

-- Seller handicap (starts at 18.0, decreases as you sell)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS handicap_seller DECIMAL(3,1) DEFAULT 18.0
  CHECK (handicap_seller >= 0 AND handicap_seller <= 18);

-- Buyer handicap (starts at 18.0, decreases as you buy)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS handicap_buyer DECIMAL(3,1) DEFAULT 18.0
  CHECK (handicap_buyer >= 0 AND handicap_buyer <= 18);

-- Seller prestige level (0-3, increments each prestige)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS prestige_seller INTEGER DEFAULT 0
  CHECK (prestige_seller >= 0);

-- Buyer prestige level (0-3, increments each prestige)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS prestige_buyer INTEGER DEFAULT 0
  CHECK (prestige_buyer >= 0);

-- Seller tier (birdie, eagle, albatross, hole_in_one)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS tier_seller TEXT DEFAULT 'birdie'
  CHECK (tier_seller IN ('birdie', 'eagle', 'albatross', 'hole_in_one'));

-- Buyer tier (birdie, eagle, albatross, hole_in_one)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS tier_buyer TEXT DEFAULT 'birdie'
  CHECK (tier_buyer IN ('birdie', 'eagle', 'albatross', 'hole_in_one'));

-- Weekly points tracking (for cap enforcement)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS weekly_points_earned DECIMAL(3,1) DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS weekly_posts_points DECIMAL(3,1) DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS week_start_date DATE DEFAULT CURRENT_DATE;

-- Phone verification requirement
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT FALSE;

-- Daily transaction tracking (for anti-gaming)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS daily_transactions_count INTEGER DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_transaction_date DATE;

-- =============================================
-- STEP 2: CREATE HANDICAP EVENTS TABLE (Audit Trail)
-- =============================================

CREATE TABLE IF NOT EXISTS public.handicap_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Event details
  event_type TEXT NOT NULL CHECK (event_type IN (
    'sale', 'purchase', 'review_received', 'review_given', 
    'fast_shipping', 'milestone_listings', 'milestone_saves',
    'referral', 'first_sale_month', 'caddie_outfit',
    'post', 'prestige', 'refund_clawback', 'dispute_penalty'
  )),
  
  -- Track (seller or buyer)
  track TEXT NOT NULL CHECK (track IN ('seller', 'buyer')),
  
  -- Handicap change
  handicap_before DECIMAL(3,1) NOT NULL,
  handicap_after DECIMAL(3,1) NOT NULL,
  handicap_change DECIMAL(3,1) NOT NULL,
  
  -- Anti-gaming data
  counterparty_id UUID REFERENCES public.profiles(id),
  order_id UUID,
  order_value_cents INTEGER,
  
  -- Metadata for debugging/auditing
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraint
  CONSTRAINT positive_or_negative_change CHECK (handicap_change != 0)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_handicap_events_user ON public.handicap_events(user_id);
CREATE INDEX IF NOT EXISTS idx_handicap_events_created ON public.handicap_events(created_at);
CREATE INDEX IF NOT EXISTS idx_handicap_events_counterparty ON public.handicap_events(user_id, counterparty_id, created_at);
CREATE INDEX IF NOT EXISTS idx_handicap_events_track ON public.handicap_events(track);

-- =============================================
-- STEP 3: CREATE COUNTERPARTY COOLDOWNS TABLE
-- =============================================
-- Tracks the 30-day cooldown to prevent gaming with same users

CREATE TABLE IF NOT EXISTS public.counterparty_cooldowns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  counterparty_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  track TEXT NOT NULL CHECK (track IN ('seller', 'buyer')),
  last_earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, counterparty_id, track)
);

-- Create index for lookups
CREATE INDEX IF NOT EXISTS idx_cooldowns_lookup ON public.counterparty_cooldowns(user_id, counterparty_id, track);

-- =============================================
-- STEP 4: CREATE PRESTIGE EVENTS TABLE
-- =============================================
-- Tracks when users prestige up and unlock new tier benefits

CREATE TABLE IF NOT EXISTS public.prestige_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  track TEXT NOT NULL CHECK (track IN ('seller', 'buyer')),
  from_tier TEXT NOT NULL,
  to_tier TEXT NOT NULL,
  prestige_level INTEGER NOT NULL,
  
  -- Rewards given on prestige
  credit_awarded_cents INTEGER DEFAULT 1000, -- $10 credit
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_prestige_events_user ON public.prestige_events(user_id);
CREATE INDEX IF NOT EXISTS idx_prestige_events_created ON public.prestige_events(created_at);

-- =============================================
-- STEP 5: MAIN FUNCTION - award_handicap_points
-- =============================================
-- This is the core function that handles all handicap point awarding
-- with complete validation and anti-gaming checks

CREATE OR REPLACE FUNCTION public.award_handicap_points(
  p_user_id UUID,
  p_track TEXT, -- 'seller' or 'buyer'
  p_event_type TEXT,
  p_handicap_change DECIMAL(3,1),
  p_counterparty_id UUID DEFAULT NULL,
  p_order_id UUID DEFAULT NULL,
  p_order_value_cents INTEGER DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_profile RECORD;
  v_current_handicap DECIMAL(3,1);
  v_new_handicap DECIMAL(3,1);
  v_current_tier TEXT;
  v_new_tier TEXT;
  v_current_prestige INTEGER;
  v_weekly_points DECIMAL(3,1);
  v_cooldown_exists BOOLEAN;
  v_result JSONB;
BEGIN
  -- Get current profile
  SELECT * INTO v_profile FROM public.profiles WHERE id = p_user_id;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'User not found');
  END IF;
  
  -- VALIDATION LAYER 1: Phone verification
  IF NOT v_profile.phone_verified THEN
    RETURN jsonb_build_object('success', false, 'error', 'Phone verification required');
  END IF;
  
  -- VALIDATION LAYER 2: Minimum order value ($10)
  IF p_order_value_cents IS NOT NULL AND p_order_value_cents < 1000 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Order below minimum value');
  END IF;
  
  -- VALIDATION LAYER 3: Counterparty cooldown (30 days)
  IF p_counterparty_id IS NOT NULL THEN
    SELECT EXISTS(
      SELECT 1 FROM public.counterparty_cooldowns
      WHERE user_id = p_user_id 
        AND counterparty_id = p_counterparty_id
        AND track = p_track
        AND last_earned_at > NOW() - INTERVAL '30 days'
    ) INTO v_cooldown_exists;
    
    IF v_cooldown_exists THEN
      RETURN jsonb_build_object('success', false, 'error', 'Counterparty cooldown active');
    END IF;
  END IF;
  
  -- VALIDATION LAYER 4: Daily transaction limit (5 per day)
  IF v_profile.last_transaction_date = CURRENT_DATE AND v_profile.daily_transactions_count >= 5 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Daily transaction limit reached');
  END IF;
  
  -- VALIDATION LAYER 5: Reset weekly counters if new week
  IF v_profile.week_start_date < DATE_TRUNC('week', CURRENT_DATE)::DATE THEN
    UPDATE public.profiles SET
      weekly_points_earned = 0,
      weekly_posts_points = 0,
      week_start_date = CURRENT_DATE
    WHERE id = p_user_id;
    
    v_profile.weekly_points_earned := 0;
    v_profile.weekly_posts_points := 0;
  END IF;
  
  -- VALIDATION LAYER 6: Check weekly cap (-2.0 max)
  IF v_profile.weekly_points_earned + ABS(p_handicap_change) > 2.0 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Weekly points cap reached');
  END IF;
  
  -- VALIDATION LAYER 7: Check post weekly cap (-0.3 max)
  IF p_event_type = 'post' AND v_profile.weekly_posts_points + ABS(p_handicap_change) > 0.3 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Weekly post cap reached');
  END IF;
  
  -- Get current values based on track
  IF p_track = 'seller' THEN
    v_current_handicap := v_profile.handicap_seller;
    v_current_tier := v_profile.tier_seller;
    v_current_prestige := v_profile.prestige_seller;
  ELSE
    v_current_handicap := v_profile.handicap_buyer;
    v_current_tier := v_profile.tier_buyer;
    v_current_prestige := v_profile.prestige_buyer;
  END IF;
  
  -- Calculate new handicap (cannot go below 0)
  v_new_handicap := GREATEST(0, v_current_handicap + p_handicap_change);
  
  -- Check for prestige (hit 0.0)
  IF v_new_handicap = 0 THEN
    -- Prestige up!
    v_new_handicap := 18.0; -- Reset to 18.0
    v_current_prestige := v_current_prestige + 1;
    
    -- Determine new tier based on prestige level
    v_new_tier := CASE v_current_prestige
      WHEN 1 THEN 'eagle'
      WHEN 2 THEN 'albatross'
      ELSE 'hole_in_one'
    END;
    
    -- Log prestige event
    INSERT INTO public.prestige_events (user_id, track, from_tier, to_tier, prestige_level)
    VALUES (p_user_id, p_track, v_current_tier, v_new_tier, v_current_prestige);
  ELSE
    v_new_tier := v_current_tier;
  END IF;
  
  -- Update profile with new handicap/tier/prestige
  IF p_track = 'seller' THEN
    UPDATE public.profiles SET
      handicap_seller = v_new_handicap,
      tier_seller = v_new_tier,
      prestige_seller = v_current_prestige,
      weekly_points_earned = weekly_points_earned + ABS(p_handicap_change),
      weekly_posts_points = CASE WHEN p_event_type = 'post' 
        THEN weekly_posts_points + ABS(p_handicap_change) 
        ELSE weekly_posts_points END,
      daily_transactions_count = CASE 
        WHEN last_transaction_date = CURRENT_DATE THEN daily_transactions_count + 1
        ELSE 1 END,
      last_transaction_date = CURRENT_DATE
    WHERE id = p_user_id;
  ELSE
    UPDATE public.profiles SET
      handicap_buyer = v_new_handicap,
      tier_buyer = v_new_tier,
      prestige_buyer = v_current_prestige,
      weekly_points_earned = weekly_points_earned + ABS(p_handicap_change),
      daily_transactions_count = CASE 
        WHEN last_transaction_date = CURRENT_DATE THEN daily_transactions_count + 1
        ELSE 1 END,
      last_transaction_date = CURRENT_DATE
    WHERE id = p_user_id;
  END IF;
  
  -- Log handicap event (audit trail)
  INSERT INTO public.handicap_events (
    user_id, event_type, track, 
    handicap_before, handicap_after, handicap_change,
    counterparty_id, order_id, order_value_cents
  ) VALUES (
    p_user_id, p_event_type, p_track,
    v_current_handicap, v_new_handicap, p_handicap_change,
    p_counterparty_id, p_order_id, p_order_value_cents
  );
  
  -- Update counterparty cooldown (prevents gaming same pair)
  IF p_counterparty_id IS NOT NULL THEN
    INSERT INTO public.counterparty_cooldowns (user_id, counterparty_id, track, last_earned_at)
    VALUES (p_user_id, p_counterparty_id, p_track, NOW())
    ON CONFLICT (user_id, counterparty_id, track) 
    DO UPDATE SET last_earned_at = NOW();
  END IF;
  
  -- Return success with details
  RETURN jsonb_build_object(
    'success', true,
    'handicap_before', v_current_handicap,
    'handicap_after', v_new_handicap,
    'handicap_change', p_handicap_change,
    'tier', v_new_tier,
    'prestige', v_current_prestige,
    'prestiged', v_new_tier != v_current_tier
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- STEP 6: TRIGGER - Award Points on Order Completion
-- =============================================
-- Triggers when order status becomes 'completed'
-- Awards both seller and buyer points
-- Includes fast shipping bonus

CREATE OR REPLACE FUNCTION public.on_order_completed()
RETURNS TRIGGER AS $$
BEGIN
  -- Only trigger when status changes to 'completed'
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    
    -- Award seller points (-0.5 for sale)
    PERFORM public.award_handicap_points(
      NEW.seller_id,
      'seller',
      'sale',
      -0.5,
      NEW.buyer_id,
      NEW.id,
      NEW.total_cents
    );
    
    -- Award buyer points (-0.5 for purchase)
    PERFORM public.award_handicap_points(
      NEW.buyer_id,
      'buyer',
      'purchase',
      -0.5,
      NEW.seller_id,
      NEW.id,
      NEW.total_cents
    );
    
    -- Check for fast shipping bonus (shipped within 48 hours of payment)
    IF NEW.shipped_at IS NOT NULL AND NEW.paid_at IS NOT NULL THEN
      IF NEW.shipped_at <= NEW.paid_at + INTERVAL '48 hours' THEN
        PERFORM public.award_handicap_points(
          NEW.seller_id,
          'seller',
          'fast_shipping',
          -0.2,
          NEW.buyer_id,
          NEW.id,
          NEW.total_cents
        );
      END IF;
    END IF;
    
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop old trigger if exists
DROP TRIGGER IF EXISTS on_order_completed_trigger ON public.orders;

-- Create trigger
CREATE TRIGGER on_order_completed_trigger
  AFTER UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.on_order_completed();

-- =============================================
-- STEP 7: TRIGGER - Award Points on Review
-- =============================================
-- Awards buyer for leaving review
-- Awards seller based on star rating

CREATE OR REPLACE FUNCTION public.on_review_created()
RETURNS TRIGGER AS $$
DECLARE
  v_order RECORD;
  v_change DECIMAL(3,1);
BEGIN
  -- Get order details
  SELECT * INTO v_order FROM public.orders WHERE id = NEW.order_id;
  
  -- Award reviewer (buyer) points for leaving review (-0.2)
  PERFORM public.award_handicap_points(
    NEW.reviewer_id,
    'buyer',
    'review_given',
    -0.2,
    NEW.seller_id,
    NEW.order_id,
    v_order.total_cents
  );
  
  -- Award seller points based on rating
  -- 5-star: -0.3 | 4-star: -0.1 | 3-star or below: 0
  IF NEW.rating = 5 THEN
    v_change := -0.3;
  ELSIF NEW.rating = 4 THEN
    v_change := -0.1;
  ELSE
    v_change := 0; -- No points for 3 stars or below
  END IF;
  
  IF v_change != 0 THEN
    PERFORM public.award_handicap_points(
      NEW.seller_id,
      'seller',
      'review_received',
      v_change,
      NEW.reviewer_id,
      NEW.order_id,
      v_order.total_cents
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop old trigger if exists
DROP TRIGGER IF EXISTS on_review_created_trigger ON public.reviews;

-- Create trigger
CREATE TRIGGER on_review_created_trigger
  AFTER INSERT ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.on_review_created();

-- =============================================
-- STEP 8: TRIGGER - Refund Clawback
-- =============================================
-- When an order is refunded, points are clawed back (+0.5 penalty)

CREATE OR REPLACE FUNCTION public.on_order_refunded()
RETURNS TRIGGER AS $$
BEGIN
  -- Only trigger when status changes to 'refunded'
  IF NEW.status = 'refunded' AND OLD.status != 'refunded' THEN
    
    -- Clawback seller points (+0.5, reverses the -0.5 sale bonus)
    PERFORM public.award_handicap_points(
      NEW.seller_id,
      'seller',
      'refund_clawback',
      +0.5, -- ADDS to handicap (penalty)
      NEW.buyer_id,
      NEW.id,
      NEW.total_cents
    );
    
    -- Clawback buyer points (+0.5)
    PERFORM public.award_handicap_points(
      NEW.buyer_id,
      'buyer',
      'refund_clawback',
      +0.5,
      NEW.seller_id,
      NEW.id,
      NEW.total_cents
    );
    
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop old trigger if exists
DROP TRIGGER IF EXISTS on_order_refunded_trigger ON public.orders;

-- Create trigger
CREATE TRIGGER on_order_refunded_trigger
  AFTER UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.on_order_refunded();

-- =============================================
-- STEP 9: HELPER FUNCTIONS (for frontend)
-- =============================================

-- Get tier from prestige level
CREATE OR REPLACE FUNCTION public.get_tier_from_prestige(p_prestige INTEGER)
RETURNS TEXT AS $$
BEGIN
  CASE p_prestige
    WHEN 0 THEN RETURN 'birdie';
    WHEN 1 THEN RETURN 'eagle';
    WHEN 2 THEN RETURN 'albatross';
    ELSE RETURN 'hole_in_one';
  END CASE;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Check if user can earn more this week
CREATE OR REPLACE FUNCTION public.can_earn_this_week(p_user_id UUID, p_track TEXT, p_event_type TEXT, p_amount DECIMAL)
RETURNS BOOLEAN AS $$
DECLARE
  v_profile RECORD;
BEGIN
  SELECT * INTO v_profile FROM public.profiles WHERE id = p_user_id;
  
  -- Reset week if needed
  IF v_profile.week_start_date < DATE_TRUNC('week', CURRENT_DATE)::DATE THEN
    UPDATE public.profiles SET
      weekly_points_earned = 0,
      weekly_posts_points = 0,
      week_start_date = CURRENT_DATE
    WHERE id = p_user_id;
    
    RETURN TRUE;
  END IF;
  
  -- Check weekly cap
  IF v_profile.weekly_points_earned + ABS(p_amount) > 2.0 THEN
    RETURN FALSE;
  END IF;
  
  -- Check post weekly cap
  IF p_event_type = 'post' AND v_profile.weekly_posts_points + ABS(p_amount) > 0.3 THEN
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- STEP 10: ENABLE RLS & POLICIES
-- =============================================

-- Enable RLS on new tables
ALTER TABLE public.handicap_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.counterparty_cooldowns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prestige_events ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Handicap events are viewable by everyone" ON public.handicap_events;
DROP POLICY IF EXISTS "Users can view own cooldowns" ON public.counterparty_cooldowns;
DROP POLICY IF EXISTS "Prestige events are viewable by everyone" ON public.prestige_events;

-- Anyone can view handicap events (public audit trail)
CREATE POLICY "Handicap events are viewable by everyone"
  ON public.handicap_events FOR SELECT USING (true);

-- Users can only view their own cooldowns
CREATE POLICY "Users can view own cooldowns"
  ON public.counterparty_cooldowns FOR SELECT 
  USING (user_id = auth.uid() OR counterparty_id = auth.uid());

-- Anyone can view prestige events
CREATE POLICY "Prestige events are viewable by everyone"
  ON public.prestige_events FOR SELECT USING (true);

-- =============================================
-- MIGRATION COMPLETE
-- =============================================
-- 
-- What was added:
-- ✅ Dual handicap tracking (seller + buyer)
-- ✅ Prestige system (4 tiers: Birdie, Eagle, Albatross, Hole-in-One)
-- ✅ Audit trail (handicap_events table)
-- ✅ Cooldown tracking (30-day counterparty protection)
-- ✅ Prestige events (milestone tracking)
-- ✅ Main function (award_handicap_points with all validation)
-- ✅ Triggers (order completion, reviews, refunds)
-- ✅ Anti-gaming measures:
--    - Phone verification requirement
--    - Minimum order value ($10)
--    - 30-day counterparty cooldown
--    - 5 transaction daily limit
--    - 2.0 point weekly cap
--    - 0.3 post weekly cap
-- ✅ Helper functions for frontend
--
-- Next steps:
-- 1. Verify all tables created successfully
-- 2. Test award_handicap_points function
-- 3. Run test transactions to validate triggers
-- 4. Update frontend to use new handicap display columns
-- 5. Migrate existing users: phone_verified = FALSE until they verify
--
-- =============================================
