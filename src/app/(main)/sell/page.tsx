'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase-client'
import { FitScaleSlider } from '@/components'
import { Camera, X, ChevronLeft, ChevronRight, Loader2, AlertCircle } from 'lucide-react'

// ==================== CONSTANTS ====================

const CATEGORIES = [
  { value: 'tops', label: 'Tops', description: 'Polos, shirts, sweaters' },
  { value: 'bottoms', label: 'Bottoms', description: 'Pants, shorts, skirts' },
  { value: 'outerwear', label: 'Outerwear', description: 'Jackets, vests, rain gear' },
  { value: 'footwear', label: 'Footwear', description: 'Golf shoes, spikes, sneakers' },
  { value: 'headwear', label: 'Headwear', description: 'Caps, bucket hats, beanies' },
  { value: 'accessories', label: 'Accessories', description: 'Belts, gloves, sunglasses' },
  { value: 'bags', label: 'Bags', description: 'Stand, cart, travel bags' },
  { value: 'equipment', label: 'Equipment', description: 'Clubs, balls, rangefinders' },
]

const SIZE_OPTIONS: Record<string, string[]> = {
  tops: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
  outerwear: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
  bottoms: ['28', '29', '30', '31', '32', '33', '34', '36', '38', '40', '42', '44'],
  footwear: ['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12', '13', '14'],
  headwear: ['S/M', 'M/L', 'L/XL', 'One Size', 'Adjustable'],
  accessories: ['S', 'M', 'L', 'XL', 'One Size'],
  bags: ['One Size'],
  equipment: ['One Size'],
}

const CONDITIONS = [
  { value: 'new_with_tags', label: 'New with Tags', description: 'Unworn, tags still attached' },
  { value: 'new_without_tags', label: 'New without Tags', description: 'Unworn, no tags' },
  { value: 'excellent', label: 'Excellent', description: 'Worn once or twice, like new' },
  { value: 'good', label: 'Good', description: 'Gently used, minor signs of wear' },
  { value: 'fair', label: 'Fair', description: 'Visible wear, still functional' },
]

const GENDERS = [
  { value: 'mens', label: "Men's" },
  { value: 'womens', label: "Women's" },
  { value: 'unisex', label: 'Unisex' },
]

const POPULAR_BRANDS = [
  'Titleist', 'Callaway', 'TaylorMade', 'FootJoy', 'Nike', 'Adidas',
  'Puma', 'Under Armour', 'Travis Mathew', 'Peter Millar', 'Polo Ralph Lauren',
  'Greyson', 'Lululemon', 'J.Lindeberg', 'G/FORE', 'Malbon Golf',
  'Eastside Golf', 'Bonobos', 'johnnie-O', 'UNRL', 'Bad Birdie',
]

