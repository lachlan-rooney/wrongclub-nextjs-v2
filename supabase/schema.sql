-- Wrong Club Database Schema
-- Run this in Supabase SQL Editor

-- ============================================
-- EXTENSIONS
-- ============================================
create extension if not exists "uuid-ossp";

-- ============================================
-- ENUMS
-- ============================================
create type gender as enum ('mens', 'womens', 'juniors');
create type category as enum ('tops', 'bottoms', 'footwear', 'headwear', 'accessories', 'bags');
create type condition as enum ('new_with_tags', 'new_without_tags', 'like_new', 'good', 'fair');
create type listing_status as enum ('draft', 'active', 'sold', 'archived');
create type transaction_status as enum ('pending', 'paid', 'shipped', 'delivered', 'complete', 'disputed', 'refunded');

-- ============================================
-- USERS TABLE
-- ============================================
create table public.users (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  name text not null,
  username text unique not null,
  avatar_url text,
  bio text,
  handicap decimal(3,1) check (handicap >= 0 and handicap <= 54),
  
  -- Rating system (golf balls)
  rating_score decimal(3,2) default 5.00 check (rating_score >= 1 and rating_score <= 5),
  total_sales integer default 0,
  total_purchases integer default 0,
  
  -- Stripe Connect
  stripe_customer_id text,
  stripe_account_id text,
  stripe_onboarding_complete boolean default false,
  
  -- Location (for shipping estimates)
  city text,
  state text,
  country text default 'US',
  
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Username validation
alter table public.users add constraint username_format 
  check (username ~* '^[a-z0-9_]{3,20}$');

-- ============================================
-- LISTINGS TABLE
-- ============================================
create table public.listings (
  id uuid default uuid_generate_v4() primary key,
  seller_id uuid references public.users(id) on delete cascade not null,
  
  -- Product info
  title text not null check (char_length(title) >= 3 and char_length(title) <= 100),
  description text check (char_length(description) <= 2000),
  brand text not null,
  category category not null,
  gender gender not null,
  condition condition not null,
  size text not null,
  color text,
  
  -- Pricing (in cents)
  price integer not null check (price >= 100), -- minimum $1.00
  original_price integer, -- MSRP for reference
  shipping_price integer default 0,
  
  -- Images (array of URLs)
  images text[] not null check (array_length(images, 1) >= 1 and array_length(images, 1) <= 8),
  
  -- Status
  status listing_status default 'draft',
  
  -- Course view position (percentage 0-100)
  position_x decimal(5,2) default 50,
  position_y decimal(5,2) default 50,
  
  -- Metrics
  views integer default 0,
  saves integer default 0,
  
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Index for browsing
create index listings_status_idx on public.listings(status);
create index listings_category_idx on public.listings(category);
create index listings_gender_idx on public.listings(gender);
create index listings_seller_idx on public.listings(seller_id);
create index listings_created_idx on public.listings(created_at desc);

-- ============================================
-- TRANSACTIONS TABLE
-- ============================================
create table public.transactions (
  id uuid default uuid_generate_v4() primary key,
  listing_id uuid references public.listings(id) on delete set null,
  buyer_id uuid references public.users(id) on delete set null not null,
  seller_id uuid references public.users(id) on delete set null not null,
  
  -- Pricing (in cents)
  subtotal integer not null,
  shipping_cost integer default 0,
  platform_fee integer not null, -- 10% of subtotal
  seller_payout integer not null, -- subtotal - platform_fee
  total integer not null, -- subtotal + shipping
  
  -- Stripe
  stripe_payment_intent_id text,
  stripe_transfer_id text,
  
  -- Status
  status transaction_status default 'pending',
  
  -- Shipping
  shipping_address jsonb,
  tracking_number text,
  tracking_url text,
  shipped_at timestamptz,
  delivered_at timestamptz,
  
  -- Timestamps
  paid_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index transactions_buyer_idx on public.transactions(buyer_id);
create index transactions_seller_idx on public.transactions(seller_id);
create index transactions_status_idx on public.transactions(status);

-- ============================================
-- MESSAGES TABLE
-- ============================================
create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  transaction_id uuid references public.transactions(id) on delete cascade not null,
  sender_id uuid references public.users(id) on delete set null not null,
  
  content text not null check (char_length(content) >= 1 and char_length(content) <= 2000),
  read boolean default false,
  
  created_at timestamptz default now()
);

create index messages_transaction_idx on public.messages(transaction_id);
create index messages_created_idx on public.messages(created_at);

-- ============================================
-- REVIEWS TABLE
-- ============================================
create table public.reviews (
  id uuid default uuid_generate_v4() primary key,
  transaction_id uuid references public.transactions(id) on delete cascade unique not null,
  reviewer_id uuid references public.users(id) on delete set null not null,
  reviewed_id uuid references public.users(id) on delete cascade not null,
  
  -- Rating (golf balls: 1-5)
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text check (char_length(comment) <= 500),
  
  -- Type
  review_type text not null check (review_type in ('buyer_to_seller', 'seller_to_buyer')),
  
  created_at timestamptz default now()
);

create index reviews_reviewed_idx on public.reviews(reviewed_id);

-- ============================================
-- SAVED LISTINGS (Wishlist)
-- ============================================
create table public.saved_listings (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  listing_id uuid references public.listings(id) on delete cascade not null,
  created_at timestamptz default now(),
  
  unique(user_id, listing_id)
);

create index saved_listings_user_idx on public.saved_listings(user_id);

-- ============================================
-- FOLLOWS
-- ============================================
create table public.follows (
  id uuid default uuid_generate_v4() primary key,
  follower_id uuid references public.users(id) on delete cascade not null,
  following_id uuid references public.users(id) on delete cascade not null,
  created_at timestamptz default now(),
  
  unique(follower_id, following_id),
  check (follower_id != following_id)
);

create index follows_follower_idx on public.follows(follower_id);
create index follows_following_idx on public.follows(following_id);

-- ============================================
-- BRANDS (for autocomplete/validation)
-- ============================================
create table public.brands (
  id uuid default uuid_generate_v4() primary key,
  name text unique not null,
  slug text unique not null,
  logo_url text,
  is_verified boolean default false,
  created_at timestamptz default now()
);

-- Seed popular golf brands
insert into public.brands (name, slug, is_verified) values
  ('Nike', 'nike', true),
  ('Adidas', 'adidas', true),
  ('FootJoy', 'footjoy', true),
  ('Titleist', 'titleist', true),
  ('Callaway', 'callaway', true),
  ('TaylorMade', 'taylormade', true),
  ('Puma', 'puma', true),
  ('Under Armour', 'under-armour', true),
  ('Travis Mathew', 'travis-mathew', true),
  ('Peter Millar', 'peter-millar', true),
  ('Malbon Golf', 'malbon-golf', true),
  ('Eastside Golf', 'eastside-golf', true),
  ('NOCTA', 'nocta', true),
  ('Metalwood Studio', 'metalwood-studio', true),
  ('Bogey Boys', 'bogey-boys', true),
  ('Whim Golf', 'whim-golf', true),
  ('Manors', 'manors', true),
  ('J.Lindeberg', 'j-lindeberg', true),
  ('G/FORE', 'g-fore', true),
  ('Greyson', 'greyson', true),
  ('YETI', 'yeti', true),
  ('Vessel', 'vessel', true),
  ('Sunday Golf', 'sunday-golf', true),
  ('Good Good', 'good-good', true),
  ('Wrong Club', 'wrong-club', true);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-update updated_at timestamp
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Apply to tables
create trigger users_updated_at before update on public.users
  for each row execute function update_updated_at();
  
create trigger listings_updated_at before update on public.listings
  for each row execute function update_updated_at();
  
create trigger transactions_updated_at before update on public.transactions
  for each row execute function update_updated_at();

-- Update user rating after review
create or replace function update_user_rating()
returns trigger as $$
begin
  update public.users
  set rating_score = (
    select coalesce(avg(rating), 5)
    from public.reviews
    where reviewed_id = new.reviewed_id
  )
  where id = new.reviewed_id;
  return new;
end;
$$ language plpgsql;

create trigger update_rating_after_review
  after insert on public.reviews
  for each row execute function update_user_rating();

-- Update listing saves count
create or replace function update_listing_saves()
returns trigger as $$
begin
  if tg_op = 'INSERT' then
    update public.listings set saves = saves + 1 where id = new.listing_id;
  elsif tg_op = 'DELETE' then
    update public.listings set saves = saves - 1 where id = old.listing_id;
  end if;
  return null;
end;
$$ language plpgsql;

create trigger update_saves_count
  after insert or delete on public.saved_listings
  for each row execute function update_listing_saves();

-- Increment user sales/purchases on completed transaction
create or replace function update_user_stats()
returns trigger as $$
begin
  if new.status = 'complete' and old.status != 'complete' then
    update public.users set total_sales = total_sales + 1 where id = new.seller_id;
    update public.users set total_purchases = total_purchases + 1 where id = new.buyer_id;
  end if;
  return new;
end;
$$ language plpgsql;

create trigger update_stats_on_complete
  after update on public.transactions
  for each row execute function update_user_stats();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

alter table public.users enable row level security;
alter table public.listings enable row level security;
alter table public.transactions enable row level security;
alter table public.messages enable row level security;
alter table public.reviews enable row level security;
alter table public.saved_listings enable row level security;
alter table public.follows enable row level security;
alter table public.brands enable row level security;

-- USERS policies
create policy "Public profiles are viewable by everyone"
  on public.users for select using (true);

create policy "Users can update own profile"
  on public.users for update using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.users for insert with check (auth.uid() = id);

-- LISTINGS policies
create policy "Active listings are viewable by everyone"
  on public.listings for select using (status = 'active' or seller_id = auth.uid());

create policy "Users can create own listings"
  on public.listings for insert with check (auth.uid() = seller_id);

create policy "Users can update own listings"
  on public.listings for update using (auth.uid() = seller_id);

create policy "Users can delete own listings"
  on public.listings for delete using (auth.uid() = seller_id);

-- TRANSACTIONS policies
create policy "Users can view own transactions"
  on public.transactions for select using (auth.uid() = buyer_id or auth.uid() = seller_id);

create policy "Users can create transactions as buyer"
  on public.transactions for insert with check (auth.uid() = buyer_id);

create policy "Participants can update transactions"
  on public.transactions for update using (auth.uid() = buyer_id or auth.uid() = seller_id);

-- MESSAGES policies
create policy "Transaction participants can view messages"
  on public.messages for select using (
    exists (
      select 1 from public.transactions
      where id = transaction_id
      and (buyer_id = auth.uid() or seller_id = auth.uid())
    )
  );

create policy "Transaction participants can send messages"
  on public.messages for insert with check (
    auth.uid() = sender_id and
    exists (
      select 1 from public.transactions
      where id = transaction_id
      and (buyer_id = auth.uid() or seller_id = auth.uid())
    )
  );

-- REVIEWS policies
create policy "Reviews are viewable by everyone"
  on public.reviews for select using (true);

create policy "Transaction participants can create reviews"
  on public.reviews for insert with check (auth.uid() = reviewer_id);

-- SAVED LISTINGS policies
create policy "Users can view own saved listings"
  on public.saved_listings for select using (auth.uid() = user_id);

create policy "Users can save listings"
  on public.saved_listings for insert with check (auth.uid() = user_id);

create policy "Users can unsave listings"
  on public.saved_listings for delete using (auth.uid() = user_id);

-- FOLLOWS policies
create policy "Follows are viewable by everyone"
  on public.follows for select using (true);

create policy "Users can follow others"
  on public.follows for insert with check (auth.uid() = follower_id);

create policy "Users can unfollow"
  on public.follows for delete using (auth.uid() = follower_id);

-- BRANDS policies
create policy "Brands are viewable by everyone"
  on public.brands for select using (true);

-- ============================================
-- STORAGE BUCKETS
-- ============================================
-- Run these in Supabase Dashboard > Storage

-- Create bucket for listing images
-- insert into storage.buckets (id, name, public) values ('listings', 'listings', true);

-- Create bucket for avatars
-- insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true);

-- Storage policies (run in SQL editor)
-- create policy "Anyone can view listing images"
--   on storage.objects for select using (bucket_id = 'listings');

-- create policy "Authenticated users can upload listing images"
--   on storage.objects for insert with check (
--     bucket_id = 'listings' and auth.role() = 'authenticated'
--   );

-- create policy "Users can update own listing images"
--   on storage.objects for update using (
--     bucket_id = 'listings' and auth.uid()::text = (storage.foldername(name))[1]
--   );

-- create policy "Users can delete own listing images"
--   on storage.objects for delete using (
--     bucket_id = 'listings' and auth.uid()::text = (storage.foldername(name))[1]
--   );
