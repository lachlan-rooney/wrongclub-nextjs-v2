'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useParams } from 'next/navigation'

// Mock course data
const mockCourses = {
  'pebble-beach': {
    id: 'oc1',
    name: 'Pebble Beach Pro Shop',
    slug: 'pebble-beach',
    location: 'Pebble Beach, CA',
    description: 'Official merchandise from the iconic Pebble Beach Golf Links.',
    logo_url: '/images/Pebble Beach.png',
    cover_image_url: null,
    established_year: 1919,
    website_url: 'https://pebblebeach.com',
    followers_count: 12400,
    total_listings: 89,
    total_sales: 1247,
    rating_score: 4.9,
    is_founding_course: true,
    terrain: 'links',
    bio: 'One of the most prestigious golf courses in the world, Pebble Beach Golf Links sits on the Monterey Peninsula in California. Established in 1919, we offer exclusive merchandise and memorabilia.',
    socials: {
      website: 'https://pebblebeach.com',
      instagram: 'https://instagram.com/pebblebeach',
      twitter: 'https://twitter.com/pebblebeach',
    },
    offers: [
      {
        id: 'o1',
        title: 'Grand Opening Sale',
        description: '20% off all items this week',
        expiry: '2026-02-01',
      },
      {
        id: 'o2',
        title: 'Free Shipping',
        description: 'On orders over $50',
        expiry: '2026-03-01',
      },
    ],
    media: [
      {
        id: 'm1',
        type: 'video',
        title: 'Pebble Beach Golf Course Tour',
        url: 'https://youtube.com/watch?v=example',
        thumbnail: '🎬',
      },
      {
        id: 'm2',
        type: 'image',
        title: 'Iconic 7th Hole',
        url: '#',
        thumbnail: '📸',
      },
    ],
  },
  'st-andrews': {
    id: 'oc2',
    name: 'St Andrews Links Shop',
    slug: 'st-andrews',
    location: 'St Andrews, Scotland',
    description: 'The home of golf. Official merchandise and archive pieces.',
    logo_url: null,
    cover_image_url: '/images/St-Andrews---Official-Merchandise-CMYK-_1 (1).png',
    established_year: 1552,
    website_url: 'https://standrews.com',
    followers_count: 18900,
    total_listings: 124,
    total_sales: 2341,
    rating_score: 5.0,
    is_founding_course: true,
    terrain: 'links',
    bio: 'St Andrews is the Home of Golf, the world\'s oldest golf course established in 1552. Our shop offers exclusive merchandise, archive pieces, and official St Andrews memorabilia.',
    socials: {
      website: 'https://standrews.com',
      instagram: 'https://instagram.com/standrews',
      twitter: 'https://twitter.com/standrews',
    },
    offers: [
      {
        id: 'o1',
        title: 'Heritage Collection',
        description: 'Vintage St Andrews merchandise',
        expiry: '2026-04-01',
      },
    ],
    media: [
      {
        id: 'm1',
        type: 'video',
        title: 'St Andrews Historical Tour',
        url: 'https://youtube.com/watch?v=example',
        thumbnail: '🎬',
      },
    ],
  },
  'pinehurst': {
    id: 'oc3',
    name: 'Pinehurst Resort',
    slug: 'pinehurst',
    location: 'Pinehurst, NC',
    description: 'Home of American golf. Tournament merchandise and resort exclusives.',
    logo_url: '/images/Pinehurst_1895_Logo_White.svg',
    cover_image_url: null,
    established_year: 1895,
    website_url: 'https://pinehurst.com',
    followers_count: 8700,
    total_listings: 67,
    total_sales: 892,
    rating_score: 4.8,
    is_founding_course: false,
    terrain: 'parkland',
    bio: 'Pinehurst Resort is a world-class golf destination with multiple championship courses. We offer official merchandise and exclusive resort gear.',
    socials: {
      website: 'https://pinehurst.com',
      instagram: 'https://instagram.com/pinehurst',
    },
    offers: [],
    media: [],
  },
  'tpc-sawgrass': {
    id: 'oc4',
    name: 'TPC Sawgrass',
    slug: 'tpc-sawgrass',
    location: 'Ponte Vedra Beach, FL',
    description: 'Home of THE PLAYERS Championship. Official tournament gear.',
    logo_url: '/images/TPC_Mark_rgb.png',
    cover_image_url: null,
    established_year: 1980,
    website_url: 'https://tpc.com/sawgrass',
    followers_count: 6200,
    total_listings: 45,
    total_sales: 567,
    rating_score: 4.7,
    is_founding_course: false,
    terrain: 'desert',
    bio: 'Home of THE PLAYERS Championship, TPC Sawgrass hosts the world\'s top golfers. Browse exclusive tournament merchandise and course apparel.',
    socials: {
      website: 'https://tpc.com/sawgrass',
      twitter: 'https://twitter.com/tpcsawgrass',
    },
    offers: [],
    media: [],
  },
}

