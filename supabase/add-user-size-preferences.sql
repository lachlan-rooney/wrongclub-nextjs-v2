-- Add size preference columns to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS size_tops TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS size_bottoms_waist TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS size_bottoms_length TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS size_footwear TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS size_headwear TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS size_gloves TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS gender_preference TEXT DEFAULT 'mens' CHECK (gender_preference IN ('mens', 'womens', 'all'));

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_size_tops ON public.profiles(size_tops);
CREATE INDEX IF NOT EXISTS idx_profiles_gender_preference ON public.profiles(gender_preference);
