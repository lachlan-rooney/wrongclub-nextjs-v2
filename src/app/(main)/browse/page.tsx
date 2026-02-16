'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

// Mock data matching the prototype
const mockListings = [
  { id: '1', img: '/images/walkers-varsity-jacket.png', brand: 'Walkers x Wrong Club', title: 'Varsity Jacket', price: 24500, position_x: 12, position_y: 22, category: 'tops', gender: 'mens', size: 'L', images: ['/images/walkers-varsity-jacket.png'] },
  { id: '2', img: '/images/footjoy.png', brand: 'FootJoy', title: 'DryJoys Premiere Field', price: 16500, position_x: 32, position_y: 48, category: 'footwear', gender: 'mens', size: '10', images: ['/images/footjoy.png'] },
  { id: '3', img: '/images/good-hat.png', brand: 'Good Good', title: 'Big Shot Rope Hat', price: 3800, position_x: 52, position_y: 18, category: 'headwear', gender: 'mens', size: 'One Size', images: ['/images/good-hat.png'] },
  { id: '4', img: '/images/shorts.png', brand: 'Aguila', title: 'Performance Shorts', price: 8800, position_x: 72, position_y: 58, category: 'bottoms', gender: 'mens', size: 'M', images: ['/images/shorts.png'] },
  { id: '5', img: '/images/yeti-cooler.png', brand: 'YETI x Wrong Club', title: 'Roadie 24 Cooler', price: 27500, position_x: 22, position_y: 68, category: 'bags', gender: 'mens', size: 'One Size', images: ['/images/yeti-cooler.png'] },
  { id: '6', img: '/images/yeti-bottle.png', brand: 'YETI x Wrong Club', title: 'Rambler 26oz Bottle', price: 4500, position_x: 42, position_y: 38, category: 'accessories', gender: 'mens', size: 'One Size', images: ['/images/yeti-bottle.png'] },
  { id: '7', img: '/images/walkers-polo.png', brand: 'Walkers x Wrong Club', title: 'Shortbread Polo', price: 9500, position_x: 62, position_y: 72, category: 'tops', gender: 'mens', size: 'L', images: ['/images/walkers-polo.png'] },
  { id: '8', img: '/images/yeti-bucket-hat.png', brand: 'YETI x Wrong Club', title: 'Toile Bucket Hat', price: 4800, position_x: 82, position_y: 28, category: 'headwear', gender: 'mens', size: 'One Size', images: ['/images/yeti-bucket-hat.png'] },
  { id: '9', img: '/images/malbon.png', brand: 'Malbon Golf', title: 'Script Bucket Hat', price: 5800, position_x: 48, position_y: 62, category: 'headwear', gender: 'womens', size: 'One Size', images: ['/images/malbon.png'] },
  { id: '10', img: '/images/metalwood.png', brand: 'Metalwood Studio', title: 'Camo Sleeve Crewneck', price: 14500, position_x: 55, position_y: 35, category: 'tops', gender: 'mens', size: 'M', images: ['/images/metalwood.png'] },
  { id: '11', img: '/images/red-snapper-tees.png', brand: 'Red Snapper', title: 'Golf Tees - Sardine Tin', price: 2500, position_x: 75, position_y: 45, category: 'accessories', gender: 'mens', size: 'One Size', images: ['/images/red-snapper-tees.png'] },
  { id: '12', img: '/images/walkers-rain-jacket.png', brand: 'Walkers x Wrong Club', title: 'Rain Jacket', price: 29500, position_x: 38, position_y: 52, category: 'tops', gender: 'mens', size: 'XL', images: ['/images/walkers-rain-jacket.png'] },
  { id: '13', img: '/images/walkers-socks.png', brand: 'Walkers x Wrong Club', title: 'Merino Wool Shortbread Socks', price: 3000, position_x: 28, position_y: 35, category: 'accessories', gender: 'mens', size: 'One Size', images: ['/images/walkers-socks.png'] },
  { id: '14', img: '/images/walkers-golf-balls.png', brand: 'Walkers x Wrong Club', title: 'Shortbread Golf Balls (3-Pack)', price: 1500, position_x: 65, position_y: 55, category: 'accessories', gender: 'mens', size: 'One Size', images: ['/images/walkers-golf-balls.png'] },
  { id: '15', img: '/images/walkers-trousers.png', brand: 'Walkers x Wrong Club', title: 'Golf Trousers - Cream', price: 7500, position_x: 18, position_y: 58, category: 'bottoms', gender: 'mens', size: '32', images: ['/images/walkers-trousers.png'] },
  { id: '16', img: '/images/fairway-fingers.png', brand: 'Walkers x Wrong Club', title: 'Fairway Fingers Shortbread', price: 500, position_x: 30, position_y: 45, category: 'accessories', gender: 'mens', size: 'One Size', images: ['/images/fairway-fingers.png'] },
  { id: '17', img: '/images/vinamilk-tee.png', brand: 'Vinamilk x Wrong Club', title: 'Vinamilk x Wrong Club Tee', price: 8500, position_x: 45, position_y: 32, category: 'tops', gender: 'mens', size: 'M', images: ['/images/vinamilk-tee.png'] },
  { id: '18', img: '/images/vinamilk-longsleeve.png', brand: 'Vinamilk x Wrong Club', title: 'Vinamilk x Wrong Club Long Sleeve', price: 9500, position_x: 70, position_y: 48, category: 'tops', gender: 'mens', size: 'L', images: ['/images/vinamilk-longsleeve.png'] },
  { id: '19', img: '/images/vinamilk-trousers.png', brand: 'Vinamilk x Wrong Club', title: 'Vinamilk x Wrong Club Trousers', price: 12000, position_x: 55, position_y: 62, category: 'bottoms', gender: 'mens', size: '34', images: ['/images/vinamilk-trousers.png'] },
  { id: '20', img: '/images/vinamilk-gilet.png', brand: 'Vinamilk x Wrong Club', title: 'The Milkman Gilet', price: 11000, position_x: 35, position_y: 70, category: 'tops', gender: 'mens', size: 'L', images: ['/images/vinamilk-gilet.png'] },
  { id: '21', img: '/images/vinamilk-candle.png', brand: 'Vinamilk x Wrong Club', title: 'The Vanillamilk Candle', price: 1000, position_x: 80, position_y: 55, category: 'accessories', gender: 'mens', size: 'One Size', images: ['/images/vinamilk-candle.png'] },
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

/**
 * Get adjacent sizes (size ± 1) based on category
 */
function getAdjacentSizes(size: string, category: string): string[] {
  const adjacentSizes = [size] // Always include the exact size

  if (['tops', 'headwear'].includes(category)) {
    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']
    const index = sizes.indexOf(size)
    if (index > 0) adjacentSizes.push(sizes[index - 1])
    if (index < sizes.length - 1) adjacentSizes.push(sizes[index + 1])
  } else if (['bottoms', 'footwear'].includes(category)) {
    // For numeric sizes
    const num = parseFloat(size)
    if (!isNaN(num)) {
      const smaller = (num - 1).toString()
      const larger = (num + 1).toString()
      // Handle .5 sizes for footwear
      if (size.includes('.5')) {
        adjacentSizes.push((num - 1).toFixed(1))
        adjacentSizes.push((num + 1).toFixed(1))
      } else {
        // For whole sizes like pants waist
        if (num > 28) adjacentSizes.push(smaller)
        if (num < 44) adjacentSizes.push(larger)
      }
    }
  }

  return adjacentSizes
}

export default function BrowsePage() {
  const { profile } = useAuth()
  const [isMobile, setIsMobile] = useState(false)
  const [viewMode, setViewMode] = useState<'course' | 'grid'>('course')
  const [hoveredListing, setHoveredListing] = useState<typeof mockListings[0] | null>(null)
  const [activeGender, setActiveGender] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [mySizesOnly, setMySizesOnly] = useState(false)
  const [expandSizeRange, setExpandSizeRange] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  
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

  // Search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchTerm])

  useEffect(() => {
    setIsMounted(true)
    
    // Check if mobile on mount
    const checkMobile = () => {
      const isMobileView = window.innerWidth < 768
      setIsMobile(isMobileView)
      if (isMobileView) {
        setViewMode('grid')
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const mobileCategories = ['All', 'Tops', 'Bottoms', 'Shoes', 'Hats', 'Accessories', 'Bags', 'Collabs ★']

  const filteredListings = mockListings.filter(listing => {
    // Search filter
    const searchLower = debouncedSearch.toLowerCase()
    if (searchLower) {
      const matchesSearch = 
        listing.brand.toLowerCase().includes(searchLower) ||
        listing.title.toLowerCase().includes(searchLower) ||
        listing.category.toLowerCase().includes(searchLower)
      if (!matchesSearch) return false
    }

    // Size filter - "My Sizes Only"
    if (mySizesOnly && profile) {
      // Get user's size for this category
      let userSize: string | null = null
      if (listing.category === 'tops' && profile.size_tops) userSize = profile.size_tops
      else if (listing.category === 'bottoms' && profile.size_bottoms_waist) userSize = profile.size_bottoms_waist
      else if (listing.category === 'footwear' && profile.size_footwear) userSize = profile.size_footwear
      else if (listing.category === 'headwear' && profile.size_headwear) userSize = profile.size_headwear
      
      if (userSize) {
        // Get sizes to match (exact + adjacent if expanded)
        const sizesToMatch = expandSizeRange 
          ? getAdjacentSizes(userSize, listing.category)
          : [userSize]
        
        // Show if: item matches one of the sizes OR item is one-size
        if (!sizesToMatch.includes(listing.size) && listing.size !== 'One Size') return false
      } else {
        // If user hasn't set size for this category, only show one-size items
        if (listing.size !== 'One Size') return false
      }
    }

    // Mobile category filter
    if (isMobile) {
      if (activeCategory && activeCategory !== 'All') {
        if (activeCategory === 'Collabs ★') {
          if (!listing.brand.includes(' x ')) return false
        } else {
          if (listing.category !== activeCategory.toLowerCase()) return false
        }
      }
    } else {
      // Desktop gender/category filter
      if (activeGender && listing.gender !== activeGender) return false
      if (activeCategory && listing.category !== activeCategory.toLowerCase()) return false
    }
    
    return true
  })

  const handleCategorySelect = (gender: string, category: string) => {
    setActiveGender(gender)
    setActiveCategory(category)
    setOpenDropdown(null)
  }

  const handleMobileCategorySelect = (category: string) => {
    setActiveCategory(category === 'All' ? null : category)
  }

  const clearFilters = () => {
    setActiveGender(null)
    setActiveCategory(null)
    setMySizesOnly(false)
    setExpandSizeRange(false)
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
        {/* Search bar - visible on all screens */}
        <div className="px-4 sm:px-6 py-3 bg-white z-30 border-b border-[var(--border)] flex-shrink-0">
          <input
            type="text"
            placeholder="Search brand, product, category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2.5 border border-[var(--border)] rounded-full text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:ring-offset-0 bg-white"
          />
        </div>

        {/* Filter bar - Desktop version */}
        <div className="hidden md:block px-6 py-2 bg-white z-30 border-b border-[var(--border)] flex-shrink-0">
          <div className="flex items-center justify-between gap-4">
            {/* Filters */}
            <div className="flex items-center gap-2">
              <button
                onClick={clearFilters}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  !activeGender && !activeCategory && !mySizesOnly
                    ? 'bg-[var(--brand)] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>

              {/* My Sizes Only Button */}
              {profile && (profile.size_tops || profile.size_bottoms_waist || profile.size_footwear || profile.size_headwear) && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setMySizesOnly(!mySizesOnly)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      mySizesOnly
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    title="Filter by your saved sizes from Settings"
                  >
                    👕 My Sizes Only
                  </button>
                  {mySizesOnly && (
                    <button
                      onClick={() => setExpandSizeRange(!expandSizeRange)}
                      className={`px-3 py-2 rounded-full text-xs font-medium transition-all ${
                        expandSizeRange
                          ? 'bg-amber-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      title="Include sizes just outside your range (±1 size)"
                    >
                      {expandSizeRange ? '📏 ±1 Size' : '±1 Size'}
                    </button>
                  )}
                </div>
              )}
              <div 
                className="relative z-50"
                onMouseEnter={() => setOpenDropdown('mens')}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeGender === 'mens'
                      ? 'bg-[var(--brand)] text-white'
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
                      ? 'bg-[var(--brand)] text-white'
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
                      ? 'bg-[var(--brand)] text-white'
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
                <span className="px-3 py-1 bg-[var(--brand)] text-white rounded-full text-sm font-medium">
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
                  viewMode === 'course' ? 'bg-[var(--brand)] text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                ⛳ Course
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  viewMode === 'grid' ? 'bg-[var(--brand)] text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                ▦ Grid
              </button>
            </div>
          </div>
        </div>

        {/* Filter chips bar - Mobile only */}
        {isMobile && (
          <div className="px-3 py-3 bg-white z-30 border-b border-[var(--border)] flex-shrink-0 overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 whitespace-nowrap">
              {mobileCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleMobileCategorySelect(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-all flex-shrink-0 active:scale-95 ${
                    (cat === 'All' ? !activeCategory : activeCategory === cat)
                      ? 'bg-[var(--brand)] text-white'
                      : 'bg-white text-gray-700 border-[1.5px] border-[var(--border)]'
                  }`}
                  style={{ fontFamily: 'DM Sans', fontSize: '13px', fontWeight: 500 }}
                >
                  {cat}
                </button>
              ))}
              {profile && (profile.size_tops || profile.size_bottoms_waist || profile.size_footwear || profile.size_headwear) && (
                <>
                  <div className="w-px bg-gray-300" />
                  <button
                    onClick={() => setMySizesOnly(!mySizesOnly)}
                    className={`px-3 py-2 rounded-full text-xs font-medium transition-all flex-shrink-0 active:scale-95 ${
                      mySizesOnly
                        ? 'bg-green-500 text-white'
                        : 'bg-white text-gray-700 border-[1.5px] border-[var(--border)]'
                    }`}
                    style={{ fontFamily: 'DM Sans', fontSize: '13px', fontWeight: 500 }}
                  >
                    👕 My Sizes
                  </button>
                  {mySizesOnly && (
                    <button
                      onClick={() => setExpandSizeRange(!expandSizeRange)}
                      className={`px-3 py-2 rounded-full text-xs font-medium transition-all flex-shrink-0 active:scale-95 ${
                        expandSizeRange
                          ? 'bg-amber-500 text-white'
                          : 'bg-white text-gray-700 border-[1.5px] border-[var(--border)]'
                      }`}
                      style={{ fontFamily: 'DM Sans', fontSize: '13px', fontWeight: 500 }}
                    >
                      {expandSizeRange ? '📏 ±1' : '±1'}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* Results count */}
        <div className="px-4 sm:px-6 py-2 bg-white text-xs text-gray-500 border-b border-[var(--border)] flex-shrink-0">
          {filteredListings.length} {filteredListings.length === 1 ? 'item' : 'items'}
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
          <div className="w-full flex-1 overflow-y-auto">
            <div className={isMobile ? 'p-3' : 'px-6 py-8'}>
              <div className={isMobile ? 'grid grid-cols-2 gap-2.5' : 'max-w-7xl mx-auto grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'}>
                {filteredListings.map((listing, idx) => (
                  <Link
                    key={listing.id}
                    href={`/listing/${listing.id}`}
                    className={`group block bg-white rounded-2xl overflow-hidden ${isMobile ? '' : 'border border-gray-100 hover:shadow-lg'} transition-all`}
                    style={isMobile ? {
                      animation: `fadeUpStagger 0.4s ease-out ${idx * 30}ms backwards`
                    } : {}}
                  >
                    {/* Image container */}
                    <div className="aspect-square overflow-hidden relative" style={{
                      backgroundColor: isMobile ? 'rgba(95, 102, 81, 0.05)' : 'transparent'
                    }}>
                      <Image
                        src={listing.img}
                        alt={listing.title}
                        fill
                        className="object-contain"
                        quality={70}
                        loading="lazy"
                        sizes={isMobile ? "50vw" : "(max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"}
                      />

                      {isMobile && (
                        <>
                          {/* Heart button */}
                          <button
                            className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-95"
                            style={{
                              backgroundColor: 'rgba(255, 255, 255, 0.9)',
                              backdropFilter: 'blur(8px)'
                            }}
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                            }}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                            </svg>
                          </button>

                          {/* COLLAB badge */}
                          {listing.brand.includes(' x ') && (
                            <div className="absolute top-2 left-2 bg-[var(--brand)] text-white px-2.5 py-1 rounded-full text-[10px] font-bold">
                              COLLAB
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    {/* Card info */}
                    <div className={isMobile ? 'p-2.5' : 'p-4'}>
                      <p className={`text-[var(--brand)] uppercase ${isMobile ? 'text-[10px] tracking-wider' : 'text-xs tracking-wide'}`} style={{ letterSpacing: isMobile ? '0.8px' : 'normal' }}>
                        {listing.brand}
                      </p>
                      <h3 className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-900 mt-1 line-clamp-2`}>
                        {listing.title}
                      </h3>
                      <div className={`mt-2 flex items-center ${isMobile ? 'justify-between gap-2' : 'justify-between'}`}>
                        <p className={`font-bold text-[var(--brand)] ${isMobile ? 'text-sm' : 'text-lg'}`}>
                          {formatPrice(listing.price)}
                        </p>
                        {isMobile && (
                          <span className={`px-2 py-1 rounded-full text-[11px] font-medium bg-[var(--sand-light)] text-gray-700`}>
                            {listing.category}
                          </span>
                        )}
                      </div>
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
