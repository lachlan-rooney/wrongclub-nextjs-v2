'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Heart, Share2, X, ChevronLeft, ChevronRight, MessageCircle, ArrowLeft, Shield, Truck, Check } from 'lucide-react'
import { useParams } from 'next/navigation'
import { ImageCarousel } from '@/components/ImageCarousel'
import { BuyBar } from '@/components/BuyBar'

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

const tierLabels = {
  birdie: 'Birdie',
  eagle: 'Eagle',
  albatross: 'Albatross',
  hole_in_one: 'Official',
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
  const [saved, setSaved] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  const listing = mockListings.find((l) => l.id === id) || mockListings[0]
  const images = [listing.img, listing.img, listing.img, listing.img, listing.img]
  const similarListings = mockListings.filter((l) => l.category === listing.category && l.id !== listing.id)
  const isCollab = listing.brand.includes(' x ')

  useEffect(() => {
    setIsMounted(true)
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="bg-white">
      {/* Detail Nav - becomes frosted glass on scroll */}
      <nav
        className="sticky top-0 z-30 transition-all duration-300"
        style={{
          backgroundColor:
            scrollY > 20
              ? 'rgba(250, 249, 246, 0.95)'
              : 'rgba(255, 255, 255, 0)',
          backdropFilter: scrollY > 20 ? 'blur(20px)' : 'none',
        }}
      >
        <div className="px-4 py-3 flex items-center justify-between">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center transition-all hover:bg-white active:scale-95"
          >
            <ArrowLeft size={20} className="text-[var(--charcoal)]" />
          </button>

          {/* Share & Heart */}
          <div className="flex items-center gap-2">
            <button className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center transition-all hover:bg-white active:scale-95">
              <Share2 size={20} className="text-[var(--charcoal)]" />
            </button>
            <button
              onClick={() => setSaved(!saved)}
              className={`flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full backdrop-blur flex items-center justify-center transition-all active:scale-95 ${
                saved
                  ? 'bg-[var(--brand)]'
                  : 'bg-white/90 hover:bg-white'
              }`}
            >
              <Heart
                size={20}
                className={saved ? 'text-white fill-current' : 'text-[var(--charcoal)]'}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE LAYOUT - only shows below md breakpoint */}
      <div className="md:hidden pb-28">
        {/* Image Carousel */}
        <ImageCarousel images={images} alt={listing.title} />

        {/* Product Info */}
        <div className="px-4 sm:px-6 py-5">
        {/* Brand + Collab Badge */}
        <div className="flex items-center gap-2 mb-2">
          <p className="text-xs uppercase font-medium text-[var(--brand)]" style={{ letterSpacing: '0.8px' }}>
            {listing.brand}
          </p>
          {isCollab && (
            <span className="px-2 py-1 bg-[var(--brand)] text-white text-xs font-medium rounded-full">
              COLLAB
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-xl font-bold text-[var(--charcoal)] mb-3 line-clamp-2">
          {listing.title}
        </h1>

        {/* Price */}
        <p className="text-2xl font-bold text-[var(--brand)] mb-4">
          {formatPrice(listing.price)}
        </p>

        {/* Spec Tags */}
        <div className="flex flex-wrap gap-2 mb-5">
          <span className="px-3 py-1 bg-[var(--sand-light)] text-xs font-medium rounded-full text-[var(--charcoal)]">
            {listing.category}
          </span>
          <span className="px-3 py-1 bg-[var(--sand-light)] text-xs font-medium rounded-full text-[var(--charcoal)]">
            {listing.condition}
          </span>
          <span className="px-3 py-1 bg-[var(--sand-light)] text-xs font-medium rounded-full text-[var(--charcoal)]">
            Size: {listing.size}
          </span>
        </div>

        {/* Seller Card */}
        <div className="border border-[var(--border)] rounded-lg p-4 mb-5">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-12 h-12 bg-[var(--brand)] text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
              {listing.seller.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-[var(--charcoal)]">{listing.seller.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex gap-0.5">
                  {Array(Math.floor(listing.seller.rating))
                    .fill(0)
                    .map((_, i) => (
                      <span key={i} className="text-xs">
                        ⛳
                      </span>
                    ))}
                </div>
                <span className="text-xs text-[var(--slate)]">
                  {listing.seller.rating}
                </span>
              </div>
              <p className="text-xs text-[var(--slate)] mt-1">
                {listing.seller.sales} sales • {tierLabels[listing.seller.tier]}
              </p>
            </div>
          </div>
          <button className="w-full py-2 border border-[var(--border)] text-sm font-medium rounded-lg text-[var(--charcoal)] transition-all active:scale-95 hover:bg-[var(--sand-light)]">
            Message Seller
          </button>
        </div>

        {/* Trust Signals - 2x2 Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="border border-[var(--border)] rounded-lg p-3 text-center">
            <Shield size={20} className="text-[var(--brand)] mx-auto mb-1" />
            <p className="text-xs font-medium text-[var(--charcoal)]">Buyer Protection</p>
          </div>
          <div className="border border-[var(--border)] rounded-lg p-3 text-center">
            <Truck size={20} className="text-[var(--brand)] mx-auto mb-1" />
            <p className="text-xs font-medium text-[var(--charcoal)]">Tracked Shipping</p>
          </div>
          <div className="border border-[var(--border)] rounded-lg p-3 text-center">
            <Check size={20} className="text-[var(--brand)] mx-auto mb-1" />
            <p className="text-xs font-medium text-[var(--charcoal)]">Verified Seller</p>
          </div>
          <div className="border border-[var(--border)] rounded-lg p-3 text-center">
            <MessageCircle size={20} className="text-[var(--brand)] mx-auto mb-1" />
            <p className="text-xs font-medium text-[var(--charcoal)]">Ask Questions</p>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h3 className="font-medium text-[var(--charcoal)] mb-2">Description</h3>
          <p className="text-sm text-[var(--slate)] leading-relaxed">
            {listing.description}
          </p>
        </div>

        {/* Details */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between py-2 border-b border-[var(--border)]">
            <span className="text-xs text-[var(--slate)]">Brand</span>
            <span className="text-xs font-medium text-[var(--charcoal)]">
              {listing.brand}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-[var(--border)]">
            <span className="text-xs text-[var(--slate)]">Color</span>
            <span className="text-xs font-medium text-[var(--charcoal)]">
              {listing.color}
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-xs text-[var(--slate)]">Gender</span>
            <span className="text-xs font-medium text-[var(--charcoal)] capitalize">
              {listing.gender}
            </span>
          </div>
        </div>

        {/* Similar Items */}
        {similarListings.length > 0 && (
          <div>
            <h2 className="font-medium text-[var(--charcoal)] mb-3">Similar Items</h2>
            <div className="grid grid-cols-2 gap-3">
              {similarListings.slice(0, 4).map((item) => (
                <Link
                  key={item.id}
                  href={`/listing/${item.id}`}
                  className="border border-[var(--border)] rounded-lg overflow-hidden active:scale-95 transition-transform"
                >
                  <div className="aspect-square bg-[var(--sand-light)] flex items-center justify-center">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                  <div className="p-2">
                    <p className="text-xs text-[var(--slate)] line-clamp-1">
                      {item.brand}
                    </p>
                    <p className="font-bold text-[var(--brand)] text-xs mt-1">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* BuyBar - Mobile only */}
      <div className="lg:hidden">
        <BuyBar price={listing.price} productId={listing.id} />
      </div>
    </div>

    {/* DESKTOP LAYOUT - only shows at md and above */}
    <div className="hidden md:block bg-white py-8 px-6">
      <main className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 gap-12">
          {/* Left: Images */}
          <div>
            <div className="aspect-square bg-[var(--sand-light)] rounded-2xl overflow-hidden mb-4 flex items-center justify-center">
              <img 
                src={listing.img} 
                alt={listing.title}
                className="w-full h-full object-contain p-4"
              />
            </div>
            
            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-3">
              {images.map((img, i) => (
                <div
                  key={i}
                  className="aspect-square bg-[var(--sand-light)] rounded-xl overflow-hidden cursor-pointer ring-2 ring-[var(--brand)]"
                >
                  <img src={img} alt="" className="w-full h-full object-contain p-2" />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Details */}
          <div>
            {/* Brand */}
            <p className="text-sm text-[var(--slate)] uppercase tracking-wide">{listing.brand}</p>
            
            {/* Title */}
            <h1 className="text-3xl font-bold text-[var(--charcoal)] mt-2">{listing.title}</h1>
            
            {/* Price */}
            <p className="text-4xl font-bold text-[var(--brand)] mt-4">{formatPrice(listing.price)}</p>
            
            {/* Condition & Size */}
            <div className="flex items-center gap-4 mt-6">
              <div className="px-4 py-2 bg-[var(--sand-light)] rounded-full">
                <span className="text-sm font-medium">{listing.condition}</span>
              </div>
              <div className="px-4 py-2 bg-[var(--sand-light)] rounded-full">
                <span className="text-sm font-medium">Size: {listing.size}</span>
              </div>
            </div>

            {/* Description */}
            <div className="mt-8">
              <h3 className="font-semibold text-[var(--charcoal)] mb-2">Description</h3>
              <p className="text-[var(--slate)] leading-relaxed">{listing.description}</p>
            </div>

            {/* Seller info */}
            <div className="mt-8 p-4 bg-[var(--sand-light)] rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[var(--brand)] text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {listing.seller.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--charcoal)]">{listing.seller.name}</p>
                    <p className="text-sm text-[var(--slate)]">{listing.seller.sales} sales</p>
                  </div>
                </div>
                <GolfBallRating rating={listing.seller.rating} />
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 space-y-3">
              <button
                className="w-full py-4 rounded-full font-semibold text-lg bg-[var(--brand)] text-white hover:bg-[#4a5040] transition-all"
              >
                Add to Cart
              </button>
              
              <button className="w-full py-4 rounded-full font-semibold text-lg border-2 border-[var(--brand)] text-[var(--brand)] hover:bg-[var(--brand)] hover:text-white transition-all">
                Make an Offer
              </button>
            </div>

            {/* Shipping info */}
            <div className="mt-8 pt-6 border-t border-[var(--border)]">
              <div className="flex items-center gap-3 text-[var(--slate)]">
                <span>📦</span>
                <span>Free shipping on orders over $100</span>
              </div>
              <div className="flex items-center gap-3 text-[var(--slate)] mt-2">
                <span>🛡️</span>
                <span>Buyer protection on all purchases</span>
              </div>
            </div>
          </div>
        </div>

        {/* More from seller - desktop */}
        {similarListings.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-[var(--charcoal)] mb-6">More from this seller</h2>
            <div className="grid grid-cols-5 gap-4">
              {similarListings.slice(0, 5).map((item) => (
                <Link
                  key={item.id}
                  href={`/listing/${item.id}`}
                  className="group block bg-white rounded-2xl overflow-hidden border border-[var(--border)] hover:shadow-lg transition-all"
                >
                  <div className="aspect-square bg-[var(--sand-light)] flex items-center justify-center">
                    <img src={item.img} alt={item.title} className="w-full h-full object-contain p-2" />
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-[var(--slate)] uppercase">{item.brand}</p>
                    <h3 className="font-medium text-[var(--charcoal)] text-sm mt-1 line-clamp-1">{item.title}</h3>
                    <p className="text-base font-bold text-[var(--brand)] mt-1">{formatPrice(item.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  </div>
  )
}
