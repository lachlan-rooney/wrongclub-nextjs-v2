'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, MessageCircle, Share2 } from 'lucide-react'

interface Listing {
  id: string
  title: string
  brand: string
  price: number
  image: string
  position: { x: number; y: number }
  condition: string
  size: string
}

interface SellerCourse {
  username: string
  name: string
  course_name: string
  tagline: string
  tier: 'birdie' | 'eagle' | 'albatross' | 'hole_in_one'
  rating: number
  total_sales: number
  followers: number
  avatar_url: string | null
  banner_url: string | null
  banner_position: number
  terrain: 'links' | 'parkland' | 'desert' | 'mountain' | 'night_golf'
  time_of_day: 'morning' | 'midday' | 'golden' | 'dusk'
  accent_color: string
}

const mockSeller: SellerCourse = {
  username: 'lachlan',
  name: 'Lachlan',
  course_name: "Lachlan's Links",
  tagline: 'Premium golf gear, priced right',
  tier: 'eagle',
  rating: 4.9,
  total_sales: 47,
  followers: 156,
  avatar_url: null,
  banner_url: '/images/lachlans-links-header.png',
  banner_position: 50,
  terrain: 'links',
  time_of_day: 'midday',
  accent_color: '#5f6651',
}

const mockListings: Listing[] = [
  {
    id: '1',
    title: 'Travis Mathew Polo',
    brand: 'Travis Mathew',
    price: 6500,
    image: '/images/walkers-polo.png',
    position: { x: 30, y: 40 },
    condition: 'Like New',
    size: 'L',
  },
  {
    id: '2',
    title: 'Malbon Bucket Hat',
    brand: 'Malbon Golf',
    price: 5800,
    image: '/images/malbon.png',
    position: { x: 60, y: 25 },
    condition: 'New with Tags',
    size: 'One Size',
  },
  {
    id: '3',
    title: 'FootJoy Premieres',
    brand: 'FootJoy',
    price: 16500,
    image: '/images/footjoy.png',
    position: { x: 50, y: 70 },
    condition: 'Good',
    size: '10',
  },
  {
    id: '4',
    title: 'Good Good Rope Hat',
    brand: 'Good Good',
    price: 3800,
    image: '/images/good-hat.png',
    position: { x: 20, y: 60 },
    condition: 'New with Tags',
    size: 'One Size',
  },
  {
    id: '5',
    title: 'Nike Dri-FIT Polo',
    brand: 'Nike',
    price: 8500,
    image: '/images/metalwood.png',
    position: { x: 75, y: 50 },
    condition: 'Like New',
    size: 'M',
  },
]

const terrainStyles = {
  links: {
    background: '/images/links.png',
    fallback: '#8B9A7D',
  },
  parkland: {
    background: '/browse-background.png',
    fallback: '#6B7F5E',
  },
  desert: {
    background: '/images/desert.png',
    fallback: '#C4A77D',
  },
  mountain: {
    background: '/images/links.png',
    fallback: '#7A8B8C',
  },
  night_golf: {
    background: '/images/night.png',
    fallback: '#2D3748',
  },
}

const timeOverlays = {
  morning: 'bg-gradient-to-br from-amber-100/10 to-transparent',
  midday: '',
  golden: 'bg-gradient-to-br from-amber-200/15 to-orange-100/10',
  dusk: 'bg-gradient-to-br from-slate-400/15 to-slate-600/20',
}

const tierNames: Record<string, string> = {
  birdie: '🐦 Birdie',
  eagle: '🦅 Eagle',
  albatross: '🪶 Albatross',
  hole_in_one: '⭐ Hole-in-One',
}

function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100)
}

