'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'

type Occasion = 'casual' | 'tournament' | 'club_dinner' | 'practice'
type Weather = 'hot' | 'mild' | 'cold' | 'rainy'
type Style = 'classic' | 'streetwear' | 'bold' | 'minimalist'
type Category = 'top' | 'bottoms' | 'headwear' | 'footwear' | 'accessories'

interface CaddieSearch {
  occasion?: Occasion
  weather?: Weather
  style?: Style
}

interface Product {
  id: string
  category: Category
  brand: string
  title: string
  price: number
  size: string
  image: string
  occasions: Occasion[]
  weathers: Weather[]
  styles: Style[]
  colors: string[]
}

// Mock product data
const mockProducts: Product[] = [
  // Tops
  { id: 't1', category: 'top', brand: 'Travis Mathew', title: 'Polo Shirt', price: 9500, size: 'M', image: '👕', occasions: ['casual', 'tournament'], weathers: ['mild', 'hot'], styles: ['classic'], colors: ['white', 'navy', 'green'] },
  { id: 't2', category: 'top', brand: 'Malbon', title: 'Knit Polo', price: 12000, size: 'M', image: '👕', occasions: ['casual', 'tournament'], weathers: ['mild', 'cold'], styles: ['streetwear'], colors: ['navy', 'black', 'grey'] },
  { id: 't3', category: 'top', brand: 'Nike', title: 'Dri-FIT Shirt', price: 6500, size: 'M', image: '👕', occasions: ['casual', 'practice'], weathers: ['hot'], styles: ['classic'], colors: ['white', 'black'] },
  { id: 't4', category: 'top', brand: 'Peter Millar', title: 'Quarter Zip', price: 16500, size: 'M', image: '👕', occasions: ['tournament', 'club_dinner'], weathers: ['cold', 'mild'], styles: ['classic'], colors: ['navy', 'grey', 'burgundy'] },
  { id: 't5', category: 'top', brand: 'NOCTA', title: 'Mock Neck', price: 11000, size: 'M', image: '👕', occasions: ['casual', 'practice'], weathers: ['cold', 'mild'], styles: ['streetwear'], colors: ['black', 'grey', 'white'] },

  // Bottoms
  { id: 'b1', category: 'bottoms', brand: 'Bonobos', title: 'Golf Pants', price: 12800, size: '32', image: '👖', occasions: ['tournament', 'club_dinner'], weathers: ['mild', 'cold'], styles: ['classic'], colors: ['navy', 'grey', 'khaki'] },
  { id: 'b2', category: 'bottoms', brand: 'Travis Mathew', title: 'Shorts', price: 8800, size: '32', image: '👖', occasions: ['casual', 'practice'], weathers: ['hot'], styles: ['classic'], colors: ['khaki', 'black', 'navy'] },
  { id: 'b3', category: 'bottoms', brand: 'Nike', title: 'Joggers', price: 9500, size: '32', image: '👖', occasions: ['casual', 'practice'], weathers: ['mild', 'hot'], styles: ['streetwear'], colors: ['black', 'grey', 'white'] },
  { id: 'b4', category: 'bottoms', brand: 'Peter Millar', title: 'Trousers', price: 19800, size: '32', image: '👖', occasions: ['tournament', 'club_dinner'], weathers: ['cold', 'mild'], styles: ['classic'], colors: ['navy', 'grey', 'charcoal'] },

  // Headwear
  { id: 'h1', category: 'headwear', brand: 'Malbon', title: 'Bucket Hat', price: 5800, size: 'One Size', image: '🧢', occasions: ['casual', 'practice'], weathers: ['hot', 'mild'], styles: ['streetwear'], colors: ['navy', 'black', 'white'] },
  { id: 'h2', category: 'headwear', brand: 'Titleist', title: 'Tour Hat', price: 3200, size: 'One Size', image: '🧢', occasions: ['casual', 'tournament', 'practice'], weathers: ['hot', 'mild'], styles: ['classic'], colors: ['navy', 'black', 'white'] },
  { id: 'h3', category: 'headwear', brand: 'Nike', title: 'Aerobill Cap', price: 2800, size: 'One Size', image: '🧢', occasions: ['casual', 'practice'], weathers: ['hot', 'mild'], styles: ['classic'], colors: ['black', 'white', 'red'] },
  { id: 'h4', category: 'headwear', brand: 'Good Good', title: 'Rope Hat', price: 3800, size: 'One Size', image: '🧢', occasions: ['casual'], weathers: ['hot', 'mild'], styles: ['bold'], colors: ['tan', 'navy', 'white'] },

  // Footwear
  { id: 'f1', category: 'footwear', brand: 'FootJoy', title: 'Premieres', price: 16500, size: '10', image: '👟', occasions: ['tournament', 'club_dinner'], weathers: ['mild', 'cold'], styles: ['classic'], colors: ['white', 'black'] },
  { id: 'f2', category: 'footwear', brand: 'Nike', title: 'Air Max 90 Golf', price: 14000, size: '10', image: '👟', occasions: ['casual', 'practice'], weathers: ['mild', 'hot'], styles: ['streetwear'], colors: ['white', 'black', 'grey'] },
  { id: 'f3', category: 'footwear', brand: 'Ecco', title: 'Biom Hybrid', price: 20000, size: '10', image: '👟', occasions: ['tournament'], weathers: ['cold', 'mild'], styles: ['classic'], colors: ['black', 'white'] },

  // Accessories
  { id: 'a1', category: 'accessories', brand: 'Asher', title: 'Golf Glove', price: 2800, size: 'M', image: '🧤', occasions: ['casual', 'tournament', 'practice'], weathers: ['cold', 'mild', 'hot'], styles: ['classic'], colors: ['white', 'tan'] },
  { id: 'a2', category: 'accessories', brand: 'Goodr', title: 'Sunglasses', price: 3500, size: 'One Size', image: '🕶️', occasions: ['casual', 'practice'], weathers: ['hot', 'mild'], styles: ['bold', 'streetwear'], colors: ['multicolor'] },
  { id: 'a3', category: 'accessories', brand: 'Wrong Club', title: 'Leather Belt', price: 5500, size: '32', image: '⌛', occasions: ['tournament', 'club_dinner'], weathers: ['cold', 'mild', 'hot'], styles: ['classic'], colors: ['brown', 'black'] },
]

