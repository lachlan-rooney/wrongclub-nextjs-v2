'use client'

import Link from 'next/link'
import { useState, useMemo } from 'react'

// Type definitions
type OfficialCourse = {
  id: string
  name: string
  slug: string
  logo_url: string | null
  cover_image_url: string | null
  location: string
  description: string
  established_year: number | null
  website_url: string | null
  followers_count: number
  total_listings: number
  total_sales: number
  rating_score: number
  is_founding_course: boolean
  verified_at: string
  created_at: string
}

type HomeCourse = {
  id: string
  user_id: string
  name: string
  username: string
  avatar_url: string | null
  bio: string | null
  terrain: 'links' | 'parkland' | 'desert' | 'mountain' | 'night_golf'
  tier_seller: 'birdie' | 'eagle' | 'albatross' | 'hole_in_one'
  handicap_seller: number
  prestige_seller: number
  followers_count: number
  total_listings: number
  total_sales: number
  rating_score: number
  is_verified_seller: boolean
  created_at: string
}

// Mock data
const mockOfficialCourses: OfficialCourse[] = [
  {
    id: 'oc1',
    name: 'Pebble Beach Pro Shop',
    slug: 'pebble-beach',
    logo_url: '/images/Pebble Beach.png',
    cover_image_url: null,
    location: 'Pebble Beach, CA',
    description: 'Official merchandise from the iconic Pebble Beach Golf Links.',
    established_year: 1919,
    website_url: 'https://pebblebeach.com',
    followers_count: 12400,
    total_listings: 89,
    total_sales: 1247,
    rating_score: 4.9,
    is_founding_course: true,
    verified_at: '2025-01-01',
    created_at: '2025-01-01',
  },
  {
    id: 'oc2',
    name: 'St Andrews Links Shop',
    slug: 'st-andrews',
    logo_url: null,
    cover_image_url: '/images/St-Andrews---Official-Merchandise-CMYK-_1 (1).png',
    location: 'St Andrews, Scotland',
    description: 'The home of golf. Official merchandise and archive pieces.',
    established_year: 1552,
    website_url: 'https://standrews.com',
    followers_count: 18900,
    total_listings: 124,
    total_sales: 2341,
    rating_score: 5.0,
    is_founding_course: true,
    verified_at: '2025-01-01',
    created_at: '2025-01-01',
  },
  {
    id: 'oc3',
    name: 'Pinehurst Resort',
    slug: 'pinehurst',
    logo_url: '/images/Pinehurst_1895_Logo_White.svg',
    cover_image_url: null,
    location: 'Pinehurst, NC',
    description: 'Home of American golf. Tournament merchandise and resort exclusives.',
    established_year: 1895,
    website_url: 'https://pinehurst.com',
    followers_count: 8700,
    total_listings: 67,
    total_sales: 892,
    rating_score: 4.8,
    is_founding_course: false,
    verified_at: '2025-02-15',
    created_at: '2025-02-15',
  },
  {
    id: 'oc4',
    name: 'TPC Sawgrass',
    slug: 'tpc-sawgrass',
    logo_url: '/images/TPC_Mark_rgb.png',
    cover_image_url: null,
    location: 'Ponte Vedra Beach, FL',
    description: 'Home of THE PLAYERS Championship. Official tournament gear.',
    established_year: 1980,
    website_url: 'https://tpc.com/sawgrass',
    followers_count: 6200,
    total_listings: 45,
    total_sales: 567,
    rating_score: 4.7,
    is_founding_course: false,
    verified_at: '2025-03-01',
    created_at: '2025-03-01',
  },
]