export default function PublicCoursePage({ params }: { params: { username: string } }) {
  const [viewMode, setViewMode] = useState<'course' | 'grid'>('course')
  const [isMounted, setIsMounted] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Banner */}
      {mockSeller.banner_url && (
        <div className="w-full h-48 bg-gray-200 relative overflow-hidden">
          <Image
            src={mockSeller.banner_url}
            alt={mockSeller.course_name}
            fill
            className="object-cover"
            style={{
              objectPosition: `center ${mockSeller.banner_position}%`,
            }}
          />
        </div>
      )}

      <main className="pb-16">
        {/* Seller Info Section */}
        <div className="px-6 max-w-4xl mx-auto mb-12">
          <div className="flex items-start gap-6 mb-6">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-lg bg-[#5f6651] text-white flex items-center justify-center font-bold text-3xl flex-shrink-0">
              {mockSeller.name.charAt(0)}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{mockSeller.course_name}</h1>
              <p className="text-gray-600 text-lg mt-1">{mockSeller.tagline}</p>

              {/* Stats */}
              <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
                <span>{tierNames[mockSeller.tier]}</span>
                <span>⭐ {mockSeller.rating}</span>
                <span>{mockSeller.total_sales} sales</span>
                <span>{mockSeller.followers} followers</span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={() => setIsFollowing(!isFollowing)}
                  className={`px-6 py-2 rounded-full font-medium transition-colors ${
                    isFollowing
                      ? 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                      : 'bg-[#5f6651] text-white hover:bg-[#4a5241]'
                  }`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                  <MessageCircle className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                  <Share2 className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* View Toggle */}
        <div className="sticky top-16 z-20 bg-white border-b border-gray-100 px-6 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1">
              <button
                onClick={() => setViewMode('course')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  viewMode === 'course'
                    ? 'bg-white shadow text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                ⛳ Course
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white shadow text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                ▦ Grid
              </button>
            </div>

            <div className="text-sm text-gray-500">
              {mockListings.length} items
            </div>
          </div>
        </div>

        <div className="px-6 max-w-4xl mx-auto mt-8">
          {/* Course View */}
          {viewMode === 'course' && (
            <div
              className="rounded-2xl h-96 relative overflow-hidden mb-8"
              style={{
                backgroundImage: `url(${terrainStyles[mockSeller.terrain].background})`,
                backgroundColor: mockSeller.accent_color,
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            >
              {/* Time of Day Overlay */}
              <div
                className={`absolute inset-0 ${timeOverlays[mockSeller.time_of_day]} pointer-events-none`}
              />

              {/* Products */}
              {isMounted &&
                mockListings.map((listing) => (
                  <Link
                    key={listing.id}
                    href={`/listing/${listing.id}`}
                    className="absolute group transition-transform hover:scale-110 hover:z-10"
                    style={{
                      left: `${listing.position.x}%`,
                      top: `${listing.position.y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    {/* Product image */}
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-lg bg-white">
                      <img
                        src={listing.image}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Price tag */}
                    <div className="text-xs font-bold text-white bg-black/70 rounded-full px-2 py-0.5 mt-1 text-center whitespace-nowrap">
                      {formatPrice(listing.price)}
                    </div>

                    {/* Hover tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <div className="bg-white rounded-lg shadow-lg p-2 text-center whitespace-nowrap">
                        <p className="text-xs text-gray-500">{listing.brand}</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {listing.title.substring(0, 20)}
                          {listing.title.length > 20 ? '...' : ''}
                        </p>
                        <p className="text-xs text-gray-500">
                          {listing.size} • {listing.condition}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          )}

          {/* Grid View */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {mockListings.map((listing) => (
                <Link
                  key={listing.id}
                  href={`/listing/${listing.id}`}
                  className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-square bg-gray-100">
                    <img
                      src={listing.image}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-gray-500 uppercase">{listing.brand}</p>
                    <p className="font-medium text-gray-900 text-sm truncate">
                      {listing.title}
                    </p>
                    <p className="text-[#5f6651] font-bold mt-1">
                      {formatPrice(listing.price)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {listing.size} • {listing.condition}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
