'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'

// Mock data matching the prototype
const mockListings = [
  { id: '1', img: '/images/walkers-varsity-jacket.png', brand: 'Walkers x Wrong Club', title: 'Varsity Jacket', price: 24500, position_x: 12, position_y: 22, category: 'tops', gender: 'mens', images: ['/images/walkers-varsity-jacket.png'] },
  { id: '2', img: '/images/footjoy.png', brand: 'FootJoy', title: 'DryJoys Premiere Field', price: 16500, position_x: 32, position_y: 48, category: 'footwear', gender: 'mens', images: ['/images/footjoy.png'] },
  { id: '3', img: '/images/good-hat.png', brand: 'Good Good', title: 'Big Shot Rope Hat', price: 3800, position_x: 52, position_y: 18, category: 'headwear', gender: 'mens', images: ['/images/good-hat.png'] },
  { id: '4', img: '/images/shorts.png', brand: 'Aguila', title: 'Performance Shorts', price: 8800, position_x: 72, position_y: 58, category: 'bottoms', gender: 'mens', images: ['/images/shorts.png'] },
  { id: '5', img: '/images/yeti-cooler.png', brand: 'YETI x Wrong Club', title: 'Roadie 24 Cooler', price: 27500, position_x: 22, position_y: 68, category: 'bags', gender: 'mens', images: ['/images/yeti-cooler.png'] },
  { id: '6', img: '/images/yeti-bottle.png', brand: 'YETI x Wrong Club', title: 'Rambler 26oz Bottle', price: 4500, position_x: 42, position_y: 38, category: 'accessories', gender: 'mens', images: ['/images/yeti-bottle.png'] },
  { id: '7', img: '/images/walkers-polo.png', brand: 'Walkers x Wrong Club', title: 'Shortbread Polo', price: 9500, position_x: 62, position_y: 72, category: 'tops', gender: 'mens', images: ['/images/walkers-polo.png'] },
  { id: '8', img: '/images/yeti-bucket-hat.png', brand: 'YETI x Wrong Club', title: 'Toile Bucket Hat', price: 4800, position_x: 82, position_y: 28, category: 'headwear', gender: 'mens', images: ['/images/yeti-bucket-hat.png'] },
  { id: '9', img: '/images/malbon.png', brand: 'Malbon Golf', title: 'Script Bucket Hat', price: 5800, position_x: 48, position_y: 62, category: 'headwear', gender: 'womens', images: ['/images/malbon.png'] },
  { id: '10', img: '/images/metalwood.png', brand: 'Metalwood Studio', title: 'Camo Sleeve Crewneck', price: 14500, position_x: 55, position_y: 35, category: 'tops', gender: 'mens', images: ['/images/metalwood.png'] },
  { id: '11', img: '/images/red-snapper-tees.png', brand: 'Red Snapper', title: 'Golf Tees - Sardine Tin', price: 2500, position_x: 75, position_y: 45, category: 'accessories', gender: 'mens', images: ['/images/red-snapper-tees.png'] },
  { id: '12', img: '/images/walkers-rain-jacket.png', brand: 'Walkers x Wrong Club', title: 'Rain Jacket', price: 29500, position_x: 38, position_y: 52, category: 'tops', gender: 'mens', images: ['/images/walkers-rain-jacket.png'] },
  { id: '13', img: '/images/walkers-socks.png', brand: 'Walkers x Wrong Club', title: 'Merino Wool Shortbread Socks', price: 3000, position_x: 28, position_y: 35, category: 'accessories', gender: 'mens', images: ['/images/walkers-socks.png'] },
  { id: '14', img: '/images/walkers-golf-balls.png', brand: 'Walkers x Wrong Club', title: 'Shortbread Golf Balls (3-Pack)', price: 1500, position_x: 65, position_y: 55, category: 'accessories', gender: 'mens', images: ['/images/walkers-golf-balls.png'] },
  { id: '15', img: '/images/walkers-trousers.png', brand: 'Walkers x Wrong Club', title: 'Golf Trousers - Cream', price: 7500, position_x: 18, position_y: 58, category: 'bottoms', gender: 'mens', images: ['/images/walkers-trousers.png'] },
  { id: '16', img: '/images/fairway-fingers.png', brand: 'Walkers x Wrong Club', title: 'Fairway Fingers Shortbread', price: 500, position_x: 30, position_y: 45, category: 'accessories', gender: 'mens', images: ['/images/fairway-fingers.png'] },
  { id: '17', img: '/images/vinamilk-tee.png', brand: 'Vinamilk x Wrong Club', title: 'Vinamilk x Wrong Club Tee', price: 8500, position_x: 45, position_y: 32, category: 'tops', gender: 'mens', images: ['/images/vinamilk-tee.png'] },
  { id: '18', img: '/images/vinamilk-longsleeve.png', brand: 'Vinamilk x Wrong Club', title: 'Vinamilk x Wrong Club Long Sleeve', price: 9500, position_x: 70, position_y: 48, category: 'tops', gender: 'mens', images: ['/images/vinamilk-longsleeve.png'] },
  { id: '19', img: '/images/vinamilk-trousers.png', brand: 'Vinamilk x Wrong Club', title: 'Vinamilk x Wrong Club Trousers', price: 12000, position_x: 55, position_y: 62, category: 'bottoms', gender: 'mens', images: ['/images/vinamilk-trousers.png'] },
  { id: '20', img: '/images/vinamilk-gilet.png', brand: 'Vinamilk x Wrong Club', title: 'The Milkman Gilet', price: 11000, position_x: 35, position_y: 70, category: 'tops', gender: 'mens', images: ['/images/vinamilk-gilet.png'] },
  { id: '21', img: '/images/vinamilk-candle.png', brand: 'Vinamilk x Wrong Club', title: 'The Vanillamilk Candle', price: 1000, position_x: 80, position_y: 55, category: 'accessories', gender: 'mens', images: ['/images/vinamilk-candle.png'] },
]