const mockHomeCourses: HomeCourse[] = [
  {
    id: 'hc1',
    user_id: 'u1',
    name: 'Mike P.',
    username: 'mikep',
    avatar_url: null,
    bio: 'Vintage golf gear collector. Always hunting for rare finds.',
    terrain: 'links',
    tier_seller: 'eagle',
    handicap_seller: 14.2,
    prestige_seller: 1,
    followers_count: 892,
    total_listings: 34,
    total_sales: 127,
    rating_score: 4.9,
    is_verified_seller: true,
    created_at: '2024-06-15',
  },
  {
    id: 'hc2',
    user_id: 'u2',
    name: 'Sarah L.',
    username: 'sarahgolf',
    avatar_url: null,
    bio: 'Tour player gear specialist. If it was worn on tour, I probably have it.',
    terrain: 'parkland',
    tier_seller: 'albatross',
    handicap_seller: 6.8,
    prestige_seller: 2,
    followers_count: 2340,
    total_listings: 89,
    total_sales: 412,
    rating_score: 5.0,
    is_verified_seller: true,
    created_at: '2024-03-22',
  },
  {
    id: 'hc3',
    user_id: 'u3',
    name: 'Chris G.',
    username: 'chrisg',
    avatar_url: null,
    bio: 'Desert golf enthusiast. Specializing in hot weather gear.',
    terrain: 'desert',
    tier_seller: 'birdie',
    handicap_seller: 11.4,
    prestige_seller: 0,
    followers_count: 234,
    total_listings: 18,
    total_sales: 43,
    rating_score: 4.7,
    is_verified_seller: false,
    created_at: '2024-09-10',
  },
  {
    id: 'hc4',
    user_id: 'u4',
    name: 'Emma K.',
    username: 'emmak',
    avatar_url: null,
    bio: "Women's golf fashion curator. Making the course stylish.",
    terrain: 'parkland',
    tier_seller: 'eagle',
    handicap_seller: 3.2,
    prestige_seller: 1,
    followers_count: 1560,
    total_listings: 56,
    total_sales: 189,
    rating_score: 4.8,
    is_verified_seller: true,
    created_at: '2024-05-18',
  },
  {
    id: 'hc5',
    user_id: 'u5',
    name: 'Tom B.',
    username: 'tomb',
    avatar_url: null,
    bio: 'Headwear obsessed. 200+ hats and counting.',
    terrain: 'links',
    tier_seller: 'hole_in_one',
    handicap_seller: 2.1,
    prestige_seller: 3,
    followers_count: 4120,
    total_listings: 145,
    total_sales: 892,
    rating_score: 4.9,
    is_verified_seller: true,
    created_at: '2023-11-05',
  },
  {
    id: 'hc6',
    user_id: 'u6',
    name: 'Jake R.',
    username: 'jaker',
    avatar_url: null,
    bio: 'Budget finds and steals. Quality gear without the price tag.',
    terrain: 'links',
    tier_seller: 'birdie',
    handicap_seller: 16.5,
    prestige_seller: 0,
    followers_count: 89,
    total_listings: 12,
    total_sales: 18,
    rating_score: 4.5,
    is_verified_seller: false,
    created_at: '2025-01-02',
  },
]

// Styling constants
const terrainStyles: Record<string, string> = {
  links: 'bg-gradient-to-br from-green-200 to-green-400',
  parkland: 'bg-gradient-to-br from-green-300 to-emerald-500',
  desert: 'bg-gradient-to-br from-amber-200 to-orange-400',
  mountain: 'bg-gradient-to-br from-slate-300 to-slate-500',
  night_golf: 'bg-gradient-to-br from-indigo-800 to-purple-900',
}

const tierInfo: Record<string, { name: string; emoji: string; color: string }> = {
  birdie: { name: 'Birdie', emoji: '🐦', color: 'bg-green-500' },
  eagle: { name: 'Eagle', emoji: '🦅', color: 'bg-blue-500' },
  albatross: { name: 'Albatross', emoji: '🌟', color: 'bg-purple-500' },
  hole_in_one: { name: 'Hole-in-One', emoji: '🏆', color: 'bg-yellow-500' },
}

// Helper functions
function searchCourses(courses: any[], query: string) {
  const q = query.toLowerCase().trim()
  if (!q) return courses

  return courses.filter((course) => {
    const name = course.name?.toLowerCase() || ''
    const username = course.username?.toLowerCase() || ''
    const location = course.location?.toLowerCase() || ''
    const bio = course.bio?.toLowerCase() || ''

    return name.includes(q) || username.includes(q) || location.includes(q) || bio.includes(q)
  })
}

