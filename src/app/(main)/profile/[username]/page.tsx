'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import {
  getTierInfo,
  getTierFromPrestige,
  getPointsUntilNextTier,
  getProgressToNextTier,
  getPlatformFee,
  getPayoutDays,
  getAlgoBoost,
  getDropAccess,
  formatPrice,
} from '@/lib/handicap'

// Mock user data - replace with actual user fetching
const mockUser = {
  id: '1',
  display_name: 'Lachlan',
  username: 'lachlan',
  email: 'lachlan@example.com',
  avatar: null,
  bio: 'Golf gear enthusiast. Always hunting for rare finds.',
  handicap_seller: 14.2,
  handicap_buyer: 16.5,
  prestige_seller: 0,
  prestige_buyer: 0,
  tier_seller: 'birdie',
  tier_buyer: 'birdie',
  total_sales: 12,
  total_purchases: 8,
  total_earned: 84700, // cents
  rating_score: 4.8,
  terrain_unlocks: ['links'],
  is_verified_seller: false,
  account_type: 'individual',
  joined: '2025-06-15',
}

const mockListings = [
  { id: '1', title: 'Travis Mathew Polo', price: 6500, image: null, status: 'active' },
  { id: '2', title: 'Malbon Bucket Hat', price: 5800, image: null, status: 'active' },
  { id: '3', title: 'FootJoy Premieres', price: 16500, image: null, status: 'sold' },
]