const quickChips = [
  { emoji: '☀️', label: 'Hot weather round', query: 'Hot weather casual round' },
  { emoji: '🌧️', label: 'Rainy day gear', query: 'Rainy day golf outfit' },
  { emoji: '🏆', label: 'Tournament ready', query: 'Tournament look' },
  { emoji: '🍺', label: '19th hole casual', query: 'Casual 19th hole' },
]

const exampleOutfits = [
  {
    name: 'Desert Heat Essentials',
    subtitle: 'Phoenix, AZ • 95°F • Casual',
    items: [
      { emoji: '👕', brand: 'Walkers x Wrong Club', title: 'Shortbread Polo', price: 9500, image: '/images/walkers-polo.png' },
      { emoji: '👟', brand: 'FootJoy', title: 'DryJoys Premiere Field', price: 16500, image: '/images/footjoy.png' },
      { emoji: '🧢', brand: 'Good Good', title: 'Big Shot Rope Hat', price: 3800, image: '/images/good-hat.png' },
      { emoji: '👖', brand: 'Aguila', title: 'Performance Shorts', price: 8800, image: '/images/shorts.png' },
    ],
  },
  {
    name: 'Links Layer Up',
    subtitle: 'St Andrews, Scotland • 58°F • Classic',
    items: [
      { emoji: '👕', brand: 'Peter Millar', title: 'Quarter Zip', price: 16500, image: '/images/malbon.png' },
      { emoji: '👖', brand: 'Bonobos', title: 'Highland Golf Pants', price: 12800, image: '/images/shorts.png' },
      { emoji: '🧢', brand: 'Titleist', title: 'Tour Performance Cap', price: 3200, image: '/images/good-hat.png' },
      { emoji: '🧤', brand: 'Asher', title: 'Premium Golf Glove', price: 2800, image: '/images/footjoy.png' },
    ],
  },
]

function parseSearch(query: string): CaddieSearch {
  const search: CaddieSearch = {}

  if (query.toLowerCase().includes('tournament')) search.occasion = 'tournament'
  else if (query.toLowerCase().includes('dinner') || query.toLowerCase().includes('club')) search.occasion = 'club_dinner'
  else if (query.toLowerCase().includes('practice')) search.occasion = 'practice'
  else search.occasion = 'casual'

  if (query.toLowerCase().includes('hot') || query.toLowerCase().includes('warm')) search.weather = 'hot'
  else if (query.toLowerCase().includes('cold') || query.toLowerCase().includes('winter')) search.weather = 'cold'
  else if (query.toLowerCase().includes('rainy') || query.toLowerCase().includes('rain')) search.weather = 'rainy'
  else search.weather = 'mild'

  if (query.toLowerCase().includes('streetwear') || query.toLowerCase().includes('street')) search.style = 'streetwear'
  else if (query.toLowerCase().includes('bold') || query.toLowerCase().includes('colorful')) search.style = 'bold'
  else if (query.toLowerCase().includes('minimal') || query.toLowerCase().includes('minimalist')) search.style = 'minimalist'
  else search.style = 'classic'

  return search
}