// Mock products for each course
const mockProducts = [
  {
    id: 'p1',
    course_slug: 'st-andrews',
    brand: 'St Andrews',
    title: 'Classic Polo Shirt',
    price: 8500,
    image: '👕',
  },
  {
    id: 'p2',
    course_slug: 'st-andrews',
    brand: 'St Andrews',
    title: 'Championship Hat',
    price: 4500,
    image: '🎩',
  },
  {
    id: 'p3',
    course_slug: 'st-andrews',
    brand: 'St Andrews',
    title: 'Golf Balls Set',
    price: 5500,
    image: '⛳',
  },
  {
    id: 'p4',
    course_slug: 'st-andrews',
    brand: 'St Andrews',
    title: 'Course Guide Book',
    price: 3500,
    image: '📖',
  },
  {
    id: 'p5',
    course_slug: 'pebble-beach',
    brand: 'Pebble Beach',
    title: 'Premium Jacket',
    price: 19500,
    image: '🧥',
  },
  {
    id: 'p6',
    course_slug: 'pebble-beach',
    brand: 'Pebble Beach',
    title: 'Course Towel',
    price: 3000,
    image: '🏌️',
  },
]

const terrainStyles: Record<string, string> = {
  links: 'bg-gradient-to-br from-green-200 to-green-400',
  parkland: 'bg-gradient-to-br from-green-300 to-emerald-500',
  desert: 'bg-gradient-to-br from-amber-200 to-orange-400',
  mountain: 'bg-gradient-to-br from-slate-300 to-slate-500',
  night_golf: 'bg-gradient-to-br from-indigo-800 to-purple-900',
}

