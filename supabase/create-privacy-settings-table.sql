-- Create privacy settings table for storing user privacy preferences
DROP TABLE IF EXISTS public.privacy_settings CASCADE;

CREATE TABLE public.privacy_settings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  
  -- Profile visibility
  profile_public boolean DEFAULT true,
  show_handicap boolean DEFAULT true,
  show_sales boolean DEFAULT true,
  show_purchases boolean DEFAULT false,
  
  -- Messaging
  allow_messages_all boolean DEFAULT true,
  
  -- Metadata
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.privacy_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read only their own settings
CREATE POLICY "Users can read own privacy settings"
ON public.privacy_settings
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy: Users can insert their own settings
CREATE POLICY "Users can insert own privacy settings"
ON public.privacy_settings
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own settings
CREATE POLICY "Users can update own privacy settings"
ON public.privacy_settings
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX idx_privacy_settings_user_id ON public.privacy_settings(user_id);

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON public.privacy_settings TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Trigger to create default settings when user signs up
CREATE OR REPLACE FUNCTION public.create_privacy_settings()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.privacy_settings (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger to auth.users (fires on user creation)
DROP TRIGGER IF EXISTS on_auth_user_created_privacy_settings ON auth.users;
CREATE TRIGGER on_auth_user_created_privacy_settings
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.create_privacy_settings();
