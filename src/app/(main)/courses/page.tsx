'use client'

import Link from 'next/link'
import { useState, useMemo } from 'react'
import { Heart } from 'lucide-react'

// ==================
// TYPE DEFINITIONS
// ==================

interface Course {
  id: string
  type: 'home' | 'official'
  name: string
  username: string
  tagline: string
  header_image: string
  
  // Metrics for algorithm
  totalSales: number
  salesLast30Days: number
  salesLast7Days: number
  rating: number
  reviewCount: number
  repeatBuyerRate: number
  disputeRate: number
  
  totalListings: number
  newListingsLast7Days: number
  avgDaysToSell: number
  
  followers: number
  activeFollowers: number
  responseRate: number
  avgResponseTimeHours: number
  
  accountAgeDays: number
  profileCompleteScore: number
  
  // Flags
  isVerified: boolean
  isSponsored: boolean
  sponsorTier: 'basic' | 'premium' | 'featured' | null
  hasNewDrop: boolean
  dropDate: string | null
  isFeatured: boolean
  isNewSeller: boolean
  
  // Display
  tier?: string
  terrain?: string
  location?: string
}

// ==================
// HOME COURSES DATA
// ==================

const homeCourses: Course[] = [
  {
    id: 'hc1',
    type: 'home',
    name: "Lachlan's Links",
    username: 'lachlan',
    tagline: 'Premium golf gear, priced right',
    header_image: '/images/sarahl-header.png',
    tier: 'eagle',
    terrain: 'links',
    totalSales: 47,
    salesLast30Days: 12,
    salesLast7Days: 4,
    rating: 4.9,
    reviewCount: 38,
    repeatBuyerRate: 0.35,
    disputeRate: 0.02,
    totalListings: 15,
    newListingsLast7Days: 3,
    avgDaysToSell: 8,
    followers: 156,
    activeFollowers: 89,
    responseRate: 98,
    avgResponseTimeHours: 1.5,
    accountAgeDays: 180,
    profileCompleteScore: 100,
    isVerified: true,
    isSponsored: false,
    sponsorTier: null,
    hasNewDrop: false,
    dropDate: null,
    isFeatured: true,
    isNewSeller: false,
  },
  {
    id: 'hc2',
    type: 'home',
    name: "Sarah's Selection",
    username: 'sarahgolf',
    tagline: "Tour player gear specialist. If it was worn on tour, I probably have it.",
    header_image: '/images/sarahl-header.png',
    tier: 'albatross',
    terrain: 'parkland',
    totalSales: 89,
    salesLast30Days: 18,
    salesLast7Days: 6,
    rating: 5.0,
    reviewCount: 72,
    repeatBuyerRate: 0.45,
    disputeRate: 0.01,
    totalListings: 22,
    newListingsLast7Days: 5,
    avgDaysToSell: 5,
    followers: 312,
    activeFollowers: 198,
    responseRate: 100,
    avgResponseTimeHours: 0.5,
    accountAgeDays: 365,
    profileCompleteScore: 100,
    isVerified: true,
    isSponsored: false,
    sponsorTier: null,
    hasNewDrop: false,
    dropDate: null,
    isFeatured: false,
    isNewSeller: false,
  },
  {
    id: 'hc3',
    type: 'home',
    name: "Mike's Vintage Golf",
    username: 'mikep',
    tagline: 'Vintage golf gear collector. Always hunting for rare finds.',
    header_image: '/images/mikep-header.png',
    tier: 'eagle',
    terrain: 'links',
    totalSales: 23,
    salesLast30Days: 8,
    salesLast7Days: 2,
    rating: 4.8,
    reviewCount: 19,
    repeatBuyerRate: 0.25,
    disputeRate: 0.04,
    totalListings: 12,
    newListingsLast7Days: 2,
    avgDaysToSell: 12,
    followers: 89,
    activeFollowers: 45,
    responseRate: 92,
    avgResponseTimeHours: 3,
    accountAgeDays: 120,
    profileCompleteScore: 90,
    isVerified: true,
    isSponsored: false,
    sponsorTier: null,
    hasNewDrop: false,
    dropDate: null,
    isFeatured: false,
    isNewSeller: false,
  },
  {
    id: 'hc4',
    type: 'home',
    name: "Tom's Golf Emporium",
    username: 'tomb',
    tagline: 'Headwear obsessed. 200+ hats and counting.',
    header_image: '/images/tomb-header.png',
    tier: 'hole_in_one',
    terrain: 'parkland',
    totalSales: 892,
    salesLast30Days: 156,
    salesLast7Days: 34,
    rating: 4.9,
    reviewCount: 680,
    repeatBuyerRate: 0.52,
    disputeRate: 0.01,
    totalListings: 145,
    newListingsLast7Days: 18,
    avgDaysToSell: 4,
    followers: 4120,
    activeFollowers: 2456,
    responseRate: 99,
    avgResponseTimeHours: 0.8,
    accountAgeDays: 365,
    profileCompleteScore: 100,
    isVerified: true,
    isSponsored: false,
    sponsorTier: null,
    hasNewDrop: false,
    dropDate: null,
    isFeatured: false,
    isNewSeller: false,
  },
  {
    id: 'hc5',
    type: 'home',
    name: "Chris's Desert Golf",
    username: 'chrisg',
    tagline: 'Desert golf enthusiast. Specializing in hot weather gear.',
    header_image: '/images/chrisg-header.png',
    tier: 'birdie',
    terrain: 'desert',
    totalSales: 31,
    salesLast30Days: 9,
    salesLast7Days: 3,
    rating: 4.9,
    reviewCount: 26,
    repeatBuyerRate: 0.32,
    disputeRate: 0.03,
    totalListings: 14,
    newListingsLast7Days: 4,
    avgDaysToSell: 9,
    followers: 124,
    activeFollowers: 78,
    responseRate: 95,
    avgResponseTimeHours: 2,
    accountAgeDays: 150,
    profileCompleteScore: 95,
    isVerified: true,
    isSponsored: false,
    sponsorTier: null,
    hasNewDrop: false,
    dropDate: null,
    isFeatured: false,
    isNewSeller: false,
  },
  {
    id: 'hc6',
    type: 'home',
    name: "Emma's Golf Fashion",
    username: 'emmak',
    tagline: "Women's golf fashion curator. Making the course stylish.",
    header_image: '/images/emmak-header.png',
    tier: 'eagle',
    terrain: 'parkland',
    totalSales: 19,
    salesLast30Days: 5,
    salesLast7Days: 2,
    rating: 4.6,
    reviewCount: 14,
    repeatBuyerRate: 0.2,
    disputeRate: 0.05,
    totalListings: 9,
    newListingsLast7Days: 2,
    avgDaysToSell: 14,
    followers: 67,
    activeFollowers: 38,
    responseRate: 88,
    avgResponseTimeHours: 4,
    accountAgeDays: 90,
    profileCompleteScore: 85,
    isVerified: false,
    isSponsored: false,
    sponsorTier: null,
    hasNewDrop: false,
    dropDate: null,
    isFeatured: false,
    isNewSeller: false,
  },
  {
    id: 'hc7',
    type: 'home',
    name: "Jake's Budget Finds",
    username: 'jaker',
    tagline: 'Budget finds and steals. Quality gear without the price tag.',
    header_image: '/images/jaker-header.png',
    tier: 'birdie',
    terrain: 'links',
    totalSales: 8,
    salesLast30Days: 2,
    salesLast7Days: 0,
    rating: 4.7,
    reviewCount: 6,
    repeatBuyerRate: 0.1,
    disputeRate: 0.0,
    totalListings: 6,
    newListingsLast7Days: 0,
    avgDaysToSell: 18,
    followers: 23,
    activeFollowers: 12,
    responseRate: 80,
    avgResponseTimeHours: 8,
    accountAgeDays: 45,
    profileCompleteScore: 70,
    isVerified: false,
    isSponsored: false,
    sponsorTier: null,
    hasNewDrop: false,
    dropDate: null,
    isFeatured: false,
    isNewSeller: true,
  },
]

