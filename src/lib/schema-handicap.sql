-- Update users table with handicap and loyalty columns
ALTER TABLE users ADD COLUMN IF NOT EXISTS handicap_seller DECIMAL(3,1) DEFAULT 18.0 CHECK (handicap_seller >= 0 AND handicap_seller <= 18);
ALTER TABLE users ADD COLUMN IF NOT EXISTS handicap_buyer DECIMAL(3,1) DEFAULT 18.0 CHECK (handicap_buyer >= 0 AND handicap_buyer <= 18);
ALTER TABLE users ADD COLUMN IF NOT EXISTS prestige_seller INTEGER DEFAULT 0 CHECK (prestige_seller >= 0 AND prestige_seller <= 3);
ALTER TABLE users ADD COLUMN IF NOT EXISTS prestige_buyer INTEGER DEFAULT 0 CHECK (prestige_buyer >= 0 AND prestige_buyer <= 3);
ALTER TABLE users ADD COLUMN IF NOT EXISTS tier_seller TEXT DEFAULT 'birdie' CHECK (tier_seller IN ('birdie', 'eagle', 'albatross', 'hole_in_one'));
ALTER TABLE users ADD COLUMN IF NOT EXISTS tier_buyer TEXT DEFAULT 'birdie' CHECK (tier_buyer IN ('birdie', 'eagle', 'albatross', 'hole_in_one'));
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_transaction_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS terrain_unlocks TEXT[] DEFAULT ARRAY['links'];
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_verified_seller BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS verified_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS account_type TEXT DEFAULT 'individual' CHECK (account_type IN ('individual', 'verified', 'official_course'));
ALTER TABLE users ADD COLUMN IF NOT EXISTS member_pricing_enabled BOOLEAN DEFAULT FALSE;

-- Create handicap_events table for tracking handicap changes
CREATE TABLE IF NOT EXISTS handicap_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('sale', 'purchase', 'review', 'ship_fast', 'post', 'referral', 'milestone', 'caddie_outfit')),
  handicap_change DECIMAL(3,1) NOT NULL,
  handicap_before DECIMAL(3,1) NOT NULL,
  handicap_after DECIMAL(3,1) NOT NULL,
  track TEXT NOT NULL CHECK (track IN ('seller', 'buyer')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_handicap_events_user ON handicap_events(user_id);
CREATE INDEX IF NOT EXISTS idx_handicap_events_created ON handicap_events(created_at);

-- Create prestige_events table for tracking tier promotions
CREATE TABLE IF NOT EXISTS prestige_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  from_tier TEXT NOT NULL,
  to_tier TEXT NOT NULL,
  track TEXT NOT NULL CHECK (track IN ('seller', 'buyer')),
  credit_awarded INTEGER DEFAULT 1000,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_prestige_events_user ON prestige_events(user_id);
