'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Heart, Share2, X, ChevronLeft, ChevronRight, MessageCircle, ArrowLeft } from 'lucide-react'
import { useParams } from 'next/navigation'

interface ListingData {
  id: string
  img: string
  brand: string
  title: string
  price: number
  description: string
  size: string
  condition: string
  category: string
  gender: string
  color: string
  material?: string
  allowOffers: boolean
  seller: {
    name: string
    username: string
    rating: number
    sales: number
    tier: 'birdie' | 'eagle' | 'albatross' | 'hole_in_one'
  }
}

const tierEmojis = {
  birdie: '🐦',
  eagle: '🦅',
  albatross: '🪶',
  hole_in_one: '⭐',
}

const mockListings: ListingData[] = [
  {
    id: '1',
    img: '/images/walkers-varsity-jacket.png',
    brand: 'Walkers x Wrong Club',
    title: 'Varsity Jacket',
    price: 24500,
    description: 'Premium varsity jacket from the Walkers x Wrong Club collab. Perfect condition, minimal wear.',
    size: 'L',
    condition: 'Like New',
    category: 'tops',
    gender: 'mens',
    color: 'Navy/Cream',
    allowOffers: false,
    seller: {
      name: 'Wrong Club Official',
      username: 'wrongclub',
      rating: 5.0,
      sales: 1250,
      tier: 'hole_in_one',
    },
  },
  {
    id: '2',
    img: '/images/footjoy.png',
    brand: 'FootJoy',
    title: 'DryJoys Premiere Field',
    price: 16500,
    description: 'Professional-grade waterproof golf shoes. Worn a few times, excellent condition.',
    size: '10',
    condition: 'Good',
    category: 'footwear',
    gender: 'mens',
    color: 'White/Navy',
    allowOffers: true,
    seller: {
      name: 'Sarah M.',
      username: 'sarahm',
      rating: 4.9,
      sales: 47,
      tier: 'albatross',
    },
  },
  {
    id: '3',
    img: '/images/good-hat.png',
    brand: 'Good Good',
    title: 'Big Shot Rope Hat',
    price: 3800,
    description: 'Iconic Good Good rope cap from the YouTube crew. New with tags.',
    size: 'One Size',
    condition: 'New with Tags',
    category: 'headwear',
    gender: 'mens',
    color: 'Navy',
    allowOffers: true,
    seller: {
      name: 'Jack T.',
      username: 'jackt',
      rating: 4.7,
      sales: 12,
      tier: 'eagle',
    },
  },
  {
    id: '4',
    img: '/images/shorts.png',
    brand: 'Aguila',
    title: 'Performance Shorts',
    price: 8800,
    description: 'Lightweight performance shorts perfect for warm rounds. Clean condition.',
    size: 'M',
    condition: 'Good',
    category: 'bottoms',
    gender: 'mens',
    color: 'Black',
    allowOffers: true,
    seller: {
      name: 'Mike P.',
      username: 'mikep',
      rating: 4.8,
      sales: 23,
      tier: 'eagle',
    },
  },
  {
    id: '5',
    img: '/images/yeti-cooler.png',
    brand: 'YETI x Wrong Club',
    title: 'Roadie 24 Cooler',
    price: 27500,
    description: 'Rugged YETI cooler with Wrong Club branding. Limited edition release.',
    size: 'One Size',
    condition: 'New with Tags',
    category: 'bags',
    gender: 'mens',
    color: 'White',
    allowOffers: false,
    seller: {
      name: 'Wrong Club Official',
      username: 'wrongclub',
      rating: 5.0,
      sales: 1250,
      tier: 'hole_in_one',
    },
  },
  {
    id: '6',
    img: '/images/yeti-bottle.png',
    brand: 'YETI x Wrong Club',
    title: 'Rambler 26oz Bottle',
    price: 4500,
    description: 'Insulated water bottle from the Wrong Club collab. Keeps drinks cold for 24 hours.',
    size: 'One Size',
    condition: 'New with Tags',
    category: 'accessories',
    gender: 'mens',
    color: 'Navy',
    allowOffers: false,
    seller: {
      name: 'Wrong Club Official',
      username: 'wrongclub',
      rating: 5.0,
      sales: 1250,
      tier: 'hole_in_one',
    },
  },
  {
    id: '7',
    img: '/images/walkers-polo.png',
    brand: 'Walkers x Wrong Club',
    title: 'Shortbread Polo',
    price: 9500,
    description: 'Classic polo with Walkers branding. Perfect for casual rounds.',
    size: 'L',
    condition: 'Good',
    category: 'tops',
    gender: 'mens',
    color: 'Cream',
    allowOffers: true,
    seller: {
      name: 'Wrong Club Official',
      username: 'wrongclub',
      rating: 5.0,
      sales: 1250,
      tier: 'hole_in_one',
    },
  },
  {
    id: '8',
    img: '/images/yeti-bucket-hat.png',
    brand: 'YETI x Wrong Club',
    title: 'Toile Bucket Hat',
    price: 4800,
    description: 'Stylish bucket hat from YETI collaboration. Perfect for sun protection.',
    size: 'One Size',
    condition: 'Like New',
    category: 'headwear',
    gender: 'mens',
    color: 'Cream/Navy',
    allowOffers: false,
    seller: {
      name: 'Wrong Club Official',
      username: 'wrongclub',
      rating: 5.0,
      sales: 1250,
      tier: 'hole_in_one',
    },
  },
  {
    id: '9',
    img: '/images/malbon.png',
    brand: 'Malbon Golf',
    title: 'Script Bucket Hat',
    price: 5800,
    description: 'Malbon Golf bucket hat with embroidered script. Excellent condition.',
    size: 'One Size',
    condition: 'Like New',
    category: 'headwear',
    gender: 'womens',
    color: 'Navy',
    allowOffers: true,
    seller: {
      name: 'Rachel L.',
      username: 'rachell',
      rating: 4.9,
      sales: 52,
      tier: 'albatross',
    },
  },
  {
    id: '10',
    img: '/images/metalwood.png',
    brand: 'Metalwood Studio',
    title: 'Camo Sleeve Crewneck',
    price: 14500,
    description: 'Premium crewneck with camo sleeve detail. A versatile piece for any golfer.',
    size: 'L',
    condition: 'Like New',
    category: 'tops',
    gender: 'mens',
    color: 'Camo',
    allowOffers: true,
    seller: {
      name: 'Chris D.',
      username: 'chrisd',
      rating: 4.7,
      sales: 29,
      tier: 'eagle',
    },
  },
  {
    id: '11',
    img: '/images/red-snapper-tees.png',
    brand: 'Red Snapper',
    title: 'Golf Tees - Sardine Tin',
    price: 2500,
    description: 'Unique golf tee set in a sardine tin. Perfect gift for collectors.',
    size: 'One Size',
    condition: 'New with Tags',
    category: 'accessories',
    gender: 'mens',
    color: 'Mixed',
    allowOffers: true,
    seller: {
      name: 'Tom B.',
      username: 'tomb',
      rating: 4.8,
      sales: 19,
      tier: 'eagle',
    },
  },
  {
    id: '12',
    img: '/images/walkers-rain-jacket.png',
    brand: 'Walkers x Wrong Club',
    title: 'Rain Jacket',
    price: 29500,
    description: 'Premium waterproof rain jacket. Lightweight and packable for any round.',
    size: 'L',
    condition: 'New with Tags',
    category: 'tops',
    gender: 'mens',
    color: 'Navy',
    allowOffers: false,
    seller: {
      name: 'Wrong Club Official',
      username: 'wrongclub',
      rating: 5.0,
      sales: 1250,
      tier: 'hole_in_one',
    },
  },
  {
    id: '13',
    img: '/images/walkers-socks.png',
    brand: 'Walkers x Wrong Club',
    title: 'Merino Wool Shortbread Socks',
    price: 3000,
    description: 'Premium merino wool socks with Walkers branding. Comfortable for long rounds.',
    size: 'One Size',
    condition: 'New with Tags',
    category: 'accessories',
    gender: 'mens',
    color: 'Navy',
    allowOffers: false,
    seller: {
      name: 'Wrong Club Official',
      username: 'wrongclub',
      rating: 5.0,
      sales: 1250,
      tier: 'hole_in_one',
    },
  },
  {
    id: '14',
    img: '/images/walkers-golf-balls.png',
    brand: 'Walkers x Wrong Club',
    title: 'Shortbread Golf Balls (3-Pack)',
    price: 1500,
    description: 'Limited edition Shortbread-themed golf balls. Collectors item.',
    size: 'One Size',
    condition: 'New with Tags',
    category: 'accessories',
    gender: 'mens',
    color: 'White',
    allowOffers: true,
    seller: {
      name: 'Wrong Club Official',
      username: 'wrongclub',
      rating: 5.0,
      sales: 1250,
      tier: 'hole_in_one',
    },
  },
  {
    id: '15',
    img: '/images/walkers-trousers.png',
    brand: 'Walkers x Wrong Club',
    title: 'Golf Trousers - Cream',
    price: 7500,
    description: 'Classic cream golf trousers from Walkers collab. Perfect for tournament play.',
    size: '34',
    condition: 'Good',
    category: 'bottoms',
    gender: 'mens',
    color: 'Cream',
    allowOffers: true,
    seller: {
      name: 'Wrong Club Official',
      username: 'wrongclub',
      rating: 5.0,
      sales: 1250,
      tier: 'hole_in_one',
    },
  },
  {
    id: '16',
    img: '/images/fairway-fingers.png',
    brand: 'Walkers x Wrong Club',
    title: 'Fairway Fingers Shortbread',
    price: 500,
    description: 'Delicious Shortbread treats. A fun collaboration snack.',
    size: 'One Size',
    condition: 'New',
    category: 'accessories',
    gender: 'mens',
    color: 'Golden',
    allowOffers: false,
    seller: {
      name: 'Wrong Club Official',
      username: 'wrongclub',
      rating: 5.0,
      sales: 1250,
      tier: 'hole_in_one',
    },
  },
  {
    id: '17',
    img: '/images/vinamilk-tee.png',
    brand: 'Vinamilk x Wrong Club',
    title: 'Vinamilk x Wrong Club Tee',
    price: 8500,
    description: 'Exclusive t-shirt from the Vinamilk collaboration. Limited quantities.',
    size: 'L',
    condition: 'New with Tags',
    category: 'tops',
    gender: 'mens',
    color: 'White',
    allowOffers: true,
    seller: {
      name: 'Wrong Club Official',
      username: 'wrongclub',
      rating: 5.0,
      sales: 1250,
      tier: 'hole_in_one',
    },
  },
  {
    id: '18',
    img: '/images/vinamilk-longsleeve.png',
    brand: 'Vinamilk x Wrong Club',
    title: 'Vinamilk x Wrong Club Long Sleeve',
    price: 9500,
    description: 'Premium long sleeve from Vinamilk partnership. Comfortable everyday wear.',
    size: 'L',
    condition: 'New with Tags',
    category: 'tops',
    gender: 'mens',
    color: 'Navy',
    allowOffers: true,
    seller: {
      name: 'Wrong Club Official',
      username: 'wrongclub',
      rating: 5.0,
      sales: 1250,
      tier: 'hole_in_one',
    },
  },
  {
    id: '19',
    img: '/images/vinamilk-trousers.png',
    brand: 'Vinamilk x Wrong Club',
    title: 'Vinamilk x Wrong Club Trousers',
    price: 12000,
    description: 'Exclusive trousers from the Vinamilk collection. Limited edition.',
    size: '34',
    condition: 'New with Tags',
    category: 'bottoms',
    gender: 'mens',
    color: 'Navy',
    allowOffers: false,
    seller: {
      name: 'Wrong Club Official',
      username: 'wrongclub',
      rating: 5.0,
      sales: 1250,
      tier: 'hole_in_one',
    },
  },
  {
    id: '20',
    img: '/images/vinamilk-gilet.png',
    brand: 'Vinamilk x Wrong Club',
    title: 'The Milkman Gilet',
    price: 11000,
    description: 'Lightweight gilet from the Vinamilk collab. Perfect layering piece.',
    size: 'L',
    condition: 'New with Tags',
    category: 'tops',
    gender: 'mens',
    color: 'White',
    allowOffers: false,
    seller: {
      name: 'Wrong Club Official',
      username: 'wrongclub',
      rating: 5.0,
      sales: 1250,
      tier: 'hole_in_one',
    },
  },
  {
    id: '21',
    img: '/images/vinamilk-candle.png',
    brand: 'Vinamilk x Wrong Club',
    title: 'The Vanillamilk Candle',
    price: 1000,
    description: 'Scented candle from the Vinamilk partnership. A unique collectible.',
    size: 'One Size',
    condition: 'New with Tags',
    category: 'accessories',
    gender: 'mens',
    color: 'Cream',
    allowOffers: true,
    seller: {
      name: 'Wrong Club Official',
      username: 'wrongclub',
      rating: 5.0,
      sales: 1250,
      tier: 'hole_in_one',
    },
  },
]

