'use client'

import { useState } from 'react'
import Link from 'next/link'

// Mock feed data
const mockPosts = [
  {
    id: '1',
    type: 'swing_video',
    seller: { name: 'Mike P.', rating: 4.8 },
    caption: 'Testing out this new polo on the range 🔥 #wrongclub #golf',
    product: { id: '1', title: 'Travis Mathew Polo', price: 6500, status: 'active' },
    likes: 234,
    comments: 18,
    isSponsored: true,
  },
  {
    id: '2',
    type: 'fit_check',
    seller: { name: 'Sarah L.', rating: 5.0 },
    caption: 'Course fit check ⛳ Everything tagged!',
    product: { id: '2', title: 'Malbon Bucket Hat', price: 5800, status: 'active' },
    likes: 892,
    comments: 45,
    isSponsored: false,
  },
  {
    id: '3',
    type: 'review',
    seller: { name: 'Tom B.', rating: 4.5 },
    caption: 'Just copped this from @mikep - fits perfect 🙌',
    product: { id: '3', title: 'FootJoy Premieres', price: 16500, status: 'sold' },
    likes: 156,
    comments: 12,
    isSponsored: false,
  },
  {
    id: '4',
    type: 'fit_check',
    seller: { name: 'Jordan K.', rating: 4.9 },
    caption: 'New season, new gear! This YETI cooler is a game changer 🧊',
    product: { id: '5', title: 'YETI Roadie 24 Cooler', price: 27500, status: 'active' },
    likes: 1234,
    comments: 89,
    isSponsored: true,
  },
  {
    id: '5',
    type: 'swing_video',
    seller: { name: 'Alex R.', rating: 4.6 },
    caption: 'Swing analysis with the new FootJoy shoes - can really feel the difference!',
    product: { id: '2', title: 'DryJoys Premiere Field', price: 16500, status: 'active' },
    likes: 567,
    comments: 34,
    isSponsored: false,
  },
  {
    id: '6',
    type: 'review',
    seller: { name: 'Chris D.', rating: 4.7 },
    caption: 'Walkers jacket keeps me warm AND looking fresh. 10/10 would recommend',
    product: { id: '1', title: 'Walkers Tartan Jacket', price: 24500, status: 'sold' },
    likes: 423,
    comments: 28,
    isSponsored: false,
  },
]



function formatPrice(cents: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100)
}

export default function FeedPage() {
  const [activeTab, setActiveTab] = useState('foryou')
  const [liked, setLiked] = useState<Set<string>>(new Set())
  const [saved, setSaved] = useState<Set<string>>(new Set())

  const toggleLike = (postId: string) => {
    const newLiked = new Set(liked)
    if (newLiked.has(postId)) {
      newLiked.delete(postId)
    } else {
      newLiked.add(postId)
    }
    setLiked(newLiked)
  }

  const toggleSave = (postId: string) => {
    const newSaved = new Set(saved)
    if (newSaved.has(postId)) {
      newSaved.delete(postId)
    } else {
      newSaved.add(postId)
    }
    setSaved(newSaved)
  }

  return (
    <div className="min-h-screen bg-black pt-20">
      {/* Tab Navigation */}
      <div className="fixed top-24 left-0 right-0 z-40 bg-black border-b border-[#5f6651]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center gap-8 h-12">
          {['foryou', 'following', 'trending'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-sm font-medium transition-colors ${
                activeTab === tab 
                  ? 'text-white border-b-2 border-[#5f6651]' 
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {tab === 'foryou' ? 'For You' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Feed */}
      <div 
        className="overflow-y-scroll bg-black" 
        style={{ 
          height: 'calc(100vh - 128px)', 
          marginTop: '64px',
          scrollSnapType: 'y mandatory',
          scrollBehavior: 'smooth'
        }}
      >
        {mockPosts.map((post) => (
          <div key={post.id} className="relative bg-gray-900 flex flex-col" style={{ height: 'calc(100vh - 64px)', scrollSnapAlign: 'start' }}>
            
            {/* Media section - 60% */}
            <div className="flex-1 relative flex items-center justify-center bg-black overflow-hidden">
              <div className="text-9xl">🏌️</div>
              
              {/* Sponsored badge */}
              {post.isSponsored && (
                <div className="absolute top-4 left-4 px-3 py-1 bg-yellow-500/80 rounded-full text-xs font-bold text-black">
                  🌟 PROMOTED
                </div>
              )}
              
              {/* Content type badge */}
              <div className="absolute top-4 right-4 px-3 py-1 bg-white/20 backdrop-blur rounded-full text-xs text-white font-medium">
                {post.type === 'swing_video' && '🎬 Swing'}
                {post.type === 'fit_check' && '📸 Fit Check'}
                {post.type === 'review' && '⭐ Review'}
              </div>
              
              {/* SOLD overlay */}
              {post.product.status === 'sold' && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-6xl font-black text-white/40 tracking-widest">SOLD</span>
                </div>
              )}
            </div>

            {/* Right side actions - absolutely positioned */}
            <div className="absolute right-4 bottom-32 flex flex-col items-center gap-6">
              <button
                onClick={() => toggleLike(post.id)}
                className="flex flex-col items-center group"
              >
                <span className={`text-2xl transition-transform group-hover:scale-110 ${
                  liked.has(post.id) ? '❤️' : '🤍'
                }`}>
                  {liked.has(post.id) ? '❤️' : '🤍'}
                </span>
                <span className="text-white text-xs mt-1 font-semibold">{post.likes}</span>
              </button>
              <button className="flex flex-col items-center group">
                <span className="text-2xl transition-transform group-hover:scale-110">💬</span>
                <span className="text-white text-xs mt-1 font-semibold">{post.comments}</span>
              </button>
              <button
                onClick={() => toggleSave(post.id)}
                className="flex flex-col items-center group"
              >
                <span className={`text-2xl transition-transform group-hover:scale-110 ${
                  saved.has(post.id) ? '🔖' : '📌'
                }`}>
                  {saved.has(post.id) ? '🔖' : '📌'}
                </span>
              </button>
              <button className="flex flex-col items-center group">
                <span className="text-2xl transition-transform group-hover:scale-110">↗️</span>
              </button>
            </div>
            
            {/* Bottom section - 40% */}
            <div className="flex-1 p-4 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col justify-between">
              {/* Seller info */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#5f6651] rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {post.seller.name.charAt(0)}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{post.seller.name}</p>
                  <p className="text-gray-400 text-xs">⛳ {post.seller.rating}</p>
                </div>
              </div>
              
              {/* Caption */}
              <p className="text-white text-sm leading-relaxed">{post.caption}</p>
              
              {/* Tagged product */}
              <Link href={`/listing/${post.product.id}`} className="flex items-center gap-3 bg-white/10 backdrop-blur rounded-xl p-3 hover:bg-white/20 transition-colors border border-white/20">
                <div className="w-14 h-14 bg-gray-700 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                  🏌️
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm line-clamp-1">{post.product.title}</p>
                  <p className="text-[#5f6651] font-bold text-sm">{formatPrice(post.product.price)}</p>
                </div>
                {post.product.status === 'active' ? (
                  <button className="px-4 py-2 bg-[#5f6651] hover:bg-[#4a5040] text-white rounded-lg text-xs font-semibold transition-colors flex-shrink-0">
                    Add
                  </button>
                ) : (
                  <span className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg text-xs font-semibold flex-shrink-0">
                    Sold
                  </span>
                )}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
