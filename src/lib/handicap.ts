// Handicap reduction values for different actions
export const HANDICAP_ACTIONS = {
  // Seller actions
  sale: -0.5,
  review_5_star: -0.3,
  ship_fast: -0.2,
  post_feed: -0.1,
  milestone_10_items: -0.3,
  caddie_outfit_sold: -0.5,
  referral_seller: -1.0,
  first_sale_month: -0.2,
  
  // Buyer actions
  purchase: -0.5,
  review_left: -0.3,
  referral_buyer: -1.0,
  caddie_outfit_bought: -0.5,
  first_purchase_month: -0.2,
  milestone_10_saves: -0.3,
}

// Weekly cap on handicap improvements
export const WEEKLY_HANDICAP_CAP = -2.0
export const POST_WEEKLY_CAP = -0.3

// Tier configuration
export const TIERS: Record<string, { prestige: number; fee: number; algoBoost: number; dropAccess: number }> = {
  birdie: { prestige: 0, fee: 0.10, algoBoost: 0, dropAccess: 0 },
  eagle: { prestige: 1, fee: 0.095, algoBoost: 0.10, dropAccess: 1 },
  albatross: { prestige: 2, fee: 0.09, algoBoost: 0.15, dropAccess: 2 },
  hole_in_one: { prestige: 3, fee: 0.085, algoBoost: 0.20, dropAccess: 3 },
}

// Get tier name from prestige level
export function getTierFromPrestige(prestige: number): string {
  switch (prestige) {
    case 0: return 'birdie'
    case 1: return 'eagle'
    case 2: return 'albatross'
    case 3: return 'hole_in_one'
    default: return 'birdie'
  }
}

// Calculate platform fee based on tier
export function getPlatformFee(tier: string): number {
  return TIERS[tier]?.fee || 0.10
}

// Calculate points until next tier (handicap points)
export function getPointsUntilNextTier(handicap: number): number {
  return Math.round(handicap * 10) / 10
}

// Get tier display information
export function getTierInfo(tier: string): { name: string; emoji: string; color: string } {
  const info: Record<string, { name: string; emoji: string; color: string }> = {
    birdie: { name: 'Birdie', emoji: '🐦', color: '#22c55e' },
    eagle: { name: 'Eagle', emoji: '🦅', color: '#3b82f6' },
    albatross: { name: 'Albatross', emoji: '🌟', color: '#a855f7' },
    hole_in_one: { name: 'Hole-in-One', emoji: '🏆', color: '#eab308' },
  }
  return info[tier] || info.birdie
}

// Get terrain unlocks for each tier
export function getTerrainUnlocks(tier: string): string[] {
  const terrains = ['links'] // Everyone gets links
  if (['eagle', 'albatross', 'hole_in_one'].includes(tier)) terrains.push('parkland')
  if (['albatross', 'hole_in_one'].includes(tier)) terrains.push('desert')
  if (tier === 'hole_in_one') terrains.push('mountain', 'night_golf')
  return terrains
}

// Get payout days for tier
export function getPayoutDays(tier: string): number {
  switch (tier) {
    case 'birdie': return 5
    case 'eagle': return 3
    case 'albatross': return 2
    case 'hole_in_one': return 1
    default: return 5
  }
}

// Get algorithm boost percentage for tier
export function getAlgoBoost(tier: string): number {
  switch (tier) {
    case 'birdie': return 0
    case 'eagle': return 10
    case 'albatross': return 15
    case 'hole_in_one': return 20
    default: return 0
  }
}

// Get drop access hours for tier
export function getDropAccess(tier: string): number {
  switch (tier) {
    case 'birdie': return 0
    case 'eagle': return 1
    case 'albatross': return 2
    case 'hole_in_one': return 3
    default: return 0
  }
}

// Format currency
export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100)
}

// Calculate progress percentage to next tier
export function getProgressToNextTier(handicap: number): number {
  return Math.max(0, Math.min(100, ((18 - handicap) / 18) * 100))
}
