'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase-client'
import { FitBadge } from '@/components'
import { 
  Heart, Share2, MessageCircle, ShoppingBag, 
  ChevronLeft, ChevronRight, Shield, Truck, AlertTriangle 
} from 'lucide-react'
import { getFitRecommendation } from '@/lib/sizing'

interface ListingWithRelations {
  id: string
  seller_id: string
  title: string
  description: string | null
  brand: string | null
  category: string
  gender: string
  size: string
  color: string | null
  condition: string
  price_cents: number
  shipping_price_cents: number
  status: string
  fit_scale: number
  is_one_size: boolean
  views: number
  saves: number
  created_at: string
  updated_at: string
  seller?: {
    id: string
    username: string
    display_name: string
    avatar_url: string | null
    tier_seller: string
    handicap_seller: number
  }
  images?: Array<{
    id: string
    url: string
    display_order: number
  }>
}

interface FitRecommendationType {
  type: 'perfect' | 'close' | 'too_small' | 'too_large' | null
  message: string
  icon: string
}

export default function ListingDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { profile, isAuthenticated } = useAuth()

  const [listing, setListing] = useState<ListingWithRelations | null>(null)
  const [images, setImages] = useState<Array<{ id: string; url: string; display_order: number }>>([])
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaved, setIsSaved] = useState(false)
  const [showSizeWarning, setShowSizeWarning] = useState(false)

  // Fetch listing data
  useEffect(() => {
    const fetchListing = async () => {
      if (!id) return

      const supabase = createClient()

      // Fetch listing with seller and images
      const { data, error } = await supabase
        .from('listings')
        .select(
          `
          *,
          seller:profiles!seller_id(id, username, display_name, avatar_url, tier_seller, handicap_seller),
          images:listing_images(id, url, display_order)
        `
        )
        .eq('id', id as string)
        .single()

      if (error || !data) {
        console.error('Error fetching listing:', error)
        setIsLoading(false)
        return
      }

      setListing(data)
      const sortedImages = (data.images || []).sort(
        (a: any, b: any) => a.display_order - b.display_order
      )
      setImages(sortedImages)

      // Check if user has saved this listing
      if (profile) {
        const { data: favorite } = await supabase
          .from('favorites')
          .select('id')
          .eq('user_id', profile.id)
          .eq('listing_id', id as string)
          .maybeSingle()

        setIsSaved(!!favorite)
      }

      // Increment view count
      await supabase
        .from('listings')
        .update({ views: data.views + 1 })
        .eq('id', id as string)

      setIsLoading(false)
    }

    if (id) {
      fetchListing()
    }
  }, [id, profile])

  // Get user's relevant size for this category
  const getUserSizeForCategory = (): string | null => {
    if (!profile || !listing) return null

    switch (listing.category) {
      case 'tops':
      case 'outerwear':
        return profile.size_tops || null
      case 'bottoms':
        return profile.size_bottoms_waist || null
      case 'footwear':
        return profile.size_footwear || null
      case 'headwear':
        return profile.size_headwear || null
      default:
        return null
    }
  }

  // Get fit recommendation
  const getFitAdvice = (): FitRecommendationType => {
    if (!listing || listing.is_one_size) {
      return { type: null, message: '', icon: '' }
    }

    const userSize = getUserSizeForCategory()
    if (!userSize) {
      return { type: null, message: '', icon: '' }
    }

    const recommendation = getFitRecommendation(
      userSize,
      listing.size,
      listing.fit_scale,
      listing.category as any
    )

    if (recommendation.includes('perfectly')) {
      return { type: 'perfect', message: recommendation, icon: '✅' }
    } else if (recommendation.includes('snug') || recommendation.includes('loose')) {
      return { type: 'close', message: recommendation, icon: '👍' }
    } else if (recommendation.includes('too small')) {
      return { type: 'too_small', message: recommendation, icon: '⚠️' }
    } else if (recommendation.includes('too large')) {
      return { type: 'too_large', message: recommendation, icon: '⚠️' }
    }

    return { type: 'close', message: recommendation, icon: '👍' }
  }

  const fitAdvice = getFitAdvice()

  // Handle save/unsave
  const handleToggleSave = async () => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    const supabase = createClient()

    if (isSaved) {
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', profile!.id)
        .eq('listing_id', id as string)
      setIsSaved(false)
    } else {
      await supabase.from('favorites').insert({ user_id: profile!.id, listing_id: id as string })
      setIsSaved(true)
    }
  }

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    // Check if size might not fit and warn user
    if (fitAdvice.type === 'too_small' || fitAdvice.type === 'too_large') {
      setShowSizeWarning(true)
      return
    }

    await addToCart()
  }

  const addToCart = async () => {
    const supabase = createClient()

    // Check if already in cart
    const { data: existing } = await supabase
      .from('cart_items')
      .select('id')
      .eq('user_id', profile!.id)
      .eq('listing_id', id as string)
      .maybeSingle()

    if (!existing) {
      await supabase
        .from('cart_items')
        .insert({ user_id: profile!.id, listing_id: id as string })
    }

    setShowSizeWarning(false)
    router.push('/cart')
  }

  // Handle buy now
  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    await addToCart()
    router.push('/checkout')
  }

  // Handle message seller
  const handleMessageSeller = async () => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    if (!listing?.seller) return

    const supabase = createClient()

    // Check for existing conversation
    const { data: existing } = await supabase
      .from('conversations')
      .select('id')
      .or(
        `and(user1_id.eq.${profile!.id},user2_id.eq.${listing.seller.id}),and(user1_id.eq.${listing.seller.id},user2_id.eq.${profile!.id})`
      )
      .maybeSingle()

    if (existing) {
      router.push(`/messages/${existing.id}`)
    } else {
      // Create new conversation
      const { data: newConvo } = await supabase
        .from('conversations')
        .insert({
          user1_id: profile!.id,
          user2_id: listing.seller.id,
          listing_id: id as string,
        })
        .select('id')
        .single()

      if (newConvo) {
        router.push(`/messages/${newConvo.id}`)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5f6651]"></div>
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-4">Listing not found</p>
          <button
            onClick={() => router.push('/browse')}
            className="text-[#5f6651] hover:underline font-medium"
          >
            Browse other listings →
          </button>
        </div>
      </div>
    )
  }

  const conditionLabels: Record<string, string> = {
    new_with_tags: 'New with Tags',
    new_without_tags: 'New without Tags',
    excellent: 'Excellent',
    good: 'Good',
    fair: 'Fair',
  }

  const getTierDisplay = (tier: string | undefined) => {
    switch (tier) {
      case 'hole_in_one':
        return { emoji: '🏌️', name: 'Hole-in-One' }
      case 'albatross':
        return { emoji: '🦢', name: 'Albatross' }
      case 'eagle':
        return { emoji: '🦅', name: 'Eagle' }
      default:
        return { emoji: '🐦', name: 'Birdie' }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 lg:pb-12">
      {/* Back Button - Mobile */}
      <div className="lg:hidden sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-600">
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 lg:py-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12">
          {/* IMAGE GALLERY */}
          <div className="mb-6 lg:mb-0">
            {/* Main Image */}
            <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden mb-4">
              {images.length > 0 ? (
                <Image
                  src={images[selectedImageIndex]?.url || '/images/placeholder.jpg'}
                  alt={listing.title}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  No image available
                </div>
              )}

              {/* Image Navigation */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImageIndex((i) => Math.max(0, i - 1))}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-md hover:bg-white disabled:opacity-50"
                    disabled={selectedImageIndex === 0}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setSelectedImageIndex((i) => Math.min(images.length - 1, i + 1))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-md hover:bg-white disabled:opacity-50"
                    disabled={selectedImageIndex === images.length - 1}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Image Counter */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/50 rounded-full text-white text-sm font-medium">
                  {selectedImageIndex + 1} / {images.length}
                </div>
              )}

              {/* Save Button */}
              <button
                onClick={handleToggleSave}
                className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50"
              >
                <Heart
                  className={`w-5 h-5 ${isSaved ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                />
              </button>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                      index === selectedImageIndex ? 'border-[#5f6651]' : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt={`${listing.title} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* PRODUCT DETAILS */}
          <div>
            {/* Brand & Title */}
            <div className="mb-4">
              {listing.brand && (
                <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">{listing.brand}</p>
              )}
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{listing.title}</h1>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-gray-900">
                ${(listing.price_cents / 100).toFixed(2)}
              </span>
              {listing.shipping_price_cents === 0 ? (
                <span className="text-green-600 font-medium">Free Shipping</span>
              ) : (
                <span className="text-gray-500">
                  + ${(listing.shipping_price_cents / 100).toFixed(2)} shipping
                </span>
              )}
            </div>

            {/* Condition */}
            <div className="mb-6">
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  listing.condition === 'new_with_tags'
                    ? 'bg-green-100 text-green-700'
                    : listing.condition === 'new_without_tags'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700'
                }`}
              >
                {conditionLabels[listing.condition] || listing.condition}
              </span>
            </div>

            {/* SIZE & FIT */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-semibold">Size: {listing.size}</span>

                  {listing.is_one_size ? (
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                      One Size
                    </span>
                  ) : (
                    <FitBadge fitScale={listing.fit_scale} />
                  )}
                </div>
              </div>

              {/* Personalized Fit Recommendation */}
              {isAuthenticated && fitAdvice.type && !listing.is_one_size && (
                <div
                  className={`p-3 rounded-lg ${
                    fitAdvice.type === 'perfect'
                      ? 'bg-green-50 border border-green-200'
                      : fitAdvice.type === 'close'
                        ? 'bg-yellow-50 border border-yellow-200'
                        : 'bg-red-50 border border-red-200'
                  }`}
                >
                  <p
                    className={`text-sm font-medium ${
                      fitAdvice.type === 'perfect'
                        ? 'text-green-700'
                        : fitAdvice.type === 'close'
                          ? 'text-yellow-700'
                          : 'text-red-700'
                    }`}
                  >
                    {fitAdvice.icon} {fitAdvice.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Based on your saved size ({getUserSizeForCategory()}) and seller's fit rating
                  </p>
                </div>
              )}

              {/* Prompt to save sizes */}
              {isAuthenticated && !getUserSizeForCategory() && !listing.is_one_size && (
                <Link
                  href="/settings"
                  className="block p-3 bg-[#5f6651]/5 rounded-lg text-sm text-[#5f6651] hover:bg-[#5f6651]/10 transition-colors"
                >
                  💡 Save your sizes in Settings to get personalized fit recommendations
                </Link>
              )}
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Category</p>
                <p className="font-medium capitalize">{listing.category}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Gender</p>
                <p className="font-medium capitalize">{listing.gender}</p>
              </div>
              {listing.color && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Color</p>
                  <p className="font-medium">{listing.color}</p>
                </div>
              )}
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Views</p>
                <p className="font-medium">{listing.views}</p>
              </div>
            </div>

            {/* Description */}
            {listing.description && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-600 whitespace-pre-wrap">{listing.description}</p>
              </div>
            )}

            {/* SELLER INFO */}
            {listing.seller && (
              <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
                <Link
                  href={`/profile/${listing.seller.username}`}
                  className="flex items-center gap-4 mb-4"
                >
                  {/* Seller Avatar */}
                  <div className="w-14 h-14 bg-[#5f6651] rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                    {listing.seller.avatar_url ? (
                      <Image
                        src={listing.seller.avatar_url}
                        alt={listing.seller.display_name || listing.seller.username}
                        width={56}
                        height={56}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      (listing.seller.display_name || listing.seller.username || 'S')
                        .charAt(0)
                        .toUpperCase()
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">
                      {listing.seller.display_name || listing.seller.username}
                    </p>
                    <p className="text-sm text-gray-500 truncate">@{listing.seller.username}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm">
                        {getTierDisplay(listing.seller.tier_seller).emoji}{' '}
                        {getTierDisplay(listing.seller.tier_seller).name}
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="text-sm text-gray-500">
                        {(listing.seller.handicap_seller || 18).toFixed(1)} HC
                      </span>
                    </div>
                  </div>

                  <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </Link>

                <button
                  onClick={handleMessageSeller}
                  className="w-full py-2 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  Message Seller
                </button>
              </div>
            )}

            {/* Trust Badges */}
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
              <div className="flex items-center gap-1">
                <Shield className="w-4 h-4" />
                <span>Buyer Protection</span>
              </div>
              <div className="flex items-center gap-1">
                <Truck className="w-4 h-4" />
                <span>Tracked Shipping</span>
              </div>
            </div>

            {/* ACTION BUTTONS - Desktop */}
            <div className="hidden lg:flex gap-3">
              <button
                onClick={handleBuyNow}
                className="flex-1 py-3 bg-[#5f6651] text-white rounded-xl font-semibold hover:bg-[#4a5040] transition-colors"
              >
                Buy Now
              </button>
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3 border-2 border-[#5f6651] text-[#5f6651] rounded-xl font-semibold hover:bg-[#5f6651]/5 transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ACTION BUTTONS - Mobile Fixed Bottom */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex gap-3">
        <button
          onClick={handleAddToCart}
          className="w-14 h-14 border-2 border-[#5f6651] text-[#5f6651] rounded-xl flex items-center justify-center flex-shrink-0 hover:bg-[#5f6651]/5 transition-colors"
        >
          <ShoppingBag className="w-6 h-6" />
        </button>
        <button
          onClick={handleBuyNow}
          className="flex-1 py-3 bg-[#5f6651] text-white rounded-xl font-semibold hover:bg-[#4a5040] transition-colors"
        >
          Buy Now - ${(listing.price_cents / 100).toFixed(2)}
        </button>
      </div>

      {/* SIZE WARNING MODAL */}
      {showSizeWarning && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold">Size Warning</h3>
            </div>
            <p className="text-gray-600 mb-6">{fitAdvice.message}. Are you sure you want to add this item to your cart?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSizeWarning(false)}
                className="flex-1 py-2 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addToCart}
                className="flex-1 py-2 bg-[#5f6651] text-white rounded-xl font-medium hover:bg-[#4a5040] transition-colors"
              >
                Add Anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