// ==================
// OFFICIAL COURSES DATA
// ==================

const officialCourses: Course[] = [
  {
    id: 'oc1',
    type: 'official',
    name: 'St Andrews Links',
    username: 'st-andrews',
    tagline: 'The Home of Golf - Official Pro Shop',
    header_image: '/images/St-Andrews---Official-Merchandise-CMYK-_1 (1).png',
    location: 'St Andrews, Scotland',
    totalSales: 156,
    salesLast30Days: 22,
    salesLast7Days: 5,
    rating: 4.8,
    reviewCount: 120,
    repeatBuyerRate: 0.28,
    disputeRate: 0.01,
    totalListings: 45,
    newListingsLast7Days: 3,
    avgDaysToSell: 10,
    followers: 890,
    activeFollowers: 456,
    responseRate: 95,
    avgResponseTimeHours: 4,
    accountAgeDays: 400,
    profileCompleteScore: 100,
    isVerified: true,
    isSponsored: true,
    sponsorTier: 'featured',
    hasNewDrop: true,
    dropDate: '2026-02-10',
    isFeatured: false,
    isNewSeller: false,
  },
  {
    id: 'oc2',
    type: 'official',
    name: 'Pebble Beach Pro Shop',
    username: 'pebble-beach',
    tagline: 'Where Champions Play - Official Merchandise',
    header_image: '/images/Pebble Beach.png',
    location: 'Pebble Beach, California',
    totalSales: 89,
    salesLast30Days: 12,
    salesLast7Days: 2,
    rating: 4.7,
    reviewCount: 65,
    repeatBuyerRate: 0.22,
    disputeRate: 0.02,
    totalListings: 38,
    newListingsLast7Days: 1,
    avgDaysToSell: 14,
    followers: 654,
    activeFollowers: 312,
    responseRate: 90,
    avgResponseTimeHours: 6,
    accountAgeDays: 350,
    profileCompleteScore: 100,
    isVerified: true,
    isSponsored: true,
    sponsorTier: 'premium',
    hasNewDrop: false,
    dropDate: null,
    isFeatured: false,
    isNewSeller: false,
  },
  {
    id: 'oc3',
    type: 'official',
    name: 'Pinehurst Resort',
    username: 'pinehurst',
    tagline: 'Home of American Golf - Official Resort Shop',
    header_image: '/images/Pinehurst_1895_Logo_White.svg',
    location: 'Pinehurst, North Carolina',
    totalSales: 67,
    salesLast30Days: 9,
    salesLast7Days: 1,
    rating: 4.6,
    reviewCount: 48,
    repeatBuyerRate: 0.18,
    disputeRate: 0.03,
    totalListings: 32,
    newListingsLast7Days: 0,
    avgDaysToSell: 16,
    followers: 421,
    activeFollowers: 189,
    responseRate: 88,
    avgResponseTimeHours: 8,
    accountAgeDays: 300,
    profileCompleteScore: 95,
    isVerified: true,
    isSponsored: true,
    sponsorTier: 'basic',
    hasNewDrop: false,
    dropDate: null,
    isFeatured: false,
    isNewSeller: false,
  },
  {
    id: 'oc4',
    type: 'official',
    name: 'TPC Sawgrass',
    username: 'tpc-sawgrass',
    tagline: 'Home of THE PLAYERS Championship - Official Tournament Gear',
    header_image: '/images/TPC_Mark_rgb.png',
    location: 'Ponte Vedra Beach, Florida',
    totalSales: 45,
    salesLast30Days: 6,
    salesLast7Days: 1,
    rating: 4.5,
    reviewCount: 32,
    repeatBuyerRate: 0.15,
    disputeRate: 0.04,
    totalListings: 28,
    newListingsLast7Days: 0,
    avgDaysToSell: 19,
    followers: 312,
    activeFollowers: 134,
    responseRate: 85,
    avgResponseTimeHours: 12,
    accountAgeDays: 280,
    profileCompleteScore: 90,
    isVerified: true,
    isSponsored: false,
    sponsorTier: null,
    hasNewDrop: false,
    dropDate: null,
    isFeatured: false,
    isNewSeller: false,
  },
]

