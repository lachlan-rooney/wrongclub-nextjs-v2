import { NextResponse } from 'next/server'

/**
 * Stripe Webhook Handler
 * This is a placeholder for future Stripe webhook implementation
 * Coming soon: Handle checkout.session.completed, payment_intent.succeeded, etc.
 */

export async function POST(request: Request) {
  // Stripe integration coming soon
  return NextResponse.json(
    { error: 'Stripe webhook not configured yet', status: 'pending_implementation' },
    { status: 501 }
  )
}