const posters = [
  { id: 'poster-1', img: '/images/walkers-poster.png', title: 'Walkers x Wrong Club', link: '/walkers', position_x: 85, position_y: 70 },
]

const categories = ['Tops', 'Bottoms', 'Footwear', 'Headwear', 'Accessories', 'Bags']

function formatPrice(cents: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100)
}

export default function BrowsePage() {
  const [viewMode, setViewMode] = useState<'course' | 'grid'>('course')
  const [hoveredListing, setHoveredListing] = useState<typeof mockListings[0] | null>(null)
  const [activeGender, setActiveGender] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  
  // Drag and drop state
  const [positions, setPositions] = useState(() => {
    const listingPositions = mockListings.reduce((acc, l) => ({ 
      ...acc, 
      [l.id]: { x: l.position_x || 50, y: l.position_y || 50 } 
    }), {} as Record<string, { x: number; y: number }>)
    const posterPositions = posters.reduce((acc, p) => ({
      ...acc,
      [p.id]: { x: p.position_x || 50, y: p.position_y || 50 }
    }), {} as Record<string, { x: number; y: number }>)
    return { ...listingPositions, ...posterPositions }
  })
  const [dragging, setDragging] = useState<string | null>(null)
  const [startPos, setStartPos] = useState({ mouseX: 0, mouseY: 0, pinX: 0, pinY: 0 })
  const [hasMoved, setHasMoved] = useState(false)
  const courseRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const filteredListings = mockListings.filter(listing => {
    if (activeGender && listing.gender !== activeGender) return false
    if (activeCategory && listing.category !== activeCategory.toLowerCase()) return false
    return true
  })

  const handleCategorySelect = (gender: string, category: string) => {
    setActiveGender(gender)
    setActiveCategory(category)
    setOpenDropdown(null)
  }

  const clearFilters = () => {
    setActiveGender(null)
    setActiveCategory(null)
  }

  const handleMouseDown = (e: React.MouseEvent, listing: typeof mockListings[0]) => {
    e.preventDefault()
    if (!courseRef.current) return
    
    const rect = courseRef.current.getBoundingClientRect()
    const currentPos = positions[listing.id] || { x: 50, y: 50 }
    setDragging(listing.id)
    setHasMoved(false)
    setStartPos({
      mouseX: e.clientX,
      mouseY: e.clientY,
      pinX: currentPos.x,
      pinY: currentPos.y
    })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging || !courseRef.current) return
    
    const rect = courseRef.current.getBoundingClientRect()
    const deltaX = ((e.clientX - startPos.mouseX) / rect.width) * 100
    const deltaY = ((e.clientY - startPos.mouseY) / rect.height) * 100
    
    // Mark as moved if delta exceeds 1%
    if (Math.abs(deltaX) > 1 || Math.abs(deltaY) > 1) {
      setHasMoved(true)
    }
    
    setPositions(prev => ({
      ...prev,
      [dragging]: {
        x: Math.max(0, Math.min(100, startPos.pinX + deltaX)),
        y: Math.max(0, Math.min(100, startPos.pinY + deltaY))
      }
    }))
  }

  const handleMouseUp = (item: typeof mockListings[0] | typeof posters[0]) => {
    if (!hasMoved && dragging) {
      // It was a click, not a drag - navigate to product or poster
      if ('link' in item) {
        // It's a poster
        window.location.href = item.link
      } else {
        // It's a product listing
        window.location.href = `/listing/${item.id}`
      }
    }
    // If hasMoved is true, pin stays in new position, no navigation
    setDragging(null)
    setHasMoved(false)
  }

  return (
    <div className="bg-white">
      {/* Main content */}
      <main className="flex flex-col" style={{ height: 'calc(100vh - 80px)' }}>
        {/* Filter bar */}
        <div className="px-6 py-2 bg-white z-30 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center justify-between gap-4">
            {/* Filters */}
            <div className="flex items-center gap-2">
              <button
                onClick={clearFilters}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  !activeGender && !activeCategory
                    ? 'bg-[#5f6651] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>

              {/* Mens Dropdown */}
              <div 
                className="relative z-50"
                onMouseEnter={() => setOpenDropdown('mens')}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeGender === 'mens'
                      ? 'bg-[#5f6651] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Mens ▾
                </button>
                {openDropdown === 'mens' && (
                  <div className="absolute top-full left-0 mt-0 bg-white rounded-xl shadow-lg border border-gray-100 py-2 min-w-[140px] z-50 pt-3">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => handleCategorySelect('mens', cat)}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Womens Dropdown */}
              <div 
                className="relative z-50"
                onMouseEnter={() => setOpenDropdown('womens')}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeGender === 'womens'
                      ? 'bg-[#5f6651] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Womens ▾
                </button>
                {openDropdown === 'womens' && (
                  <div className="absolute top-full left-0 mt-0 bg-white rounded-xl shadow-lg border border-gray-100 py-2 min-w-[140px] z-50 pt-3">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => handleCategorySelect('womens', cat)}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Juniors Dropdown */}
              <div 
                className="relative z-50"
                onMouseEnter={() => setOpenDropdown('juniors')}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeGender === 'juniors'
                      ? 'bg-[#5f6651] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Juniors ▾
                </button>
                {openDropdown === 'juniors' && (
                  <div className="absolute top-full left-0 mt-0 bg-white rounded-xl shadow-lg border border-gray-100 py-2 min-w-[140px] z-50 pt-3">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => handleCategorySelect('juniors', cat)}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Active filter indicator */}
              {activeCategory && (
                <span className="px-3 py-1 bg-[#5f6651] text-white rounded-full text-sm font-medium">
                  {activeCategory}
                  <button onClick={clearFilters} className="ml-2 hover:text-gray-200">×</button>
                </span>
              )}
            </div>

            {/* View toggle */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1">
              <button
                onClick={() => setViewMode('course')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  viewMode === 'course' ? 'bg-[#5f6651] text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                ⛳ Course
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  viewMode === 'grid' ? 'bg-[#5f6651] text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                ▦ Grid
              </button>
            </div>
          </div>
        </div>

        {/* Course View */}
        {viewMode === 'course' && (
          <div 
            ref={courseRef}
            className="relative w-full flex-1 overflow-hidden cursor-grab active:cursor-grabbing"
            onMouseMove={handleMouseMove}
            onMouseUp={(e) => {
              if (dragging) {
                const listing = mockListings.find(l => l.id === dragging)
                const poster = posters.find(p => p.id === dragging)
                if (listing) handleMouseUp(listing)
                if (poster) handleMouseUp(poster as any)
              }
            }}
            onMouseLeave={(e) => {
              if (dragging) {
                const listing = mockListings.find(l => l.id === dragging)
                const poster = posters.find(p => p.id === dragging)
                if (listing) handleMouseUp(listing)
                if (poster) handleMouseUp(poster as any)
              }
            }}
          >
            {/* Golf course background */}
            <Image
              src="/browse-background.png"
              alt="Golf course background"
              fill
              priority
              quality={85}
              style={{ objectFit: 'contain', pointerEvents: 'none' }}
              className="absolute inset-0 select-none"
              draggable={false}
            />

            {/* Product pins */}
            {isMounted && filteredListings.map((listing) => {
              const isBeingDragged = dragging === listing.id
              const pos = positions[listing.id] || { x: 50, y: 50 }
              
              return (
                <div
                  key={listing.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
                  style={{ 
                    left: `${pos.x}%`, 
                    top: `${pos.y}%`,
                    cursor: 'move'
                  }}
                  onMouseEnter={() => !isBeingDragged && setHoveredListing(listing)}
                  onMouseLeave={() => !isBeingDragged && setHoveredListing(null)}
                  onMouseDown={(e) => handleMouseDown(e, listing)}
                >
                  <div className={`w-[75px] h-[75px] transition-transform relative ${
                    isBeingDragged ? 'scale-125' : 'hover:scale-110'
                  }`}>
                    <Image
                      src={listing.img}
                      alt={listing.title}
                      fill
                      className="object-contain"
                      sizes="75px"
                    />
                  </div>
                </div>
              )
            })}

            {/* Posters */}
            {isMounted && posters.map((poster) => {
              const isBeingDragged = dragging === poster.id
              const pos = positions[poster.id] || { x: 50, y: 50 }
              
              return (
                <div
                  key={poster.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
                  style={{ 
                    left: `${pos.x}%`, 
                    top: `${pos.y}%`,
                    cursor: 'move'
                  }}
                  onMouseDown={(e) => handleMouseDown(e, poster as any)}
                >
                  <div className={`w-[75px] h-[75px] transition-transform relative ${
                    isBeingDragged ? 'scale-125' : 'hover:scale-110'
                  }`}>
                    <Image
                      src={poster.img}
                      alt={poster.title}
                      fill
                      className="object-contain"
                      sizes="75px"
                    />
                  </div>
                </div>
              )
            })}

            {/* Tooltip */}
            {hoveredListing && (
              <div 
                className="absolute z-20 bg-white rounded-xl shadow-xl p-3 pointer-events-none"
                style={{ 
                  left: `${positions[hoveredListing.id]?.x || 50}%`, 
                  top: `${(positions[hoveredListing.id]?.y || 50) - 15}%`,
                  transform: 'translate(-50%, -100%)'
                }}
              >
                <div className="flex items-center gap-3 min-w-[200px]">
                  <div className="w-16 h-16 rounded-lg overflow-hidden relative">
                    <Image
                      src={hoveredListing.img}
                      alt={hoveredListing.title}
                      fill
                      className="object-contain"
                      sizes="64px"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{hoveredListing.brand}</p>
                    <p className="font-medium text-sm">{hoveredListing.title}</p>
                    <p className="text-[#5f6651] font-bold">{formatPrice(hoveredListing.price)}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Hint */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-gray-600">
              👆 Hover to preview • Drag to reposition • Click to view
            </div>

            {/* WC Logo */}
            <Link
              href="/about"
              className="absolute bottom-4 right-4 opacity-70 hover:opacity-100 transition-opacity group cursor-pointer"
            >
              <Image
                src="/images/Wrong Club Logo.png"
                alt="Wrong Club Logo"
                width={90}
                height={90}
                style={{ width: 'auto', height: 'auto' }}
              />
              <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-brand-green text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                About Wrong Club
              </div>
            </Link>
          </div>
        )}

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="w-full flex-1 overflow-y-auto px-6 py-8">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredListings.map((listing) => (
                <Link
                  key={listing.id}
                  href={`/listing/${listing.id}`}
                  className="group block bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all"
                >
                  <div className="aspect-square overflow-hidden relative bg-transparent">
                    <Image
                      src={listing.img}
                      alt={listing.title}
                      fill
                      className="object-contain"
                      quality={70}
                      loading="lazy"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">{listing.brand}</p>
                    <h3 className="font-medium text-gray-900 mt-1 line-clamp-1">{listing.title}</h3>
                    <p className="text-lg font-bold text-[#5f6651] mt-2">{formatPrice(listing.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
