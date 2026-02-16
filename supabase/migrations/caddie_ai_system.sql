-- ==================== CADDIE AI SYSTEM TABLES ====================

-- Store outfit recommendations for caching/learning
CREATE TABLE IF NOT EXISTS public.caddie_outfits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Request context
  prompt TEXT NOT NULL,
  occasion TEXT,
  budget_min_cents INTEGER,
  budget_max_cents INTEGER,
  
  -- Generated outfit
  outfit_name TEXT,
  outfit_description TEXT,
  style_notes TEXT,
  
  -- Listings included
  listing_ids UUID[] NOT NULL DEFAULT '{}',
  
  -- Feedback
  was_helpful BOOLEAN,
  items_purchased INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_caddie_outfits_user ON public.caddie_outfits(user_id);
CREATE INDEX idx_caddie_outfits_created ON public.caddie_outfits(created_at DESC);

-- Enable RLS on caddie_outfits
ALTER TABLE public.caddie_outfits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own caddie outfits"
  ON public.caddie_outfits
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own caddie outfits"
  ON public.caddie_outfits
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own caddie outfits"
  ON public.caddie_outfits
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Store user style preferences (learned over time)
CREATE TABLE IF NOT EXISTS public.caddie_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Explicit preferences
  favorite_brands TEXT[] DEFAULT '{}',
  disliked_brands TEXT[] DEFAULT '{}',
  preferred_colors TEXT[] DEFAULT '{}',
  avoided_colors TEXT[] DEFAULT '{}',
  style_keywords TEXT[] DEFAULT '{}',
  
  -- Inferred preferences (from purchases/saves)
  inferred_styles JSONB DEFAULT '{}',
  price_range_low_cents INTEGER,
  price_range_high_cents INTEGER,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_caddie_prefs_user ON public.caddie_preferences(user_id);

-- Enable RLS on caddie_preferences
ALTER TABLE public.caddie_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own caddie preferences"
  ON public.caddie_preferences
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own caddie preferences"
  ON public.caddie_preferences
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own caddie preferences"
  ON public.caddie_preferences
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Track which items Caddie has recommended
CREATE TABLE IF NOT EXISTS public.caddie_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE NOT NULL,
  outfit_id UUID REFERENCES public.caddie_outfits(id) ON DELETE CASCADE,
  
  context TEXT DEFAULT 'outfit_builder',
  
  -- Tracking
  was_clicked BOOLEAN DEFAULT FALSE,
  was_saved BOOLEAN DEFAULT FALSE,
  was_purchased BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_caddie_recs_user ON public.caddie_recommendations(user_id);
CREATE INDEX idx_caddie_recs_listing ON public.caddie_recommendations(listing_id);
CREATE INDEX idx_caddie_recs_outfit ON public.caddie_recommendations(outfit_id);

-- Enable RLS on caddie_recommendations
ALTER TABLE public.caddie_recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own caddie recommendations"
  ON public.caddie_recommendations
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own caddie recommendations"
  ON public.caddie_recommendations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Auto-create caddie_preferences when user signs up
CREATE OR REPLACE FUNCTION public.create_caddie_preferences()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.caddie_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create caddie preferences on profile creation
DROP TRIGGER IF EXISTS on_profile_created_create_caddie_prefs ON public.profiles;
CREATE TRIGGER on_profile_created_create_caddie_prefs
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.create_caddie_preferences();

-- Add style metadata to listings (optional enhancement for better matching)
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS style_tags TEXT[] DEFAULT '{}';
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS color_primary TEXT;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS color_secondary TEXT;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS pattern TEXT;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS formality INTEGER CHECK (formality >= 1 AND formality <= 5);

-- RPC function to get user's caddie preferences
CREATE OR REPLACE FUNCTION public.get_my_caddie_preferences()
RETURNS public.caddie_preferences AS $$
BEGIN
  RETURN (
    SELECT * FROM public.caddie_preferences
    WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