// ==================
// RANKING ALGORITHM
// ==================

const calculateCourseScore = (course: Course): number => {
  let score = 0
  let penalties = 0

  // ==================
  // CORE METRICS (0-200 points)
  // ==================

  // 1. SALES VELOCITY - Primary signal (recent sales weighted heavily)
  const velocityScore =
    course.salesLast7Days * 15 +
    course.salesLast30Days * 5 +
    Math.log10(course.totalSales + 1) * 10
  score += Math.min(velocityScore, 150)

  // 2. RATING QUALITY - Weighted by review count
  const ratingConfidence = Math.min(course.reviewCount / 20, 1)
  const ratingScore = (course.rating - 4.0) * 50 * ratingConfidence
  score += Math.max(ratingScore, 0)

  // 3. INVENTORY FRESHNESS
  const freshnessScore =
    course.newListingsLast7Days * 8 +
    (course.totalListings > 5 ? 10 : 0) +
    (course.avgDaysToSell < 14 ? 15 : 0)
  score += Math.min(freshnessScore, 50)

  // ==================
  // TRUST SIGNALS (0-75 points)
  // ==================

  // 4. REPEAT BUYERS - Best trust signal
  score += course.repeatBuyerRate * 40

  // 5. DISPUTE RATE - Low disputes = trustworthy
  score += Math.max(0, 20 - course.disputeRate * 200)

  // 6. RESPONSE QUALITY
  const responseScore =
    (course.responseRate / 100) * 10 + (course.avgResponseTimeHours < 2 ? 5 : 0)
  score += responseScore

  // ==================
  // ENGAGEMENT (0-50 points)
  // ==================

  // 7. ACTIVE FOLLOWERS (diminishing returns)
  score += Math.log10(course.activeFollowers + 1) * 15

  // 8. PROFILE COMPLETENESS
  score += (course.profileCompleteScore / 100) * 10

  // ==================
  // BOOSTS
  // ==================

  // 9. NEW SELLER BOOST (decays over 30 days)
  if (course.isNewSeller && course.accountAgeDays < 30) {
    score += 30 - course.accountAgeDays
  }

  // 10. STAFF FEATURED
  if (course.isFeatured) score += 50

  // 11. NEW DROP (decays over 7 days)
  if (course.hasNewDrop && course.dropDate) {
    const dropDate = new Date(course.dropDate)
    const now = new Date()
    const daysSinceDrop = Math.floor(
      (now.getTime() - dropDate.getTime()) / (1000 * 60 * 60 * 24)
    )
    const dropBoost = Math.max(0, 35 - daysSinceDrop * 5)
    score += dropBoost
  }

  // 12. SPONSORED (Official only, capped)
  if (course.isSponsored && course.type === 'official') {
    const sponsorBoosts: Record<string, number> = {
      basic: 30,
      premium: 50,
      featured: 75,
    }
    score += sponsorBoosts[course.sponsorTier || ''] || 0
  }

  // ==================
  // HOME COURSE PRIORITY
  // ==================

  // 13. HOME COURSE BONUS - Community sellers get inherent boost
  if (course.type === 'home') {
    score += 25
  }

  // ==================
  // ANTI-GAMING PENALTIES
  // ==================

  // 14. Low review-to-sale ratio is suspicious
  const reviewRatio = course.reviewCount / (course.totalSales || 1)
  if (course.totalSales > 10 && reviewRatio < 0.1) {
    penalties += 15
  }

  // 15. Very new account with high sales = suspicious
  if (course.accountAgeDays < 14 && course.salesLast7Days > 10) {
    penalties += 40
  }

  return Math.max(0, score - penalties)
}

