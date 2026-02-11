// Core types for Wrong Club

export type Gender = 'mens' | 'womens' | 'juniors'

export type Category = 
  | 'tops'
  | 'bottoms'
  | 'footwear'
  | 'headwear'
  | 'accessories'
  | 'bags'

export type Condition = 
  | 'new_with_tags'
  | 'new_without_tags'
  | 'like_new'
  | 'good'
  | 'fair'

export type ListingStatus = 
  | 'draft'
  | 'active'
  | 'sold'
  | 'archived'

export type TransactionStatus = 
  | 'pending'
  | 'paid'
  | 'shipped'
  | 'delivered'
  | 'complete'
  | 'disputed'
  | 'refunded'

export interface User {
  id: string
  email: string
  name: string
  username: string
  avatar_url?: string
  bio?: string
  handicap?: number
  rating_score: number
  stripe_account_id?: string
  stripe_onboarding_complete: boolean
  created_at: string
}

export interface Listing {
  id: string
  seller_id: string
  title: string
  description: string
  brand: string
  category: Category
  gender: Gender
  condition: Condition
  size: string
  price: number // in cents
  images: string[]
  status: ListingStatus
  position_x?: number // for course view
  position_y?: number
  created_at: string
  updated_at: string
  // Joined data
  seller?: User
}

export interface Transaction {
  id: string
  listing_id: string
  buyer_id: string
  seller_id: string
  amount: number
  platform_fee: number
  seller_payout: number
  stripe_payment_intent_id?: string
  status: TransactionStatus
  tracking_number?: string
  shipped_at?: string
  delivered_at?: string
  created_at: string
  // Joined data
  listing?: Listing
  buyer?: User
  seller?: User
}

export interface Message {
  id: string
  transaction_id: string
  sender_id: string
  content: string
  read: boolean
  created_at: string
  // Joined data
  sender?: User
}

export interface CartItem {
  listing: Listing
  added_at: string
}