export default function CoursePage() {
  const params = useParams()
  const slug = params.slug as string

  const course = mockCourses[slug as keyof typeof mockCourses]
  const [activeTab, setActiveTab] = useState<'products' | 'about' | 'offers' | 'media' | 'socials'>('products')
  const [isFollowing, setIsFollowing] = useState(false)

  if (!course) {
    return (
      <div className="min-h-screen bg-white pt-24 px-6">
        <div className="max-w-6xl mx-auto text-center py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Course Not Found</h1>
          <Link href="/courses" className="text-[#5f6651] font-semibold hover:underline">
            Back to Courses
          </Link>
        </div>
      </div>
    )
  }

  const courseProducts = mockProducts.filter((p) => p.course_slug === slug)

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Terrain Background */}
      <div className={`${terrainStyles[course.terrain]} px-6 py-16`}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between gap-6">
            {/* Course Info */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-2">{course.name}</h1>
              {course.is_founding_course && (
                <p className="text-white font-semibold mb-3">🏆 Founding Course</p>
              )}
              <p className="text-white text-lg opacity-90 flex items-center gap-2 mb-4">
                📍 {course.location}
              </p>

              {/* Stats */}
              <div className="flex gap-6 text-white text-sm font-semibold">
                <div>
                  <p className="text-2xl">⭐ {course.rating_score.toFixed(1)}</p>
                  <p className="text-white opacity-90">{course.total_sales} sales</p>
                </div>
                <div>
                  <p className="text-2xl">👥</p>
                  <p className="text-white opacity-90">{(course.followers_count / 1000).toFixed(1)}K followers</p>
                </div>
              </div>
            </div>

            {/* Logo / Avatar */}
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-white bg-opacity-20 border-4 border-white flex items-center justify-center text-5xl shadow-lg">
                ⛳
              </div>
              <button
                onClick={() => setIsFollowing(!isFollowing)}
                className={`mt-6 px-8 py-2 rounded-full font-semibold transition-colors ${
                  isFollowing
                    ? 'bg-white text-[#5f6651] hover:bg-gray-100'
                    : 'bg-white text-gray-900 hover:bg-gray-100'
                }`}
              >
                {isFollowing ? 'Following ✓' : 'Follow'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="sticky top-24 bg-white border-b border-gray-200 px-6 z-40">
        <div className="max-w-6xl mx-auto flex gap-8">
          {[
            { id: 'products', label: 'Products', icon: '🛍️' },
            { id: 'about', label: 'About', icon: 'ℹ️' },
            { id: 'offers', label: 'Offers', icon: '🎁' },
            { id: 'media', label: 'Media', icon: '📸' },
            { id: 'socials', label: 'Socials', icon: '🔗' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`py-4 px-1 border-b-2 font-semibold transition-colors ${
                activeTab === tab.id
                  ? 'border-[#5f6651] text-[#5f6651]'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Products Tab */}
          {activeTab === 'products' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{course.name} Products</h2>
              {courseProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {courseProducts.map((product) => (
                    <div key={product.id} className="bg-gray-50 rounded-2xl p-4 hover:shadow-lg transition-shadow">
                      <div className="w-full aspect-square bg-gray-200 rounded-xl flex items-center justify-center text-4xl mb-4">
                        {product.image}
                      </div>
                      <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">{product.brand}</p>
                      <h3 className="font-semibold text-gray-900 mb-2">{product.title}</h3>
                      <p className="text-lg font-bold text-[#5f6651]">${(product.price / 100).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-8">No products available yet.</p>
              )}
            </div>
          )}

          {/* About Tab */}
          {activeTab === 'about' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">About {course.name}</h2>
              <div className="bg-gray-50 rounded-xl p-8 max-w-3xl">
                <p className="text-gray-700 text-lg leading-relaxed mb-6">{course.bio}</p>

                <div className="grid grid-cols-2 gap-6 border-t border-gray-200 pt-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Established</p>
                    <p className="text-2xl font-bold text-gray-900">{course.established_year}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Total Listings</p>
                    <p className="text-2xl font-bold text-gray-900">{course.total_listings}</p>
                  </div>
                </div>

                {course.website_url && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-3">Official Website</p>
                    <a
                      href={course.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-6 py-2 bg-[#5f6651] text-white rounded-lg font-semibold hover:bg-[#4a5040] transition-colors"
                    >
                      Visit Website →
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Offers Tab */}
          {activeTab === 'offers' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Current Offers</h2>
              {course.offers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {course.offers.map((offer) => (
                    <div key={offer.id} className="bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-amber-200 rounded-xl p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">🎁 {offer.title}</h3>
                      <p className="text-gray-700 mb-4">{offer.description}</p>
                      <p className="text-sm text-gray-600">Expires: {new Date(offer.expiry).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-8">No active offers at the moment. Check back soon!</p>
              )}
            </div>
          )}

          {/* Media Tab */}
          {activeTab === 'media' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Videos & Photos</h2>
              {course.media.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {course.media.map((item) => (
                    <a
                      key={item.id}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <div className="w-full aspect-video flex items-center justify-center text-6xl bg-gray-200">
                        {item.thumbnail}
                      </div>
                      <div className="p-4">
                        <p className="text-sm text-gray-600 mb-1">{item.type === 'video' ? '🎬 Video' : '📸 Photo'}</p>
                        <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-8">No media available yet.</p>
              )}
            </div>
          )}

          {/* Socials Tab */}
          {activeTab === 'socials' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Follow {course.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-2xl">
                {'website' in course.socials && course.socials.website && (
                  <a
                    href={course.socials.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6 hover:border-[#5f6651] hover:shadow-lg transition-all flex items-center gap-4"
                  >
                    <span className="text-3xl">🌐</span>
                    <div>
                      <p className="font-semibold text-gray-900">Website</p>
                      <p className="text-sm text-gray-600">Visit official site</p>
                    </div>
                  </a>
                )}

                {'instagram' in course.socials && course.socials.instagram && (
                  <a
                    href={course.socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6 hover:border-pink-500 hover:shadow-lg transition-all flex items-center gap-4"
                  >
                    <span className="text-3xl">📸</span>
                    <div>
                      <p className="font-semibold text-gray-900">Instagram</p>
                      <p className="text-sm text-gray-600">Follow us</p>
                    </div>
                  </a>
                )}

                {'twitter' in course.socials && course.socials.twitter && (
                  <a
                    href={course.socials.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6 hover:border-blue-400 hover:shadow-lg transition-all flex items-center gap-4"
                  >
                    <span className="text-3xl">𝕏</span>
                    <div>
                      <p className="font-semibold text-gray-900">Twitter</p>
                      <p className="text-sm text-gray-600">Follow us</p>
                    </div>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Back to Courses */}
      <div className="px-6 py-8 border-t border-gray-200">
        <div className="max-w-6xl mx-auto">
          <Link href="/courses" className="text-[#5f6651] font-semibold hover:underline flex items-center gap-2">
            ← Back to All Courses
          </Link>
        </div>
      </div>
    </div>
  )
}