// ==================
// DISPLAY LOGIC
// ==================

const getDisplayCourses = (
  allCourses: Course[],
  tab: 'all' | 'home' | 'official'
): Course[] => {
  // Calculate scores and sort
  const withScores = allCourses
    .map((c) => ({
      ...c,
      score: calculateCourseScore(c),
    }))
    .sort((a, b) => b.score - a.score)

  // Filter by tab
  if (tab === 'home') {
    return withScores.filter((c) => c.type === 'home')
  }
  if (tab === 'official') {
    return withScores.filter((c) => c.type === 'official')
  }

  // "All" tab - enforce ~4:1 home:official ratio
  const homeCoursesFiltered = withScores.filter((c) => c.type === 'home')
  const officialCoursesFiltered = withScores.filter((c) => c.type === 'official')

  const result: (Course & { score: number })[] = []
  let homeIndex = 0
  let officialIndex = 0

  const totalToShow = homeCoursesFiltered.length + officialCoursesFiltered.length

  for (let i = 0; i < totalToShow; i++) {
    // Every 5th slot CAN be official if they qualify
    if ((i + 1) % 5 === 0 && officialIndex < officialCoursesFiltered.length) {
      const official = officialCoursesFiltered[officialIndex]
      const nextHome = homeCoursesFiltered[homeIndex]

      // Official must score within 80% of next home course to earn the slot
      if (!nextHome || official.score >= nextHome.score * 0.8) {
        result.push(official)
        officialIndex++
        continue
      }
    }

    // Otherwise show home course
    if (homeIndex < homeCoursesFiltered.length) {
      result.push(homeCoursesFiltered[homeIndex])
      homeIndex++
    } else if (officialIndex < officialCoursesFiltered.length) {
      result.push(officialCoursesFiltered[officialIndex])
      officialIndex++
    }
  }

  return result
}