function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100)
}

function GolfBallRating({ rating }: { rating: number }) {
  const balls = Math.floor(rating)
  return (
    <div className="flex items-center gap-0.5">
      {Array(5)
        .fill(0)
        .map((_, i) => (
          <span key={i} className="text-sm">
            {i < balls ? '⛳' : '⚪'}
          </span>
        ))}
      <span className="text-sm font-medium text-gray-700 ml-2">{rating}</span>
    </div>
  )
}

export default function ListingPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [selectedImage, setSelectedImage] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [saved, setSaved] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [zipCode, setZipCode] = useState('')
  const [shippingCalculated, setShippingCalculated] = useState(false)

  const listing = mockListings.find((l) => l.id === id) || mockListings[0]
  const images = [listing.img, listing.img, listing.img, listing.img, listing.img]
  const sellerListings = mockListings.filter((l) => l.seller.username === listing.seller.username && l.id !== listing.id)
  const similarListings = mockListings.filter((l) => l.category === listing.category && l.id !== listing.id)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleAddToCart = () => {
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const calculateShipping = () => {
    if (zipCode.length >= 5) {
      setShippingCalculated(true)
    }
  }

  return (
    <div className="pb-24">
      {/* Close Button */}
      <button
        onClick={() => router.back()}
        className="fixed top-24 right-4 md:right-6 z-40 p-2 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Go back"
      >
        <ArrowLeft className="w-6 h-6 text-[#5f6651] scale-[1.015]" />
      </button>

      {/* Breadcrumb */}
      <div className="px-4 md:px-6 pb-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/browse" className="hover:text-[#5f6651] transition-colors">
            Browse
          </Link>
          <span>/</span>
          <span className="capitalize">{listing.category}</span>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate">{listing.title}</span>
        </div>
      </div>

      {/* Product content area */}
      <div className="px-4 md:px-6 py-8">
        {/* Two Column Layout */}
        <div className="grid md:grid-cols-[45%_55%] lg:grid-cols-[40%_60%] gap-8 md:gap-12 mb-12 max-w-6xl mx-auto">
          {/* Left Column - Images */}
          <div>
            {/* Main Image */}
            <div
              onClick={() => setLightboxOpen(true)}
              className="aspect-square max-h-[450px] bg-gray-100 rounded-2xl overflow-hidden cursor-zoom-in mb-4 group flex items-center justify-center text-6xl"
            >
              <img src={listing.img} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
            </div>

            {/* Thumbnail Strip */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === idx ? 'border-[#5f6651]' : 'border-gray-200'
                  }`}
                >
                  <img src={img} alt={`${listing.title} ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Product Info */}
          <div>
            {/* Brand & Title */}
            <p className="text-sm text-gray-500 uppercase tracking-wider font-medium">{listing.brand}</p>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">{listing.title}</h1>

            {/* Price */}
            <p className="text-3xl md:text-4xl font-bold text-[#5f6651] mt-6">{formatPrice(listing.price)}</p>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="px-3 py-1.5 bg-gray-100 rounded-full text-sm font-medium">{listing.condition}</span>
              <span className="px-3 py-1.5 bg-gray-100 rounded-full text-sm font-medium">Size: {listing.size}</span>
              <span className="px-3 py-1.5 bg-gray-100 rounded-full text-sm font-medium capitalize">{listing.gender}</span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 mt-6">
              {/* Check if it's a Wrong Club branded product */}
              {listing.brand.toLowerCase().includes('wrong club') ? (
                /* Wrong Club products: Add to Cart and Buy Now side by side */
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleAddToCart}
                    className="py-3 bg-[#5f6651] text-white rounded-full font-medium hover:bg-[#4a5040] transition-colors"
                  >
                    {addedToCart ? '✓ Added' : 'Add to Cart'}
                  </button>
                  <button className="py-3 border-2 border-[#5f6651] text-[#5f6651] rounded-full font-medium hover:bg-[#5f6651] hover:text-white transition-colors">
                    Buy Now
                  </button>
                </div>
              ) : (
                /* User listings: Full width Add to Cart, conditional Make Offer */
                <>
                  <button
                    onClick={handleAddToCart}
                    className="w-full py-3 bg-[#5f6651] text-white rounded-full font-medium hover:bg-[#4a5040] transition-colors"
                  >
                    {addedToCart ? '✓ Added to Cart' : 'Add to Cart'}
                  </button>

                  {/* Make Offer - only shown if seller enabled it */}
                  {listing.allowOffers && (
                    <button className="w-full py-3 border-2 border-[#5f6651] text-[#5f6651] rounded-full font-medium hover:bg-[#5f6651] hover:text-white transition-colors">
                      Make Offer
                    </button>
                  )}
                </>
              )}

              {/* Save & Share - smaller */}
              <div className="flex gap-2">
                <button
                  onClick={() => setSaved(!saved)}
                  className={`flex-1 py-2 border rounded-full text-sm font-medium flex items-center justify-center gap-1.5 transition-colors ${
                    saved ? 'bg-[#5f6651] text-white border-[#5f6651]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
                  Save
                </button>
                <button className="flex-1 py-2 border border-gray-200 rounded-full text-sm text-gray-600 font-medium hover:bg-gray-50 flex items-center justify-center gap-1.5 transition-colors">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>

            {/* Seller Card */}
            <div className="p-4 bg-gray-50 rounded-xl mt-6">
              <div className="flex items-start gap-4 mb-4">
                {/* Avatar */}
                <Link href={`/course/${listing.seller.username}`} className="flex-shrink-0">
                  <div className="w-14 h-14 bg-[#5f6651] text-white rounded-full flex items-center justify-center font-bold text-xl hover:bg-[#4a5040] transition-colors">
                    {listing.seller.name.charAt(0)}
                  </div>
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/course/${listing.seller.username}`}
                    className="font-semibold text-gray-900 hover:text-[#5f6651] hover:underline"
                  >
                    {listing.seller.name}
                  </Link>
                  <div className="mt-1">
                    <GolfBallRating rating={listing.seller.rating} />
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                    <span>{listing.seller.sales} sales</span>
                    <span>•</span>
                    <span>
                      {tierEmojis[listing.seller.tier]} {listing.seller.tier}
                    </span>
                  </div>
                </div>
              </div>

              {/* Seller Actions */}
              <div className="flex gap-2">
                <button className="flex-1 py-2.5 bg-white border border-gray-200 rounded-full text-sm font-medium text-center hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Message
                </button>
                <Link
                  href={`/course/${listing.seller.username}`}
                  className="flex-1 py-2.5 bg-white border border-gray-200 rounded-full text-sm font-medium text-center hover:bg-gray-100 transition-colors"
                >
                  View Shop
                </Link>
              </div>
            </div>

            {/* Shipping Estimate */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-3">Shipping</h3>
              
              {/* Delivery address input */}
              <div className="mb-4">
                <label className="text-sm text-gray-500 mb-1 block">Deliver to</label>
                <div className="flex gap-2">
                  <input 
                    type="text"
                    placeholder="Enter ZIP code"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5f6651] focus:border-transparent"
                  />
                  <button 
                    onClick={calculateShipping}
                    className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200"
                  >
                    Calculate
                  </button>
                </div>
              </div>
              
              {/* Shipping options - show after ZIP entered */}
              {shippingCalculated && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span>📦</span>
                      <div>
                        <p className="text-sm font-medium">Standard</p>
                        <p className="text-xs text-gray-500">5-7 business days</p>
                      </div>
                    </div>
                    <p className="font-medium">{listing.price >= 10000 ? 'FREE' : '$5.95'}</p>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span>🚀</span>
                      <div>
                        <p className="text-sm font-medium">Express</p>
                        <p className="text-xs text-gray-500">2-3 business days</p>
                      </div>
                    </div>
                    <p className="font-medium">$12.95</p>
                  </div>
                  
                  {listing.price >= 10000 && (
                    <p className="text-sm text-[#5f6651] font-medium">
                      🎉 This item qualifies for free standard shipping!
                    </p>
                  )}
                </div>
              )}
              
              {/* Before ZIP entered */}
              {!shippingCalculated && (
                <p className="text-sm text-gray-500">
                  Enter your ZIP code to see shipping options
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* You May Also Like - moved up */}
      {isMounted && similarListings.length > 0 && (
        <div className="max-w-6xl mx-auto py-8 border-t border-gray-100 px-4 md:px-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">You May Also Like</h2>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {similarListings.slice(0, 5).map((item) => (
              <Link key={item.id} href={`/listing/${item.id}`} className="group">
                <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-3 flex items-center justify-center">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <p className="text-xs text-gray-500 uppercase font-medium">{item.brand}</p>
                <p className="text-sm font-medium text-gray-900 truncate mt-1">{item.title}</p>
                <p className="font-bold text-[#5f6651] mt-1">{formatPrice(item.price)}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* More From Seller */}
      {isMounted && sellerListings.length > 0 && (
        <div className="max-w-6xl mx-auto py-8 border-t border-gray-100 px-4 md:px-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">More from @{listing.seller.username}</h2>
            <Link href={`/course/${listing.seller.username}`} className="text-[#5f6651] font-medium hover:underline">
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {sellerListings.slice(0, 5).map((item) => (
              <Link key={item.id} href={`/listing/${item.id}`} className="group">
                <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-3 flex items-center justify-center">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <p className="font-bold text-[#5f6651]">{formatPrice(item.price)}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Description & Details - moved down */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 py-8 border-t border-gray-100 px-4 md:px-6">
        {/* Description */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Description</h3>
          <p className="text-gray-600 leading-relaxed whitespace-pre-wrap text-sm">{listing.description}</p>
        </div>

        {/* Details Table */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Details</h3>
          <dl className="space-y-0">
            <div className="flex justify-between py-3 border-b border-gray-100">
              <dt className="text-gray-500 text-sm">Brand</dt>
              <dd className="font-medium text-gray-900">{listing.brand}</dd>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-100">
              <dt className="text-gray-500 text-sm">Category</dt>
              <dd className="font-medium text-gray-900 capitalize">{listing.category}</dd>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-100">
              <dt className="text-gray-500 text-sm">Size</dt>
              <dd className="font-medium text-gray-900">{listing.size}</dd>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-100">
              <dt className="text-gray-500 text-sm">Condition</dt>
              <dd className="font-medium text-gray-900">{listing.condition}</dd>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-100">
              <dt className="text-gray-500 text-sm">Color</dt>
              <dd className="font-medium text-gray-900">{listing.color}</dd>
            </div>
            {listing.material && (
              <div className="flex justify-between py-3">
                <dt className="text-gray-500 text-sm">Material</dt>
                <dd className="font-medium text-gray-900">{listing.material}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      {/* Buyer Protection */}
      <div className="max-w-6xl mx-auto py-8 border-t border-gray-100 px-4 md:px-6">
        <h3 className="font-semibold text-gray-900 mb-4">Buyer Protection</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="text-[#5f6651] font-bold">✓</span>
            <p className="text-gray-700 text-sm">Money-back guarantee</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-[#5f6651] font-bold">✓</span>
            <p className="text-gray-700 text-sm">Secure payments via Stripe</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-[#5f6651] font-bold">✓</span>
            <p className="text-gray-700 text-sm">Item as described or your money back</p>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:hidden z-40">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <p className="text-2xl font-bold text-[#5f6651]">{formatPrice(listing.price)}</p>
          </div>
          <button
            onClick={handleAddToCart}
            className="flex-1 py-3 bg-[#5f6651] text-white rounded-full font-semibold hover:bg-[#4a5040] transition-colors"
          >
            {addedToCart ? '✓ Added' : 'Add to Cart'}
          </button>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setLightboxOpen(false)}>
          {/* Close button */}
          <button
            className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full transition-colors z-10"
            onClick={() => setLightboxOpen(false)}
          >
            <X className="w-8 h-8" />
          </button>

          {/* Left arrow */}
          <button
            className="absolute left-4 text-white p-2 hover:bg-white/10 rounded-full transition-colors z-10"
            onClick={(e) => {
              e.stopPropagation()
              setSelectedImage((prev) => (prev > 0 ? prev - 1 : images.length - 1))
            }}
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          {/* Main image */}
          <img
            src={images[selectedImage]}
            alt={listing.title}
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Right arrow */}
          <button
            className="absolute right-4 text-white p-2 hover:bg-white/10 rounded-full transition-colors z-10"
            onClick={(e) => {
              e.stopPropagation()
              setSelectedImage((prev) => (prev < images.length - 1 ? prev + 1 : 0))
            }}
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          {/* Image counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/40 px-3 py-1 rounded-full">
            {selectedImage + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  )
}