export default function ProfilePage() {
  const params = useParams()
  const [activeTab, setActiveTab] = useState('shop')
  const [user, setUser] = useState(mockUser)
  const [loading, setLoading] = useState(true)
  const [expandedTiers, setExpandedTiers] = useState<string | null>(null)

  // Toggle tier expansion
  const toggleTierExpansion = (tier: string) => {
    setExpandedTiers(expandedTiers === tier ? null : tier)
  }

  // Fetch user profile with proper cleanup
  useEffect(() => {
    let isMounted = true

    const fetchUser = async () => {
      try {
        const supabase = createClient()
        
        // Fetch profile regardless of auth state (public profile view)
        const { data: userData, error: dbError } = await supabase
          .from('profiles')
          .select('*')
          .eq('username', params.username)
          .single()

        if (isMounted) {
          if (userData) {
            console.log('✅ Profile fetched:', userData.username, userData.display_name)
            setUser(userData)
          } else {
            console.log('❌ No profile found for username:', params.username, dbError)
            setUser(mockUser)
          }
        }
      } catch (err) {
        console.error('Error fetching user:', err)
        if (isMounted) {
          setUser(mockUser)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchUser()

    return () => {
      isMounted = false
    }
  }, [params.username])

  const tierInfo = getTierInfo(user.tier_seller)
  const pointsUntilNext = getPointsUntilNextTier(user.handicap_seller)
  const progressPercent = getProgressToNextTier(user.handicap_seller)
  const nextTierName = getTierFromPrestige(Math.min(user.prestige_seller + 1, 3))
  const nextTierInfo = getTierInfo(nextTierName)

  // Get tier benefits
  const getTierBenefits = (tier: string) => {
    const benefitsMap: Record<string, { color: string; tagline?: string; benefits: string[] }> = {
      birdie: {
        color: '#22c55e',
        tagline: 'Everything you need to start selling',
        benefits: [
          '🛡️ Buyer protection on all sales',
          '💳 Secure Stripe payouts',
          '🏷️ Smart Pricing suggestions',
          '📊 Sales analytics dashboard',
          '🏠 Your own Home Course storefront',
          '🤖 Caddie AI outfit builder',
          '📱 Feed posting & social features',
          '🌿 Links terrain unlocked',
          '✅ Full marketplace access',
          '10% platform fee',
          '5-day payout after delivery'
        ]
      },
      eagle: {
        color: '#3b82f6',
        benefits: [
          '9.5% platform fee',
          '3-day payout',
          '1-hour early drop access',
          '+10% visibility boost',
          'Parkland terrain unlocked',
          'Eagle badge'
        ]
      },
      albatross: {
        color: '#a855f7',
        benefits: [
          '9% platform fee',
          '2-day payout',
          '2-hour early drop access',
          '+15% visibility boost',
          'Desert terrain unlocked',
          '✓ Verified Seller badge',
          'Priority support'
        ]
      },
      hole_in_one: {
        color: '#eab308',
        benefits: [
          '8.5% platform fee',
          'Next-day payout',
          '3-hour early drop access',
          '+20% visibility boost',
          'Mountain + Night Golf terrains',
          'VIP concierge support',
          'IRL event invites',
          'Ambassador program access'
        ]
      }
    }
    return benefitsMap[tier] || { color: '#6b7280', benefits: [] }
  }

  // Calculate points away from tier
  const getPointsAway = (tierIdx: number) => {
    if (tierIdx <= user.prestige_seller) {
      return 0 // Already unlocked or current tier
    }
    const tiersRemaining = tierIdx - user.prestige_seller
    return Math.round((user.handicap_seller + (18 * (tiersRemaining - 1))) * 10) / 10
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="pb-12">
        {/* Profile Header */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-6 py-8">
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="w-24 h-24 bg-[#5f6651] rounded-full flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
                {user.display_name.charAt(0)}
              </div>
              
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl font-bold text-gray-900">{user.display_name}</h1>
                  <span 
                    className="px-3 py-1 rounded-full text-sm font-medium text-white flex-shrink-0"
                    style={{ backgroundColor: tierInfo.color }}
                  >
                    {tierInfo.emoji} {tierInfo.name}
                  </span>
                  {user.is_verified_seller && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium flex-shrink-0">
                      ✓ Verified
                    </span>
                  )}
                </div>
                <p className="text-gray-500 mt-1">@{user.username}</p>
                <p className="text-gray-600 mt-2">{user.bio}</p>
                
                {/* Stats */}
                <div className="flex items-center gap-4 mt-4 flex-wrap">
                  <div className="text-center">
                    <p className="text-xl font-bold text-gray-900">{user.handicap_seller.toFixed(1)}</p>
                    <p className="text-xs text-gray-500">Handicap</p>
                  </div>
                  <div className="w-px h-12 bg-gray-200" />
                  <div className="text-center">
                    <p className="text-xl font-bold text-gray-900">{user.total_sales}</p>
                    <p className="text-xs text-gray-500">Sales</p>
                  </div>
                  <div className="w-px h-12 bg-gray-200" />
                  <div className="text-center">
                    <p className="text-xl font-bold text-gray-900">{formatPrice(user.total_earned)}</p>
                    <p className="text-xs text-gray-500">Earned</p>
                  </div>
                  <div className="w-px h-12 bg-gray-200" />
                  <div className="text-center">
                    <p className="text-xl font-bold text-gray-900">⛳ {user.rating_score}</p>
                    <p className="text-xs text-gray-500">Rating</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Handicap Progress */}
            <div className="mt-8 p-4 bg-gradient-to-r from-[#5f6651]/5 to-transparent rounded-xl border border-[#5f6651]/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Seller Handicap Progress</span>
                <span className="text-sm text-gray-500">{pointsUntilNext.toFixed(1)} points until {nextTierInfo.name}</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${progressPercent}%`,
                    backgroundColor: tierInfo.color
                  }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>18.0 (Beginner)</span>
                <span>0.0 (Elite) → {nextTierInfo.name}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-5xl mx-auto px-6 mt-6">
          <div className="flex gap-6 border-b border-gray-200">
            {[
              { id: 'shop', label: 'Shop', icon: '🏪' },
              { id: 'wardrobe', label: 'Wardrobe', icon: '👕' },
              { id: 'reviews', label: 'Reviews', icon: '⭐' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 px-2 text-sm font-medium transition-colors flex items-center gap-2 ${
                  activeTab === tab.id 
                    ? 'text-[#5f6651] border-b-2 border-[#5f6651]' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="mt-6">
            {activeTab === 'shop' && (
              <div>
                {mockListings.filter(l => l.status === 'active').length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {mockListings.filter(l => l.status === 'active').map((listing) => (
                      <Link
                        key={listing.id}
                        href={`/listing/${listing.id}`}
                        className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-md transition-shadow group"
                      >
                        <div className="aspect-square bg-gray-100 flex items-center justify-center text-4xl group-hover:bg-gray-200 transition-colors">
                          🏌️
                        </div>
                        <div className="p-3">
                          <p className="font-medium text-gray-900 text-sm truncate">{listing.title}</p>
                          <p className="text-[#5f6651] font-bold mt-1">{formatPrice(listing.price)}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <p className="text-4xl mb-2">🏪</p>
                    <p>No active listings</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'wardrobe' && (
              <div className="text-center py-12 text-gray-500">
                <p className="text-4xl mb-2">👕</p>
                <p>Wardrobe coming soon</p>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="text-center py-12 text-gray-500">
                <p className="text-4xl mb-2">⭐</p>
                <p>No reviews yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Tier Benefits Card - Current Tier Benefits */}
        <div className="max-w-5xl mx-auto px-6 mt-8">
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="mb-6">
              <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                <span>{tierInfo.emoji}</span>
                {tierInfo.name}
              </h3>
              {getTierBenefits(user.tier_seller).tagline && (
                <p className="text-sm text-gray-600 mt-2">{getTierBenefits(user.tier_seller).tagline}</p>
              )}
            </div>
            
            <div className="space-y-2">
              {getTierBenefits(user.tier_seller).benefits.slice(0, 4).map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-3 text-sm">
                  <span style={{ color: getTierBenefits(user.tier_seller).color }}>✓</span>
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
            
            {getTierBenefits(user.tier_seller).benefits.length > 4 && (
              <button
                onClick={() => toggleTierExpansion(user.tier_seller)}
                className="mt-4 text-sm font-medium transition-colors"
                style={{ color: getTierBenefits(user.tier_seller).color }}
              >
                See all {getTierBenefits(user.tier_seller).benefits.length} benefits →
              </button>
            )}
            
            {expandedTiers === user.tier_seller && getTierBenefits(user.tier_seller).benefits.length > 4 && (
              <div className="mt-4 space-y-2 border-t pt-4">
                {getTierBenefits(user.tier_seller).benefits.slice(4).map((benefit, idx) => (
                  <div key={idx + 4} className="flex items-start gap-3 text-sm">
                    <span style={{ color: getTierBenefits(user.tier_seller).color }}>✓</span>
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
                <button
                  onClick={() => toggleTierExpansion(user.tier_seller)}
                  className="mt-3 text-sm font-medium transition-colors"
                  style={{ color: getTierBenefits(user.tier_seller).color }}
                >
                  Show less ↑
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tier Progression Card */}
        <div className="max-w-5xl mx-auto px-6 mt-8">
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 mb-6 text-lg">🏌️ Tier Progression</h3>
            <div className="space-y-3">
              {['birdie', 'eagle', 'albatross', 'hole_in_one'].map((tier, idx) => {
                const tierData = getTierInfo(tier)
                const isActive = user.tier_seller === tier
                const pointsAway = getPointsAway(idx)
                const tierBenefits = getTierBenefits(tier)
                const isExpanded = expandedTiers === tier
                const displayBenefits = isExpanded ? tierBenefits.benefits : tierBenefits.benefits.slice(0, 3)
                
                return (
                  <div
                    key={tier}
                    className="border rounded-lg transition-all"
                    style={{ borderColor: tierBenefits.color }}
                  >
                    <button
                      onClick={() => toggleTierExpansion(tier)}
                      className="w-full p-4 text-left hover:opacity-80 transition-opacity"
                      style={{ backgroundColor: `${tierBenefits.color}10` }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 flex items-center gap-2">
                            <span>{tierData.emoji}</span>
                            {tierData.name}
                            {isActive && <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ backgroundColor: tierBenefits.color, color: 'white' }}>Current</span>}
                          </p>
                          <p className="text-sm mt-1" style={{ color: tierBenefits.color }}>
                            {pointsAway === 0 ? '🎯 You are here' : `${pointsAway} points away`}
                          </p>
                        </div>
                        <div className="flex-shrink-0 ml-4">
                          <svg
                            className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                          </svg>
                        </div>
                      </div>
                    </button>

                    {/* Benefits List */}
                    {(isExpanded || displayBenefits.length > 0) && (
                      <div className="px-4 pb-4 border-t" style={{ borderColor: tierBenefits.color }}>
                        <div className="mt-3 space-y-2">
                          {displayBenefits.map((benefit, bidx) => (
                            <div key={bidx} className="flex items-start gap-3 text-sm">
                              <span style={{ color: tierBenefits.color }}>✓</span>
                              <span className="text-gray-700">{benefit}</span>
                            </div>
                          ))}
                        </div>
                        {!isExpanded && tierBenefits.benefits.length > 3 && (
                          <button
                            onClick={() => toggleTierExpansion(tier)}
                            className="mt-3 text-sm font-medium transition-colors"
                            style={{ color: tierBenefits.color }}
                          >
                            See all {tierBenefits.benefits.length} benefits →
                          </button>
                        )}
                        {isExpanded && tierBenefits.benefits.length > 3 && (
                          <button
                            onClick={() => toggleTierExpansion(tier)}
                            className="mt-3 text-sm font-medium transition-colors"
                            style={{ color: tierBenefits.color }}
                          >
                            Show less ↑
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