function matchOutfit(criteria: CaddieSearch, productsPool: Product[]): Product[] {
  const outfit: Product[] = []
  const categories: Category[] = ['top', 'bottoms', 'headwear', Math.random() > 0.5 ? 'footwear' : 'accessories']

  for (const category of categories) {
    let candidates = productsPool.filter(p => p.category === category)

    if (criteria.occasion) {
      candidates = candidates.filter(p => p.occasions.includes(criteria.occasion!))
    }

    if (criteria.weather) {
      candidates = candidates.filter(p => p.weathers.includes(criteria.weather!))
    }

    if (criteria.style) {
      candidates = candidates.filter(p => p.styles.includes(criteria.style!))
    }

    candidates.sort((a, b) => a.price - b.price)
    const selected = candidates[Math.floor(Math.random() * candidates.length)] || candidates[0]

    if (selected) outfit.push(selected)
  }

  return outfit
}

function getOutfitName(query: string): string {
  if (query.toLowerCase().includes('hot')) return 'Desert Heat Essentials'
  if (query.toLowerCase().includes('rainy')) return 'All-Weather Protection'
  if (query.toLowerCase().includes('tournament')) return 'Tournament Ready'
  if (query.toLowerCase().includes('19th')) return 'Post-Round Casual'
  return 'Custom Outfit'
}

function formatPrice(cents: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100)
}