// ==================
// PAGE COMPONENT
// ==================

export default function CoursesPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'home' | 'official'>('all')
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const isLoggedIn = false // Mock - replace with real auth check

  const allCourses = useMemo(() => [...homeCourses, ...officialCourses], [])
  const displayedCourses = useMemo(
    () => getDisplayCourses(allCourses, activeTab),
    [allCourses, activeTab]
  )

  const tierColors: Record<string, string> = {
    hole_in_one: 'bg-purple-100 text-purple-700',
    albatross: 'bg-blue-100 text-blue-700',
    eagle: 'bg-green-100 text-green-700',
    birdie: 'bg-yellow-100 text-yellow-700',
  }

  const tierEmojis: Record<string, string> = {
    hole_in_one: '🏆',
    albatross: '🌟',
    eagle: '🦅',
    birdie: '🐦',
  }

  const handleFavorite = (e: React.MouseEvent, courseId: string) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isLoggedIn) {
      window.location.href = '/login'
      return
    }

    setFavorites((prev) => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(courseId)) {
        newFavorites.delete(courseId)
      } else {
        newFavorites.add(courseId)
      }
      return newFavorites
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Explore Courses
            </h1>
            <p className="text-gray-600 mt-2">
              Discover community sellers and official pro shops
            </p>

            {/* Tabs */}
            <div className="flex gap-2 mt-6 flex-wrap">
              {[
                { key: 'all' as const, label: 'All' },
                { key: 'home' as const, label: 'Home Courses' },
                { key: 'official' as const, label: 'Official Pro Shops' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeTab === tab.key
                      ? 'bg-[#5f6651] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedCourses.map((course) => (
              <Link
                key={course.id}
                href={`/course/${course.username}`}
                className="group block bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all"
              >
                {/* Header image */}
                <div className="h-36 md:h-44 bg-gray-200 overflow-hidden relative">
                  <img
                    src={course.header_image}
                    alt={course.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).src =
                        '/images/wrong-club-page.png'
                    }}
                  />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex gap-2 flex-wrap z-10">
                    {course.type === 'official' && (
                      <span className="px-2 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
                        Official
                      </span>
                    )}
                    {course.isFeatured && (
                      <span className="px-2 py-1 bg-amber-500 text-white text-xs font-bold rounded-full">
                        ⭐ Featured
                      </span>
                    )}
                    {course.hasNewDrop && (
                      <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                        New Drop
                      </span>
                    )}
                  </div>

                  {/* Favorite heart button */}
                  <button
                    onClick={(e) => handleFavorite(e, course.id)}
                    className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm z-10"
                  >
                    <Heart
                      className={`w-5 h-5 transition-colors ${
                        favorites.has(course.id)
                          ? 'fill-red-500 text-red-500'
                          : 'text-gray-600 hover:text-red-500'
                      }`}
                    />
                  </button>
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="w-12 h-12 bg-[#5f6651] text-white rounded-full flex items-center justify-center font-bold text-lg -mt-10 border-4 border-white shadow-md flex-shrink-0 relative z-10">
                      {course.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0 pt-1">
                      <h3 className="font-bold text-gray-900 truncate">
                        {course.name}
                      </h3>
                      <p className="text-sm text-gray-500">@{course.username}</p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mt-3 line-clamp-1">
                    {course.tagline}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-2 mt-3 text-sm text-gray-500 flex-wrap">
                    <span className="flex items-center gap-1">
                      <span className="text-amber-500">★</span>
                      {course.rating}
                    </span>
                    <span>•</span>
                    <span>{course.followers} followers</span>
                    <span>•</span>
                    <span>{course.totalListings} items</span>
                  </div>

                  {/* Tier badge for home courses */}
                  {course.type === 'home' && course.tier && (
                    <div className="mt-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${tierColors[course.tier] || 'bg-gray-100 text-gray-700'}`}
                      >
                        {tierEmojis[course.tier]}
                        {course.tier.replace('_', ' ')}
                      </span>
                    </div>
                  )}

                  {/* Location for official courses */}
                  {course.type === 'official' && course.location && (
                    <p className="text-xs text-gray-400 mt-2">📍 {course.location}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {/* Empty state */}
          {displayedCourses.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500">No courses found</p>
            </div>
          )}
        </div>
    </div>
  )
}