// Smart Pricing Configuration
const PRICE_SUGGESTIONS: Record<string, Record<string, Record<string, { min: number; avg: number; max: number }>>> = {
  tops: {
    premium: { new_with_tags: { min: 45, avg: 65, max: 95 }, new_without_tags: { min: 35, avg: 50, max: 75 }, excellent: { min: 25, avg: 40, max: 60 }, good: { min: 15, avg: 28, max: 45 }, fair: { min: 8, avg: 15, max: 25 } },
    standard: { new_with_tags: { min: 30, avg: 45, max: 65 }, new_without_tags: { min: 20, avg: 32, max: 50 }, excellent: { min: 15, avg: 25, max: 40 }, good: { min: 10, avg: 18, max: 30 }, fair: { min: 5, avg: 10, max: 18 } },
    budget: { new_with_tags: { min: 15, avg: 25, max: 40 }, new_without_tags: { min: 10, avg: 18, max: 30 }, excellent: { min: 8, avg: 15, max: 25 }, good: { min: 5, avg: 10, max: 18 }, fair: { min: 3, avg: 6, max: 12 } },
  },
  bottoms: {
    premium: { new_with_tags: { min: 50, avg: 75, max: 120 }, new_without_tags: { min: 40, avg: 60, max: 95 }, excellent: { min: 30, avg: 50, max: 75 }, good: { min: 20, avg: 35, max: 55 }, fair: { min: 10, avg: 20, max: 35 } },
    standard: { new_with_tags: { min: 35, avg: 50, max: 75 }, new_without_tags: { min: 25, avg: 40, max: 60 }, excellent: { min: 18, avg: 30, max: 50 }, good: { min: 12, avg: 22, max: 38 }, fair: { min: 6, avg: 12, max: 22 } },
    budget: { new_with_tags: { min: 20, avg: 30, max: 50 }, new_without_tags: { min: 15, avg: 23, max: 38 }, excellent: { min: 10, avg: 18, max: 30 }, good: { min: 6, avg: 12, max: 20 }, fair: { min: 3, avg: 7, max: 15 } },
  },
  outerwear: {
    premium: { new_with_tags: { min: 75, avg: 120, max: 200 }, new_without_tags: { min: 60, avg: 100, max: 160 }, excellent: { min: 45, avg: 75, max: 120 }, good: { min: 30, avg: 50, max: 85 }, fair: { min: 15, avg: 30, max: 50 } },
    standard: { new_with_tags: { min: 50, avg: 80, max: 130 }, new_without_tags: { min: 40, avg: 65, max: 105 }, excellent: { min: 30, avg: 50, max: 80 }, good: { min: 20, avg: 35, max: 60 }, fair: { min: 10, avg: 20, max: 35 } },
    budget: { new_with_tags: { min: 25, avg: 40, max: 70 }, new_without_tags: { min: 20, avg: 32, max: 55 }, excellent: { min: 15, avg: 25, max: 45 }, good: { min: 10, avg: 18, max: 32 }, fair: { min: 5, avg: 10, max: 20 } },
  },
  footwear: {
    premium: { new_with_tags: { min: 60, avg: 95, max: 150 }, new_without_tags: { min: 50, avg: 80, max: 130 }, excellent: { min: 40, avg: 65, max: 110 }, good: { min: 25, avg: 45, max: 75 }, fair: { min: 12, avg: 25, max: 45 } },
    standard: { new_with_tags: { min: 40, avg: 60, max: 95 }, new_without_tags: { min: 32, avg: 50, max: 80 }, excellent: { min: 25, avg: 40, max: 65 }, good: { min: 15, avg: 28, max: 48 }, fair: { min: 8, avg: 15, max: 28 } },
    budget: { new_with_tags: { min: 20, avg: 35, max: 55 }, new_without_tags: { min: 16, avg: 28, max: 45 }, excellent: { min: 12, avg: 22, max: 38 }, good: { min: 8, avg: 15, max: 28 }, fair: { min: 4, avg: 8, max: 15 } },
  },
  headwear: {
    premium: { new_with_tags: { min: 30, avg: 50, max: 80 }, new_without_tags: { min: 25, avg: 40, max: 65 }, excellent: { min: 18, avg: 30, max: 50 }, good: { min: 12, avg: 22, max: 38 }, fair: { min: 6, avg: 12, max: 22 } },
    standard: { new_with_tags: { min: 18, avg: 30, max: 50 }, new_without_tags: { min: 14, avg: 24, max: 40 }, excellent: { min: 10, avg: 18, max: 32 }, good: { min: 6, avg: 12, max: 22 }, fair: { min: 3, avg: 6, max: 12 } },
    budget: { new_with_tags: { min: 10, avg: 18, max: 30 }, new_without_tags: { min: 8, avg: 14, max: 24 }, excellent: { min: 6, avg: 11, max: 18 }, good: { min: 4, avg: 8, max: 14 }, fair: { min: 2, avg: 4, max: 8 } },
  },
  accessories: {
    premium: { new_with_tags: { min: 25, avg: 40, max: 65 }, new_without_tags: { min: 20, avg: 32, max: 50 }, excellent: { min: 15, avg: 25, max: 40 }, good: { min: 10, avg: 18, max: 30 }, fair: { min: 5, avg: 10, max: 18 } },
    standard: { new_with_tags: { min: 15, avg: 25, max: 40 }, new_without_tags: { min: 12, avg: 20, max: 32 }, excellent: { min: 10, avg: 16, max: 26 }, good: { min: 6, avg: 11, max: 18 }, fair: { min: 3, avg: 6, max: 11 } },
    budget: { new_with_tags: { min: 8, avg: 15, max: 25 }, new_without_tags: { min: 6, avg: 12, max: 20 }, excellent: { min: 5, avg: 10, max: 16 }, good: { min: 3, avg: 7, max: 12 }, fair: { min: 2, avg: 4, max: 8 } },
  },
  bags: {
    premium: { new_with_tags: { min: 80, avg: 130, max: 200 }, new_without_tags: { min: 65, avg: 110, max: 170 }, excellent: { min: 50, avg: 85, max: 140 }, good: { min: 35, avg: 60, max: 100 }, fair: { min: 18, avg: 35, max: 60 } },
    standard: { new_with_tags: { min: 50, avg: 80, max: 130 }, new_without_tags: { min: 40, avg: 65, max: 105 }, excellent: { min: 32, avg: 50, max: 85 }, good: { min: 22, avg: 35, max: 60 }, fair: { min: 11, avg: 20, max: 35 } },
    budget: { new_with_tags: { min: 30, avg: 50, max: 80 }, new_without_tags: { min: 24, avg: 40, max: 65 }, excellent: { min: 18, avg: 32, max: 52 }, good: { min: 12, avg: 22, max: 38 }, fair: { min: 6, avg: 12, max: 22 } },
  },
  equipment: {
    premium: { new_with_tags: { min: 100, avg: 200, max: 500 }, new_without_tags: { min: 80, avg: 160, max: 400 }, excellent: { min: 60, avg: 120, max: 300 }, good: { min: 40, avg: 80, max: 200 }, fair: { min: 20, avg: 50, max: 120 } },
    standard: { new_with_tags: { min: 60, avg: 120, max: 300 }, new_without_tags: { min: 50, avg: 100, max: 250 }, excellent: { min: 40, avg: 80, max: 200 }, good: { min: 25, avg: 55, max: 140 }, fair: { min: 15, avg: 35, max: 90 } },
    budget: { new_with_tags: { min: 30, avg: 60, max: 150 }, new_without_tags: { min: 25, avg: 50, max: 120 }, excellent: { min: 20, avg: 40, max: 100 }, good: { min: 15, avg: 30, max: 75 }, fair: { min: 8, avg: 18, max: 50 } },
  },
}

