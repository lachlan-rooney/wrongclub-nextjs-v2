-- Create addresses table for storing user shipping and return addresses
DROP TABLE IF EXISTS public.addresses CASCADE;

CREATE TABLE public.addresses (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Address details
  full_name text NOT NULL,
  address_line_1 text NOT NULL,
  address_line_2 text,
  city text NOT NULL,
  state text NOT NULL,
  zip_code text NOT NULL,
  country text NOT NULL DEFAULT 'United States',
  phone text,
  
  -- Flags
  is_default boolean DEFAULT false,
  is_return_address boolean DEFAULT false,
  
  -- Metadata
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create partial unique indexes to enforce only one default address per type
CREATE UNIQUE INDEX idx_one_default_shipping_address 
ON public.addresses(user_id) 
WHERE is_default = true AND is_return_address = false;

CREATE UNIQUE INDEX idx_one_default_return_address 
ON public.addresses(user_id) 
WHERE is_default = true AND is_return_address = true;

-- Enable RLS
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read only their own addresses
CREATE POLICY "Users can read own addresses"
ON public.addresses
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy: Users can insert their own addresses
CREATE POLICY "Users can insert own addresses"
ON public.addresses
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own addresses
CREATE POLICY "Users can update own addresses"
ON public.addresses
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own addresses
CREATE POLICY "Users can delete own addresses"
ON public.addresses
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX idx_addresses_user_id ON public.addresses(user_id);
CREATE INDEX idx_addresses_updated_at ON public.addresses(updated_at);

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.addresses TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;