function sortCourses(courses: any[], sortBy: string) {
  const sorted = [...courses]

  switch (sortBy) {
    case 'most_popular':
      return sorted.sort((a, b) => {
        const tierOrder: Record<string, number> = { hole_in_one: 4, albatross: 3, eagle: 2, birdie: 1 }
        const aTier = 'tier_seller' in a ? (tierOrder[a.tier_seller as string] ?? 5) : 5
        const bTier = 'tier_seller' in b ? (tierOrder[b.tier_seller as string] ?? 5) : 5
        if (aTier !== bTier) return bTier - aTier
        return b.total_sales - a.total_sales
      })

    case 'highest_rated':
      return sorted.sort((a, b) => b.rating_score - a.rating_score)

    case 'most_sales':
      return sorted.sort((a, b) => b.total_sales - a.total_sales)

    case 'newest':
      return sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    default:
      return sorted
  }
}

export default function CoursesPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'official' | 'home'>('all')
  const [sortBy, setSortBy] = useState('most_popular')
  const [searchQuery, setSearchQuery] = useState('')
  const [followingIds, setFollowingIds] = useState<Set<string>>(new Set())

  const handleFollow = (id: string) => {
    const newFollowing = new Set(followingIds)
    if (newFollowing.has(id)) {
      newFollowing.delete(id)
    } else {
      newFollowing.add(id)
    }
    setFollowingIds(newFollowing)
  }

  // Filter and search courses
  const filteredCourses = useMemo(() => {
    let courses: any[] = []

    if (activeTab === 'all' || activeTab === 'official') {
      courses = [...courses, ...mockOfficialCourses]
    }
    if (activeTab === 'all' || activeTab === 'home') {
      courses = [...courses, ...mockHomeCourses]
    }

    courses = searchCourses(courses, searchQuery)
    courses = sortCourses(courses, sortBy)

    return courses
  }, [activeTab, searchQuery, sortBy])

  const officialCourses = filteredCourses.filter((c) => !('tier_seller' in c))
  const homeCourses = filteredCourses.filter((c) => 'tier_seller' in c)

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gray-50 px-6 py-6 border-b border-gray-200">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Courses</h1>
          <p className="text-gray-600 text-base mb-4">Discover sellers and official pro shops</p>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5f6651] focus:border-transparent text-sm"
            />
            <svg className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white px-6 py-3 border-b border-gray-200">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-6">
          {/* Tabs */}
          <div className="flex gap-1">
            {[
              { id: 'all', label: 'All' },
              { id: 'official', label: 'Official Courses' },
              { id: 'home', label: 'Home Courses' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#5f6651] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-sm font-medium cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5f6651]"
          >
            <option value="most_popular">Most Popular</option>
            <option value="highest_rated">Highest Rated</option>
            <option value="most_sales">Most Sales</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>

      {/* Main Content */}
      <main className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {filteredCourses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg mb-4">No courses found matching your search</p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setActiveTab('all')
                }}
                className="px-6 py-2 bg-[#5f6651] text-white rounded-lg font-semibold hover:bg-[#4a5040] transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              {/* Official Courses Section */}
              {(activeTab === 'all' || activeTab === 'official') && officialCourses.length > 0 && (
                <div className="mb-16">
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <h2 className="text-2xl font-bold text-gray-900">Official Courses</h2>
                      <span className="text-xl">✓</span>
                    </div>
                    <p className="text-gray-600">Verified golf course pro shops</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {officialCourses.map((course: OfficialCourse) => (
                      <div
                        key={course.id}
                        className="bg-white rounded-xl border border-gray-200 overflow-visible hover:shadow-lg hover:-translate-y-2 transition-all flex flex-col"
                      >
                        {/* Cover Image */}
                        <div className="relative w-full h-40 bg-gradient-to-br from-blue-100 to-blue-300 flex items-center justify-center pb-8 rounded-t-xl overflow-hidden">
                          {course.id === 'oc2' && course.cover_image_url ? (
                            // St Andrews - smaller image
                            <img
                              src={course.cover_image_url}
                              alt={course.name}
                              className="h-28 w-auto object-contain"
                            />
                          ) : course.cover_image_url ? (
                            // Other cover images - full size
                            <img
                              src={course.cover_image_url}
                              alt={course.name}
                              className="w-full h-full object-cover"
                            />
                          ) : course.logo_url ? (
                            <img
                              src={course.logo_url}
                              alt={course.name}
                              className="w-20 h-20 object-contain"
                            />
                          ) : (
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-blue-300 flex items-center justify-center text-4xl shadow-lg border-4 border-white">
                              ⛳
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="px-4 pt-6 pb-4 flex-1 flex flex-col">
                          <h3 className="font-bold text-gray-900 text-lg mb-1">{course.name}</h3>
                          {course.is_founding_course && (
                            <p className="text-xs text-purple-600 font-semibold mb-2">🏆 Founding Course</p>
                          )}
                          <p className="text-sm text-gray-600 mb-3 flex items-start gap-1">
                            <span>📍</span>
                            <span>{course.location}</span>
                          </p>

                          {/* Stats */}
                          <div className="text-xs text-gray-600 space-y-1 mb-4 flex-1">
                            <p>⭐ {course.rating_score.toFixed(1)} • {course.total_sales} sales</p>
                            <p>👥 {(course.followers_count / 1000).toFixed(1)}K followers</p>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2">
                            <Link
                              href={`/course/${course.slug}`}
                              className="flex-1 py-2 bg-[#5f6651] text-white text-center rounded-lg text-sm font-semibold hover:bg-[#4a5040] transition-colors"
                            >
                              View Course
                            </Link>
                            <button
                              onClick={() => handleFollow(course.id)}
                              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
                                followingIds.has(course.id)
                                  ? 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                              }`}
                            >
                              {followingIds.has(course.id) ? 'Following ✓' : 'Follow'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Home Courses Section */}
              {(activeTab === 'all' || activeTab === 'home') && homeCourses.length > 0 && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Home Courses</h2>
                    <p className="text-gray-600">Community sellers</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {homeCourses.map((course: HomeCourse) => (
                      <div
                        key={course.id}
                        className="bg-white rounded-xl border border-gray-200 overflow-visible hover:shadow-lg hover:-translate-y-2 transition-all flex flex-col"
                      >
                        {/* Terrain Background */}
                        <div className={`relative w-full h-40 ${terrainStyles[course.terrain]} rounded-t-xl`} />

                        {/* Avatar - Overlapping */}
                        <div className="relative px-4 -mt-8 mb-2 z-10">
                          <div className={`w-16 h-16 ${tierInfo[course.tier_seller].color} rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg border-4 border-white`}>
                            {course.name.charAt(0)}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="px-4 pb-4 flex-1 flex flex-col">
                          <div className="mb-3">
                            <h3 className="font-bold text-gray-900 text-lg">{course.name}</h3>
                            <p className="text-sm text-gray-600">@{course.username}</p>
                            <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
                              <span>{tierInfo[course.tier_seller].emoji}</span>
                              <span>{tierInfo[course.tier_seller].name}</span>
                              <span>•</span>
                              <span>{course.handicap_seller.toFixed(1)} handicap</span>
                            </div>
                          </div>

                          {course.bio && <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-1">{course.bio}</p>}

                          {/* Stats */}
                          <div className="text-xs text-gray-600 space-y-1 mb-4">
                            <p>⭐ {course.rating_score.toFixed(1)} • {course.total_sales} sales</p>
                            <p>👥 {course.followers_count} followers</p>
                          </div>

                          {course.is_verified_seller && (
                            <p className="text-xs text-green-600 font-semibold mb-3">✓ Verified Seller</p>
                          )}

                          {/* Actions */}
                          <div className="flex gap-2">
                            <Link
                              href={`/course/${course.username}`}
                              className="flex-1 py-2 bg-[#5f6651] text-white text-center rounded-lg text-sm font-semibold hover:bg-[#4a5040] transition-colors"
                            >
                              View Course
                            </Link>
                            <button
                              onClick={() => handleFollow(course.id)}
                              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
                                followingIds.has(course.id)
                                  ? 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                              }`}
                            >
                              {followingIds.has(course.id) ? 'Following ✓' : 'Follow'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}
