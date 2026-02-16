'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase-client'
import { FitScaleSlider } from '@/components'
import { Upload, X, ChevronLeft, ChevronRight, AlertCircle, Loader } from 'lucide-react'

interface UploadedImage {
  file: File
  preview: string
}

const CATEGORIES = [
  { value: 'tops', label: 'Tops (Polos, Shirts)' },
  { value: 'bottoms', label: 'Bottoms (Pants, Shorts)' },
  { value: 'outerwear', label: 'Outerwear (Jackets, Vests)' },
  { value: 'footwear', label: 'Footwear (Shoes, Spikes)' },
  { value: 'headwear', label: 'Headwear (Caps, Hats)' },
  { value: 'accessories', label: 'Accessories (Belts, Scarves)' },
  { value: 'bags', label: 'Bags (Stand, Cart, Travel)' },
]

const GENDERS = [
  { value: 'mens', label: "Men's" },
  { value: 'womens', label: "Women's" },
  { value: 'unisex', label: 'Unisex' },
]

const CONDITIONS = [
  { value: 'new_with_tags', label: 'New with Tags' },
  { value: 'new_without_tags', label: 'New without Tags' },
  { value: 'excellent', label: 'Excellent' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
]

const SIZE_OPTIONS: Record<string, string[]> = {
  tops: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
  outerwear: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
  bottoms: ['28', '29', '30', '31', '32', '33', '34', '36', '38', '40', '42', '44'],
  footwear: ['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12', '13', '14'],
  headwear: ['S/M', 'M/L', 'L/XL', 'One Size', 'Adjustable'],
  accessories: ['S', 'M', 'L', 'XL', 'One Size'],
  bags: ['One Size'],
}

const COMMON_BRANDS = [
  'Titleist',
  'Callaway',
  'TaylorMade',
  'FootJoy',
  'Nike',
  'Adidas',
  'Puma',
  'Under Armour',
  'Travis Mathew',
  'Peter Millar',
  'Malbon Golf',
  'Good Good',
  'Walkers',
  'YETI',
]

export default function SellPage() {
  const router = useRouter()
  const { profile, isAuthenticated } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [images, setImages] = useState<UploadedImage[]>([])
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    brand: '',
    category: '',
    gender: '',
    size: '',
    color: '',
    condition: '',
    price: '',
    shippingPrice: '',
    freeShipping: false,
  })

  const [isOneSize, setIsOneSize] = useState(false)
  const [fitScale, setFitScale] = useState(0)
  const [showBrandSuggestions, setShowBrandSuggestions] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-4">Please log in to list an item</p>
          <button
            onClick={() => router.push('/login')}
            className="px-6 py-2 bg-[#5f6651] text-white rounded-lg"
          >
            Log In
          </button>
        </div>
      </div>
    )
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData((prev) => ({ ...prev, [name]: checked }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/'))
    addImages(files)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    addImages(files)
  }

  const addImages = (files: File[]) => {
    const remaining = 8 - images.length
    const newFiles = files.slice(0, remaining)

    const newImages = newFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }))

    setImages([...images, ...newImages])
  }

  const removeImage = (index: number) => {
    URL.revokeObjectURL(images[index].preview)
    setImages(images.filter((_, i) => i !== index))
    if (selectedImageIndex >= images.length - 1) {
      setSelectedImageIndex(Math.max(0, images.length - 2))
    }
  }

  const moveImage = (from: number, to: number) => {
    const newImages = [...images]
    const [moved] = newImages.splice(from, 1)
    newImages.splice(to, 0, moved)
    setImages(newImages)
  }

  const filteredBrands = COMMON_BRANDS.filter((b) =>
    b.toLowerCase().includes(formData.brand.toLowerCase())
  )

  const sizeOptions = SIZE_OPTIONS[formData.category as keyof typeof SIZE_OPTIONS] || []

  const isFormValid =
    images.length > 0 &&
    formData.title.trim() &&
    formData.brand.trim() &&
    formData.category &&
    formData.gender &&
    (isOneSize || formData.size) &&
    formData.condition &&
    formData.price &&
    profile

  const uploadImage = async (file: File, listingId: string, order: number) => {
    const supabase = createClient()

    const fileExt = file.name.split('.').pop()
    const fileName = `${listingId}/${order}-${Date.now()}.${fileExt}`

    const { data, error } = await supabase.storage
      .from('listings')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) throw error

    const { data: publicUrl } = supabase.storage.from('listings').getPublicUrl(fileName)

    return publicUrl.publicUrl
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const supabase = createClient()

      // 1. Create listing record
      const { data: listing, error: listingError } = await supabase
        .from('listings')
        .insert({
          seller_id: profile!.id,
          title: formData.title,
          description: formData.description || null,
          brand: formData.brand,
          category: formData.category,
          gender: formData.gender,
          size: isOneSize ? 'One Size' : formData.size,
          color: formData.color || null,
          condition: formData.condition,
          price_cents: Math.round(parseFloat(formData.price) * 100),
          shipping_price_cents: formData.freeShipping ? 0 : Math.round(parseFloat(formData.shippingPrice || '0') * 100),
          fit_scale: isOneSize ? 0 : fitScale,
          is_one_size: isOneSize,
          status: 'active',
          views: 0,
          saves: 0,
        })
        .select('id')
        .single()

      if (listingError) throw listingError

      // 2. Upload images and create listing_images records
      for (let i = 0; i < images.length; i++) {
        const imageUrl = await uploadImage(images[i].file, listing.id, i)

        await supabase
          .from('listing_images')
          .insert({
            listing_id: listing.id,
            url: imageUrl,
            display_order: i,
          })
      }

      // 3. Redirect to listing page
      router.push(`/listing/${listing.id}`)
    } catch (err) {
      console.error('Error creating listing:', err)
      setError('Failed to create listing. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="px-4 sm:px-6 pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Page Title */}
          <div className="mb-8 pt-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">List an Item</h1>
            <p className="text-gray-600">Share your golf gear with the Wrong Club community</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900">Error</h3>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* IMAGE UPLOAD */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Photos ({images.length}/8) *
                  </label>

                  {images.length > 0 ? (
                    <>
                      {/* Main Image Display */}
                      <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden mb-4">
                        <Image
                          src={images[selectedImageIndex].preview}
                          alt="Selected"
                          fill
                          className="object-cover"
                        />
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
                              onClick={() =>
                                setSelectedImageIndex(Math.min(images.length - 1, selectedImageIndex + 1))
                              }
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
                            <Image
                              src={image.preview}
                              alt={`Upload ${index + 1}`}
                              fill
                              className="object-cover"
                              onClick={() => setSelectedImageIndex(index)}
                            />

                            {/* Remove Button */}
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                            >
                              <X className="w-3 h-3" />
                            </button>

                            {/* Reorder Buttons */}
                            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {index > 0 && (
                                <button
                                  type="button"
                                  onClick={() => moveImage(index, index - 1)}
                                  className="w-5 h-5 bg-white rounded text-xs shadow"
                                >
                                  ←
                                </button>
                              )}
                              {index < images.length - 1 && (
                                <button
                                  type="button"
                                  onClick={() => moveImage(index, index + 1)}
                                  className="w-5 h-5 bg-white rounded text-xs shadow"
                                >
                                  →
                                </button>
                              )}
                            </div>
                          </div>
                        ))}

                        {/* Add More Button */}
                        {images.length < 8 && (
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-16 h-16 flex-shrink-0 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-[#5f6651] hover:bg-[#5f6651]/5 transition-colors"
                          >
                            <Upload className="w-5 h-5 text-gray-400" />
                          </button>
                        )}
                      </div>
                    </>
                  ) : (
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-colors ${
                        isDragging
                          ? 'border-[#5f6651] bg-[#5f6651]/5'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="text-4xl mb-2">📸</div>
                      <p className="text-gray-900 font-medium">Drag photos here or click</p>
                      <p className="text-gray-500 text-sm mt-1">Up to 8 photos. First photo is the cover.</p>
                    </div>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>

                {/* TITLE */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g. Nike Golf Polo - White"
                    maxLength={100}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5f6651]"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">{formData.title.length}/100</p>
                </div>

                {/* DESCRIPTION */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Tell buyers about this item. Include any flaws, features, or care instructions."
                    maxLength={2000}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5f6651] resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">{formData.description.length}/2000</p>
                </div>

                {/* BRAND */}
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Brand *</label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    onFocus={() => setShowBrandSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowBrandSuggestions(false), 200)}
                    placeholder="e.g. Nike, Malbon Golf"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5f6651]"
                    required
                  />

                  {/* Brand Suggestions */}
                  {showBrandSuggestions && filteredBrands.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10">
                      {filteredBrands.map((brand) => (
                        <button
                          key={brand}
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({ ...prev, brand }))
                            setShowBrandSuggestions(false)
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                        >
                          {brand}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* CATEGORY, GENDER, CONDITION */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5f6651]"
                      required
                    >
                      <option value="">Select...</option>
                      {CATEGORIES.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Gender *</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5f6651]"
                      required
                    >
                      <option value="">Select...</option>
                      {GENDERS.map((g) => (
                        <option key={g.value} value={g.value}>
                          {g.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Condition *</label>
                    <select
                      name="condition"
                      value={formData.condition}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5f6651]"
                      required
                    >
                      <option value="">Select...</option>
                      {CONDITIONS.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* SIZE & ONE SIZE */}
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <input
                      type="checkbox"
                      id="isOneSize"
                      name="isOneSize"
                      checked={isOneSize}
                      onChange={(e) => setIsOneSize(e.target.checked)}
                      className="w-5 h-5 rounded"
                    />
                    <label htmlFor="isOneSize" className="text-sm font-semibold text-gray-900">
                      One Size / Adjustable
                    </label>
                  </div>

                  {!isOneSize && (
                    <select
                      name="size"
                      value={formData.size}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5f6651]"
                      required={!isOneSize}
                    >
                      <option value="">Select size...</option>
                      {sizeOptions.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* FIT SCALE */}
                {!isOneSize && (
                  <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
                    <FitScaleSlider value={fitScale} onChange={setFitScale} />
                  </div>
                )}

                {/* COLOR */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Color</label>
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    placeholder="e.g. White, Navy/Cream"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5f6651]"
                  />
                </div>

                {/* PRICING */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Price *</label>
                    <div className="flex gap-2">
                      <span className="px-4 py-3 bg-gray-100 rounded-xl text-gray-600">$</span>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5f6651]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <input
                        type="checkbox"
                        id="freeShipping"
                        name="freeShipping"
                        checked={formData.freeShipping}
                        onChange={handleInputChange}
                        className="w-5 h-5 rounded"
                      />
                      <label htmlFor="freeShipping" className="text-sm font-semibold text-gray-900">
                        Free Shipping
                      </label>
                    </div>

                    {!formData.freeShipping && (
                      <div className="flex gap-2">
                        <span className="px-4 py-3 bg-gray-100 rounded-xl text-gray-600">$</span>
                        <input
                          type="number"
                          name="shippingPrice"
                          value={formData.shippingPrice}
                          onChange={handleInputChange}
                          placeholder="0.00"
                          step="0.01"
                          min="0"
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5f6651]"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* SUBMIT */}
                <button
                  type="submit"
                  disabled={!isFormValid || isSubmitting}
                  className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
                    !isFormValid || isSubmitting
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-[#5f6651] text-white hover:bg-[#4a5040]'
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader className="w-5 h-5 animate-spin" />
                      Creating listing...
                    </span>
                  ) : (
                    'List Item'
                  )}
                </button>
              </form>
            </div>

            {/* SIDEBAR */}
            <div className="space-y-6">
              {/* Tips */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h2 className="font-bold text-gray-900 mb-4">Tips for Success</h2>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex gap-2">
                    <span>✓</span>
                    <span>Use clear, descriptive titles</span>
                  </li>
                  <li className="flex gap-2">
                    <span>✓</span>
                    <span>Add 3+ high-quality photos</span>
                  </li>
                  <li className="flex gap-2">
                    <span>✓</span>
                    <span>Be honest about condition</span>
                  </li>
                  <li className="flex gap-2">
                    <span>✓</span>
                    <span>Set accurate fit scale</span>
                  </li>
                </ul>
              </div>

              {/* Fees */}
              {formData.price && (
                <div className="bg-[#5f6651]/5 rounded-xl p-6 border border-[#5f6651]/20">
                  <h2 className="font-bold text-gray-900 mb-4">Your Earnings</h2>
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between">
                      <span>Sale Price</span>
                      <span className="font-semibold">${parseFloat(formData.price).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Platform Fee (10%)</span>
                      <span>-${(parseFloat(formData.price) * 0.1).toFixed(2)}</span>
                    </div>
                    {!formData.freeShipping && formData.shippingPrice && (
                      <div className="flex justify-between text-gray-600">
                        <span>Shipping</span>
                        <span>-${parseFloat(formData.shippingPrice).toFixed(2)}</span>
                      </div>
                    )}
                    <div className="pt-2 border-t flex justify-between font-bold">
                      <span>You Earn</span>
                      <span className="text-[#5f6651]">
                        $
                        {(
                          parseFloat(formData.price) * 0.9 -
                          (formData.freeShipping ? 0 : parseFloat(formData.shippingPrice || '0'))
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