export default function CaddiePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [hasSearched, setHasSearched] = useState(false)
  const [outfit, setOutfit] = useState<Product[]>([])
  const [fourthSlot, setFourthSlot] = useState<'footwear' | 'accessories'>('footwear')

  const handleSearch = () => {
    if (!searchQuery.trim()) return
    const criteria = parseSearch(searchQuery)
    const matched = matchOutfit(criteria, mockProducts)
    setOutfit(matched)
    setHasSearched(true)
  }

  const handleQuickChip = (query: string) => {
    setSearchQuery(query)
    const criteria = parseSearch(query)
    const matched = matchOutfit(criteria, mockProducts)
    setOutfit(matched)
    setHasSearched(true)
  }

  const handleShuffle = (categoryToShuffle: Category) => {
    const candidates = mockProducts.filter(p => p.category === categoryToShuffle)
    if (candidates.length === 0) return

    const random = candidates[Math.floor(Math.random() * candidates.length)]
    setOutfit(outfit.map(item => (item.category === categoryToShuffle ? random : item)))
  }

  const handleSwapFourthSlot = () => {
    const newSlot = fourthSlot === 'footwear' ? 'accessories' : 'footwear'
    setFourthSlot(newSlot)

    const candidates = mockProducts.filter(p => p.category === newSlot)
    const random = candidates[Math.floor(Math.random() * candidates.length)]
    setOutfit(outfit.map((item, i) => (i === 3 ? random : item)))
  }

  const outfitTotal = useMemo(() => {
    return outfit.reduce((sum, item) => sum + item.price, 0)
  }, [outfit])

  const bundleDiscount = useMemo(() => {
    return Math.round(outfitTotal * 0.05)
  }, [outfitTotal])

  const finalPrice = outfitTotal - bundleDiscount

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <div className="pb-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Caddie Icon */}
          <div className="flex justify-center mb-6">
            <Image
              src="/images/caddie-ai.png"
              alt="Caddie AI"
              width={120}
              height={120}
            />
          </div>

          {/* Title */}
          <h1 className="text-5xl font-bold text-gray-900 mb-3">Caddie AI</h1>

          {/* Subtitle */}
          <p className="text-xl text-gray-600 mb-10">Tell me what you need and I'll build your perfect outfit</p>

          {/* Search Bar - Pill shaped */}
          <div className="flex items-center gap-3 bg-white rounded-full shadow-md p-2 mb-8">
            <input
              type="text"
              placeholder="e.g., Desert course in Phoenix, 95°F, casual vibe"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 px-6 py-3 bg-white rounded-full focus:outline-none text-gray-900"
            />
            <button
              onClick={handleSearch}
              className="px-8 py-3 bg-[#5f6651] text-white rounded-full font-semibold hover:bg-[#4a5040] transition-colors flex-shrink-0"
            >
              Build Outfit
            </button>
          </div>

          {/* Quick Suggestion Chips */}
          {!hasSearched && (
            <div className="flex flex-wrap justify-center gap-3">
              {quickChips.map((chip) => (
                <button
                  key={chip.label}
                  onClick={() => handleQuickChip(chip.query)}
                  className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-full hover:border-[#5f6651] hover:text-[#5f6651] transition-colors text-sm font-medium"
                >
                  {chip.emoji} {chip.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Popular Outfits Section - Show before search */}
      {!hasSearched && (
        <div className="w-full px-6 pb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Popular Outfits</h2>
            
            <div className="space-y-12">
              {exampleOutfits.map((exampleOutfit) => {
                const total = exampleOutfit.items.reduce((sum, item) => sum + item.price, 0)
                const discount = Math.round(total * 0.05)
                const finalPrice = total - discount

                return (
                  <div key={exampleOutfit.name} className="bg-white rounded-xl shadow-sm p-8">
                    {/* Header with name and price */}
                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                      <h3 className="text-xl font-bold text-gray-900">{exampleOutfit.name}</h3>
                      <div className="text-right">
                        <div className="text-4xl font-bold text-[#5f6651]">${(finalPrice / 100).toFixed(0)}</div>
                      </div>
                    </div>

                    {/* 4 Product cards in horizontal row */}
                    <div className="grid grid-cols-4 gap-4 mb-6">
                      {exampleOutfit.items.map((item, idx) => (
                        <div key={idx} className="bg-[#f5f5f5] rounded-lg p-4 text-center">
                          <div className="h-32 mb-3 flex items-center justify-center relative">
                            {item.image ? (
                              <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                className="object-contain p-2"
                              />
                            ) : (
                              <div className="text-5xl">{item.emoji}</div>
                            )}
                          </div>
                          <p className="text-xs font-semibold text-gray-600 uppercase mb-2">{item.brand}</p>
                          <p className="text-sm font-bold text-gray-900 mb-3 line-clamp-2">{item.title}</p>
                          <p className="text-lg font-bold text-[#5f6651]">${(item.price / 100).toFixed(0)}</p>
                        </div>
                      ))}
                    </div>

                    {/* Bundle discount */}
                    <div className="mb-4 text-sm">
                      <span className="text-gray-600">5% bundle discount: </span>
                      <span className="font-semibold text-gray-900">-${(discount / 100).toFixed(2)}</span>
                    </div>

                    {/* Add to Cart Button */}
                    <button className="w-full bg-[#5f6651] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#4a5040] transition-colors">
                      Add Outfit to Cart
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Results Section */}
      {hasSearched && outfit.length > 0 && (
        <div className="px-6 pb-12">
          <div className="max-w-7xl mx-auto">
            {/* Results Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              {/* Header Row */}
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">{getOutfitName(searchQuery)}</h2>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">Total</p>
                  <p className="text-4xl font-bold text-[#5f6651]">{formatPrice(outfitTotal)}</p>
                </div>
              </div>

              {/* Product Cards Grid */}
              <div className="grid grid-cols-4 gap-6 mb-8">
                {outfit.map((item, idx) => (
                  <div key={`${item.id}-${idx}`} className="bg-white">
                    {/* Image */}
                    <div className="bg-gray-100 h-40 flex items-center justify-center text-5xl rounded-xl mb-4">{item.image}</div>

                    {/* Details */}
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">{item.brand}</p>
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{item.title}</h3>
                    <p className="text-lg font-bold text-[#5f6651] mb-4">{formatPrice(item.price)}</p>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleShuffle(item.category)}
                        className="flex-1 px-3 py-2 border border-[#5f6651] text-[#5f6651] rounded-lg text-xs font-medium hover:bg-[#5f6651]/10 transition-colors"
                      >
                        🔀 Shuffle
                      </button>
                      {idx === 3 && (
                        <button
                          onClick={handleSwapFourthSlot}
                          className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors"
                        >
                          ⇄ Swap
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing Breakdown */}
              <div className="bg-gray-50 rounded-xl p-6 mb-8 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Outfit Total</span>
                  <span className="font-semibold text-gray-900">{formatPrice(outfitTotal)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Caddie Bundle (5%)</span>
                  <span className="font-semibold text-green-600">-{formatPrice(bundleDiscount)}</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                  <span className="font-bold text-gray-900">You Pay</span>
                  <span className="text-2xl font-bold text-[#5f6651]">{formatPrice(finalPrice)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-4">
                <button className="col-span-2 px-6 py-3 bg-[#5f6651] text-white rounded-xl font-semibold hover:bg-[#4a5040] transition-colors">
                  Add Outfit to Cart
                </button>
                <button className="px-6 py-3 border-2 border-[#5f6651] text-[#5f6651] rounded-xl font-semibold hover:bg-[#5f6651]/10 transition-colors">
                  💾 Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {hasSearched && outfit.length === 0 && (
        <div className="text-center py-20 px-6">
          <p className="text-gray-500 text-lg">No outfit found. Try a different search.</p>
        </div>
      )}
    </div>
  )
}
