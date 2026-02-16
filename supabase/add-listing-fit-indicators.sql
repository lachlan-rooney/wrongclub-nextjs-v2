-- Add fit scale and one_size columns to listings table
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS fit_scale INTEGER DEFAULT 0 CHECK (fit_scale >= -2 AND fit_scale <= 2);
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS is_one_size BOOLEAN DEFAULT FALSE;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_listings_fit_scale ON public.listings(fit_scale);
CREATE INDEX IF NOT EXISTS idx_listings_is_one_size ON public.listings(is_one_size);