type ShippingOption = 'buyer_pays' | 'free' | 'flat_included'

const getPremiumBrands = () => ['Titleist', 'Callaway', 'TaylorMade', 'FootJoy', 'Nike', 'Adidas', 'Puma', 'Under Armour', 'Travis Mathew', 'Peter Millar', 'Polo Ralph Lauren', 'Greyson']
const getStandardBrands = () => ['Lululemon', 'J.Lindeberg', 'G/FORE', 'Malbon Golf', 'Eastside Golf', 'Bonobos', 'johnnie-O']
const getBrandTier = (brand: string): 'premium' | 'standard' | 'budget' => {
  if (getPremiumBrands().some(b => brand.toLowerCase().includes(b.toLowerCase()))) return 'premium'
  if (getStandardBrands().some(b => brand.toLowerCase().includes(b.toLowerCase()))) return 'standard'
  return 'budget'
}

const getSuggestions = (category: string, brand: string, condition: string) => {
  if (!category || !brand || !condition) return null
  const tier = getBrandTier(brand)
  const categoryKey = category as keyof typeof PRICE_SUGGESTIONS
  if (!PRICE_SUGGESTIONS[categoryKey]) return null
  if (!PRICE_SUGGESTIONS[categoryKey][tier]) return null
  if (!PRICE_SUGGESTIONS[categoryKey][tier][condition]) return null
  return PRICE_SUGGESTIONS[categoryKey][tier][condition]
}

// ==================== COMPONENT ====================

