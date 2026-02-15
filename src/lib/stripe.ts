// Stripe integration - NOT YET CONFIGURED
// This file is stubbed out until Stripe is properly set up

// Server-side Stripe (commented out - needs env vars)
// import Stripe from 'stripe'
// export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: '2023-10-16',
//   typescript: true,
// })

// Client-side Stripe (commented out - needs env vars)
// import { loadStripe } from '@stripe/stripe-js'
// let stripePromise: Promise<Stripe | null>
// export function getStripe() {
//   if (!stripePromise) {
//     stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
//   }
//   return stripePromise
// }

// Stub exports for now
export const stripe = null as any
export function getStripe() {
  return null
}

// Platform fee percentage (e.g., 10%)
export const PLATFORM_FEE_PERCENT = 10

// Calculate platform fee
export function calculatePlatformFee(amount: number): number {
  return Math.round(amount * (PLATFORM_FEE_PERCENT / 100))
}