export default function SellPage() {
  const router = useRouter()
  const { profile, isAuthenticated } = useAuth()

  // Form state
  const [images, setImages] = useState<{ file: File; preview: string }[]>([])
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const [title, setTitle] = useState('')
  const [brand, setBrand] = useState('')
  const [brandSuggestions, setBrandSuggestions] = useState<string[]>([])
  const [showBrandSuggestions, setShowBrandSuggestions] = useState(false)
  const [category, setCategory] = useState('')
  const [gender, setGender] = useState('')
  const [size, setSize] = useState('')
  const [isOneSize, setIsOneSize] = useState(false)
  const [fitScale, setFitScale] = useState(0)
  const [condition, setCondition] = useState('')
  const [color, setColor] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [shippingOption, setShippingOption] = useState<ShippingOption>('buyer_pays')
  const [shippingPrice, setShippingPrice] = useState('')

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Brand autocomplete
  useEffect(() => {
    if (brand.length >= 2) {
      const matches = POPULAR_BRANDS.filter(b => b.toLowerCase().includes(brand.toLowerCase())).slice(0, 5)
      setBrandSuggestions(matches)
      setShowBrandSuggestions(matches.length > 0)
    } else {
      setShowBrandSuggestions(false)
    }
  }, [brand])

  // Reset size when category changes
  useEffect(() => {
    setSize('')
    setIsOneSize(false)
  }, [category])

  // Authentication check - conditional rendering instead of early return
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-4">Please log in to list an item</p>
          <button onClick={() => router.push('/login')} className="px-6 py-2 bg-[#5f6651] text-white rounded-lg">
            Log In
          </button>
        </div>
      </div>
    )
  }

  // Image handling
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    addImages(files)
  }

  const handleImageDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'))
    addImages(files)
  }

  const addImages = (files: File[]) => {
    const remaining = 8 - images.length
    const newFiles = files.slice(0, remaining)
    const newImages = newFiles.map(file => ({ file, preview: URL.createObjectURL(file) }))
    setImages(prev => [...prev, ...newImages])
  }

  const removeImage = (index: number) => {
    URL.revokeObjectURL(images[index].preview)
    setImages(prev => prev.filter((_, i) => i !== index))
    if (selectedImageIndex >= images.length - 1) {
      setSelectedImageIndex(Math.max(0, images.length - 2))
    }
  }

  const moveImage = (from: number, to: number) => {
    setImages(prev => {
      const newImages = [...prev]
      const [moved] = newImages.splice(from, 1)
      newImages.splice(to, 0, moved)
      return newImages
    })
  }

  // Form validation
  const validateForm = () => {
    if (images.length === 0) return 'Please add at least one photo'
    if (!title.trim()) return 'Please enter a title'
    if (!brand.trim()) return 'Please enter a brand'
    if (!category) return 'Please select a category'
    if (!gender) return 'Please select a gender'
    if (!size && !isOneSize) return 'Please select a size'
    if (!condition) return 'Please select a condition'
    if (!price || parseFloat(price) <= 0) return 'Please enter a valid price'
    if (shippingOption === 'buyer_pays' && (!shippingPrice || parseFloat(shippingPrice) < 0)) {
      return 'Please enter a shipping price'
    }
    return null
  }

  // Earnings calculation
  const priceNum = parseFloat(price) || 0
  const platformFeeRate = 0.1

  const calculateEarnings = () => {
    let earnings = priceNum * (1 - platformFeeRate)
    if (shippingOption === 'free') {
      earnings -= 8
    } else if (shippingOption === 'flat_included') {
      earnings -= 3
    }
    return Math.max(0, earnings)
  }

  // Submit listing
  const handleSubmit = async () => {
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const supabase = createClient()

      const { data: listing, error: listingError } = await supabase
        .from('listings')
        .insert({
          seller_id: profile!.id,
          title: title.trim(),
          description: description.trim() || null,
          brand: brand.trim(),
          category,
          gender,
          size: isOneSize ? 'One Size' : size,
          color: color.trim() || null,
          condition,
          price_cents: Math.round(parseFloat(price) * 100),
          shipping_price_cents:
            shippingOption === 'buyer_pays'
              ? Math.round(parseFloat(shippingPrice) * 100)
              : shippingOption === 'flat_included'
              ? 500
              : 0,
          fit_scale: isOneSize ? 0 : fitScale,
          is_one_size: isOneSize,
          status: 'active',
          views: 0,
          saves: 0,
        })
        .select('id')
        .single()

      if (listingError) throw listingError

      // Upload images
      for (let i = 0; i < images.length; i++) {
        const file = images[i].file
        const fileExt = file.name.split('.').pop()
        const fileName = `${listing.id}/${i}-${Date.now()}.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from('listings')
          .upload(fileName, file, { cacheControl: '3600', upsert: false })

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage.from('listings').getPublicUrl(fileName)

        await supabase.from('listing_images').insert({
          listing_id: listing.id,
          url: publicUrl,
          display_order: i,
        })
      }

      router.push(`/listing/${listing.id}`)
    } catch (err) {
      console.error('Error creating listing:', err)
      setError('Failed to create listing. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900">List an Item</h1>
          <p className="text-sm text-gray-500">Sell your golf gear to the Wrong Club community</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900">Error</h3>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* ==================== SECTION 1: PHOTOS ==================== */}
        <section className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-1">Photos</h2>
          <p className="text-sm text-gray-500 mb-4">Add up to 8 photos. First photo is the cover.</p>

          {images.length > 0 ? (
            <>
              {/* Main Image Display */}
              <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden mb-4">
                <img src={images[selectedImageIndex].preview} alt="Selected" className="w-full h-full object-cover" />
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => setSelectedImageIndex(Math.max(0, selectedImageIndex - 1))}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center hover:bg-white"
                      disabled={selectedImageIndex === 0}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedImageIndex(Math.min(images.length - 1, selectedImageIndex + 1))}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center hover:bg-white"
                      disabled={selectedImageIndex === images.length - 1}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
                <div className="absolute top-2 left-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                  Cover Photo
                </div>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className={`relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 cursor-pointer group ${
                      index === selectedImageIndex ? 'border-[#5f6651]' : 'border-transparent'
                    }`}
                  >
                    <img src={image.preview} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" onClick={() => setSelectedImageIndex(index)} />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {index > 0 && (
                        <button type="button" onClick={() => moveImage(index, index - 1)} className="w-5 h-5 bg-white rounded text-xs shadow">
                          ←
                        </button>
                      )}
                      {index < images.length - 1 && (
                        <button type="button" onClick={() => moveImage(index, index + 1)} className="w-5 h-5 bg-white rounded text-xs shadow">
                          →
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {images.length < 8 && (
                  <button
                    type="button"
                    onClick={() => document.getElementById('image-input')?.click()}
                    className="w-16 h-16 flex-shrink-0 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-[#5f6651] hover:bg-[#5f6651]/5 transition-colors"
                  >
                    <Camera className="w-5 h-5 text-gray-400" />
                  </button>
                )}
              </div>
            </>
          ) : (
            <div
              onDragOver={() => setIsDragging(true)}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleImageDrop}
              onClick={() => document.getElementById('image-input')?.click()}
              className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-colors ${
                isDragging ? 'border-[#5f6651] bg-[#5f6651]/5' : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="text-4xl mb-2">📸</div>
              <p className="text-gray-900 font-medium">Drag photos here or click</p>
              <p className="text-gray-500 text-sm mt-1">Up to 8 photos. First photo is the cover.</p>
            </div>
          )}

          <input id="image-input" type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
        </section>

        {/* ==================== SECTION 2: ITEM DETAILS ==================== */}
        <section className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Item Details</h2>

          {/* Title */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value.slice(0, 100))}
              placeholder="e.g. Nike Dri-FIT Victory Polo"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5f6651]"
            />
            <p className="text-xs text-gray-400 mt-1 text-right">{title.length}/100</p>
          </div>

          {/* Brand */}
          <div className="mb-4 relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Brand <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={brand}
              onChange={e => setBrand(e.target.value)}
              onFocus={() => brand.length >= 2 && setShowBrandSuggestions(true)}
              onBlur={() => setTimeout(() => setShowBrandSuggestions(false), 200)}
              placeholder="e.g. Nike, Titleist, Travis Mathew"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5f6651]"
            />
            {showBrandSuggestions && brandSuggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                {brandSuggestions.map(suggestion => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => {
                      setBrand(suggestion)
                      setShowBrandSuggestions(false)
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Category */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5f6651] bg-white">
              <option value="">Select category</option>
              {CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label} - {cat.description}
                </option>
              ))}
            </select>
          </div>

          {/* Gender */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-3">
              {GENDERS.map(g => (
                <button
                  key={g.value}
                  type="button"
                  onClick={() => setGender(g.value)}
                  className={`flex-1 py-3 rounded-xl border-2 font-medium transition-colors ${
                    gender === g.value ? 'border-[#5f6651] bg-[#5f6651]/5 text-[#5f6651]' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ==================== SECTION 3: SIZE & FIT ==================== */}
        <section className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Size & Fit</h2>

          {/* One Size Toggle */}
          <div className="mb-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isOneSize}
                onChange={e => {
                  setIsOneSize(e.target.checked)
                  if (e.target.checked) setSize('One Size')
                }}
                className="w-5 h-5 rounded border-gray-300 text-[#5f6651] focus:ring-[#5f6651]"
              />
              <span className="text-gray-700">This item is One Size / Adjustable</span>
            </label>
          </div>

          {/* Size Dropdown */}
          {!isOneSize && category && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Size <span className="text-red-500">*</span>
              </label>
              <select
                value={size}
                onChange={e => setSize(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5f6651] bg-white"
              >
                <option value="">Select size</option>
                {(SIZE_OPTIONS[category] || SIZE_OPTIONS.tops).map(s => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Fit Scale Slider */}
          {!isOneSize && (
            <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
              <FitScaleSlider value={fitScale} onChange={setFitScale} />
            </div>
          )}
        </section>

        {/* ==================== SECTION 4: CONDITION & COLOR ==================== */}
        <section className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Condition & Color</h2>

          {/* Condition */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Condition <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {CONDITIONS.map(c => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setCondition(c.value)}
                  className={`w-full p-3 rounded-xl border-2 text-left transition-colors ${
                    condition === c.value ? 'border-[#5f6651] bg-[#5f6651]/5' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="font-medium">{c.label}</span>
                  <span className="text-sm text-gray-500 ml-2">{c.description}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Color <span className="text-gray-400">(optional)</span>
            </label>
            <input
              type="text"
              value={color}
              onChange={e => setColor(e.target.value)}
              placeholder="e.g. Navy Blue, White/Red"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5f6651]"
            />
          </div>
        </section>

        {/* ==================== SECTION 5: DESCRIPTION ==================== */}
        <section className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-1">Description</h2>
          <p className="text-sm text-gray-500 mb-4">Add details buyers might want to know (optional)</p>

          <textarea
            value={description}
            onChange={e => setDescription(e.target.value.slice(0, 2000))}
            placeholder="• Measurements (chest, length, inseam)&#10;• Why you're selling&#10;• Any flaws or wear&#10;• Styling tips"
            rows={5}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5f6651] resize-none"
          />
          <p className="text-xs text-gray-400 mt-1 text-right">{description.length}/2000</p>
        </section>

        {/* ==================== SECTION 6: PRICING & SHIPPING ==================== */}
        <section className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Pricing & Shipping</h2>

          {/* Price */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={price}
                onChange={e => setPrice(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5f6651]"
              />
            </div>
          </div>

          {/* Smart Pricing */}
          {category && brand && condition && getSuggestions(category, brand, condition) && (
            <div className="mb-6 p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-200">
              <h3 className="font-bold text-gray-900 mb-1">💡 Smart Pricing</h3>
              <p className="text-xs text-gray-600 mb-4">Based on {brand} {category} in {condition} condition</p>
              <div className="space-y-3">
                {(() => {
                  const suggestions = getSuggestions(category, brand, condition)
                  if (!suggestions) return null

                  const pricingOptions = [
                    { label: 'Maximum', price: suggestions.max, tag: 'Patient seller', emoji: '💎', color: 'blue' },
                    { label: 'Recommended', price: suggestions.avg, tag: 'Best balance', emoji: '⭐', color: 'green', highlight: true },
                    { label: 'Quick Sale', price: suggestions.min, tag: 'Fast mover', emoji: '⚡', color: 'orange' },
                  ]

                  return pricingOptions.map(option => (
                    <button
                      key={option.label}
                      type="button"
                      onClick={() => setPrice(option.price.toString())}
                      className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                        parseFloat(price) === option.price
                          ? option.color === 'green'
                            ? 'border-green-500 bg-green-50'
                            : option.color === 'blue'
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-orange-500 bg-orange-50'
                          : 'border-transparent hover:border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span>{option.emoji}</span>
                          <div>
                            <span className="font-medium text-gray-900">{option.label}</span>
                            {option.highlight && <span className="text-xs text-green-700 ml-2">Recommended</span>}
                          </div>
                        </div>
                        <div>
                          <span className="font-bold text-gray-900">${option.price}</span>
                          <p className="text-xs text-gray-500">{option.tag}</p>
                        </div>
                      </div>
                    </button>
                  ))
                })()}
              </div>
            </div>
          )}

          {/* Shipping Options */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Shipping</label>
            <div className="space-y-3">
              <label
                className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                  shippingOption === 'buyer_pays' ? 'border-[#5f6651] bg-[#5f6651]/5' : 'border-gray-200'
                }`}
              >
                <input type="radio" name="shipping" checked={shippingOption === 'buyer_pays'} onChange={() => setShippingOption('buyer_pays')} className="mt-1" />
                <div className="flex-1">
                  <span className="font-medium">Buyer pays shipping</span>
                  {shippingOption === 'buyer_pays' && (
                    <div className="mt-2">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                        <input
                          type="number"
                          value={shippingPrice}
                          onChange={e => setShippingPrice(e.target.value)}
                          placeholder="5.00"
                          step="0.01"
                          min="0"
                          className="w-full pl-7 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5f6651]"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                  shippingOption === 'flat_included' ? 'border-[#5f6651] bg-[#5f6651]/5' : 'border-gray-200'
                }`}
              >
                <input type="radio" name="shipping" checked={shippingOption === 'flat_included'} onChange={() => setShippingOption('flat_included')} className="mt-1" />
                <div>
                  <span className="font-medium">$5 flat rate shipping</span>
                  <p className="text-sm text-gray-500 mt-0.5">Buyer pays $5, you cover any extra shipping cost</p>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                  shippingOption === 'free' ? 'border-[#5f6651] bg-[#5f6651]/5' : 'border-gray-200'
                }`}
              >
                <input type="radio" name="shipping" checked={shippingOption === 'free'} onChange={() => setShippingOption('free')} className="mt-1" />
                <div>
                  <span className="font-medium">Free shipping</span>
                  <p className="text-sm text-gray-500 mt-0.5">You cover all shipping costs (~$8). Items with free shipping sell faster!</p>
                </div>
              </label>
            </div>
          </div>

          {/* Earnings Preview */}
          {priceNum > 0 && (
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-medium text-gray-700 mb-3">Your Earnings</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Item price</span>
                  <span>${priceNum.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Platform fee (10%)</span>
                  <span className="text-red-600">-${(priceNum * 0.1).toFixed(2)}</span>
                </div>
                {shippingOption === 'free' && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping cost (est.)</span>
                    <span className="text-red-600">-$8.00</span>
                  </div>
                )}
                {shippingOption === 'flat_included' && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping difference (est.)</span>
                    <span className="text-red-600">-$3.00</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between font-semibold">
                    <span>You'll earn</span>
                    <span className="text-green-600">${calculateEarnings().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ==================== SUBMIT ==================== */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`w-full py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 ${
            isSubmitting ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#5f6651] text-white hover:bg-[#4a5040]'
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Listing...
            </>
          ) : (
            'List Item'
          )}
        </button>
      </div>
    </div>
  )
}
