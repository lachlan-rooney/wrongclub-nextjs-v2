'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { FitScaleSlider } from '@/components'

interface FormData {
  title: string
  brand: string
  category: string
  gender: string
  condition: string
  size: string
  description: string
  price: string
}

export default function SellPage() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState<FormData>({
    title: '',
    brand: '',
    category: '',
    gender: '',
    condition: '',
    size: '',
    description: '',
    price: '',
  })

  const [photoAdded, setPhotoAdded] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [showPricingCard, setShowPricingCard] = useState(false)
  const [allowOffers, setAllowOffers] = useState(false)
  const [fitScale, setFitScale] = useState(0)
  const [isOneSize, setIsOneSize] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.currentTarget.classList.add('bg-blue-50', 'border-blue-300')
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('bg-blue-50', 'border-blue-300')
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.currentTarget.classList.remove('bg-blue-50', 'border-blue-300')
    setPhotoAdded(true)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({
        title: '',
        brand: '',
        category: '',
        gender: '',
        condition: '',
        size: '',
        description: '',
        price: '',
      })
      setPhotoAdded(false)
      setFitScale(0)
      setIsOneSize(false)
    }, 2000)
  }

  const isFormComplete = formData.title && formData.brand && formData.category && formData.gender && formData.condition && formData.price && photoAdded

  const getPriceSuggestions = (condition: string) => {
    const priceGuide: Record<string, { quick: number; fair: number; max: number }> = {
      new_with_tags: { quick: 55, fair: 68, max: 82 },
      new_without_tags: { quick: 45, fair: 58, max: 70 },
      like_new: { quick: 38, fair: 48, max: 60 },
      good: { quick: 28, fair: 38, max: 48 },
      fair: { quick: 18, fair: 25, max: 35 },
    }
    return priceGuide[condition] || { quick: 40, fair: 50, max: 60 }
  }

  const handlePriceSelect = (price: number) => {
    setFormData(prev => ({
      ...prev,
      price: price.toString(),
    }))
    setShowPricingCard(false)
  }

  const canGetPriceSuggestion = formData.brand && formData.title && formData.condition
  const priceSuggestions = canGetPriceSuggestion ? getPriceSuggestions(formData.condition) : null

  const calculateEarnings = (priceString: string) => {
    const price = parseFloat(priceString) || 0
    if (price <= 0) return null
    
    const platformFee = price * 0.08
    const processingFee = price * 0.03 + 0.30
    const totalFees = platformFee + processingFee
    const earnings = price - totalFees
    
    return {
      price,
      platformFee,
      processingFee,
      totalFees,
      earnings,
      earnPercentage: ((earnings / price) * 100).toFixed(1),
    }
  }

  const earnings = calculateEarnings(formData.price)

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <main className="px-6 pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Page Title */}
          <div className="mb-8 pt-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">List an Item</h1>
            <p className="text-gray-600">Share your golf gear with the Wrong Club community</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Photo Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Photos *
                  </label>
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center cursor-pointer hover:border-[#5f6651] transition-colors bg-gray-50 hover:bg-gray-100"
                  >
                    {photoAdded ? (
                      <div>
                        <div className="text-4xl mb-2">✓</div>
                        <p className="text-gray-900 font-medium">Photo added</p>
                        <p className="text-gray-500 text-sm mt-1">Click or drag to change</p>
                      </div>
                    ) : (
                      <div>
                        <div className="text-4xl mb-2">📸</div>
                        <p className="text-gray-900 font-medium">Drag photos here or click</p>
                        <p className="text-gray-500 text-sm mt-1">PNG, JPG up to 10MB each</p>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          setPhotoAdded(true)
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-semibold text-gray-900 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g. Nike Golf Polo - White"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5f6651] focus:border-transparent"
                    required
                  />
                </div>

                {/* Brand */}
                <div>
                  <label htmlFor="brand" className="block text-sm font-semibold text-gray-900 mb-2">
                    Brand *
                  </label>
                  <input
                    type="text"
                    id="brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    placeholder="e.g. Malbon Golf, FootJoy"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5f6651] focus:border-transparent"
                    required
                  />
                </div>

                {/* Category, Gender, Condition Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Category */}
                  <div>
                    <label htmlFor="category" className="block text-sm font-semibold text-gray-900 mb-2">
                      Category *
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5f6651] focus:border-transparent"
                      required
                    >
                      <option value="">Select a category</option>
                      <option value="tops">Tops</option>
                      <option value="bottoms">Bottoms</option>
                      <option value="footwear">Footwear</option>
                      <option value="headwear">Headwear</option>
                      <option value="accessories">Accessories</option>
                      <option value="bags">Bags</option>
                    </select>
                  </div>

                  {/* Gender */}
                  <div>
                    <label htmlFor="gender" className="block text-sm font-semibold text-gray-900 mb-2">
                      Gender *
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5f6651] focus:border-transparent"
                      required
                    >
                      <option value="">Select gender</option>
                      <option value="mens">Mens</option>
                      <option value="womens">Womens</option>
                      <option value="juniors">Juniors</option>
                      <option value="unisex">Unisex</option>
                    </select>
                  </div>

                  {/* Condition */}
                  <div>
                    <label htmlFor="condition" className="block text-sm font-semibold text-gray-900 mb-2">
                      Condition *
                    </label>
                    <select
                      id="condition"
                      name="condition"
                      value={formData.condition}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5f6651] focus:border-transparent"
                      required
                    >
                      <option value="">Select condition</option>
                      <option value="new_with_tags">New with Tags</option>
                      <option value="new_without_tags">New without Tags</option>
                      <option value="like_new">Like New</option>
                      <option value="good">Good</option>
                      <option value="fair">Fair</option>
                    </select>
                  </div>
                </div>

                {/* Size */}
                <div>
                  <label htmlFor="size" className="block text-sm font-semibold text-gray-900 mb-2">
                    Size
                  </label>
                  <input
                    type="text"
                    id="size"
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                    placeholder="e.g. M, L, 10, One Size"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5f6651] focus:border-transparent"
                  />
                </div>

                {/* One Size Checkbox */}
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <input
                    type="checkbox"
                    id="isOneSize"
                    checked={isOneSize}
                    onChange={(e) => setIsOneSize(e.target.checked)}
                    className="w-5 h-5 text-[#5f6651] rounded focus:ring-2 focus:ring-[#5f6651]"
                  />
                  <label htmlFor="isOneSize" className="text-sm font-semibold text-gray-900 cursor-pointer">
                    This is a One Size / Adjustable item
                  </label>
                </div>

                {/* Fit Scale */}
                {!isOneSize && (
                  <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
                    <FitScaleSlider
                      value={fitScale}
                      onChange={setFitScale}
                      label="Fit Scale"
                      description="How does this item fit compared to the size label? Helps buyers find the perfect fit."
                    />
                  </div>
                )}

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-semibold text-gray-900 mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Tell buyers more about this item. Include any details about condition, flaws, or special features."
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5f6651] focus:border-transparent resize-none"
                  />
                </div>

                {/* Price */}
                <div>
                  <label htmlFor="price" className="block text-sm font-semibold text-gray-900 mb-2">
                    Price *
                  </label>
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <span className="absolute left-4 top-3 text-gray-500 font-semibold">$</span>
                      <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5f6651] focus:border-transparent"
                        required
                      />
                    </div>
                    {canGetPriceSuggestion && (
                      <button
                        type="button"
                        onClick={() => setShowPricingCard(!showPricingCard)}
                        className="px-4 py-3 bg-[#5f6651]/10 text-[#5f6651] rounded-xl font-semibold hover:bg-[#5f6651]/20 transition-colors"
                      >
                        ✨ Smart Pricing
                      </button>
                    )}
                  </div>

                  {/* Smart Pricing Card */}
                  {showPricingCard && priceSuggestions && (
                    <div className="mt-4 p-6 bg-gradient-to-br from-[#5f6651]/5 to-[#5f6651]/10 rounded-2xl border border-[#5f6651]/20">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-xl">🤖</span>
                        <h3 className="font-bold text-gray-900">AI Price Suggestions</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        Based on condition and market data for similar items
                      </p>

                      <div className="space-y-3">
                        {/* Quick Sale */}
                        <button
                          type="button"
                          onClick={() => handlePriceSelect(priceSuggestions.quick)}
                          className="w-full p-4 bg-white border border-gray-200 rounded-xl hover:border-[#5f6651] hover:shadow-lg transition-all text-left"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="text-sm font-semibold text-gray-900">🚀 Quick Sale</p>
                              <p className="text-xs text-gray-500 mt-1">Sells in ~3 days</p>
                            </div>
                            <p className="text-2xl font-bold text-[#5f6651]">${priceSuggestions.quick}</p>
                          </div>
                          <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-400 w-1/3"></div>
                          </div>
                        </button>

                        {/* Fair Price */}
                        <button
                          type="button"
                          onClick={() => handlePriceSelect(priceSuggestions.fair)}
                          className="w-full p-4 bg-white border-2 border-[#5f6651] rounded-xl shadow-md hover:shadow-lg transition-all text-left"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                <span>⚖️</span> Fair Price
                                <span className="bg-[#5f6651] text-white text-xs px-2 py-0.5 rounded-full">Recommended</span>
                              </p>
                              <p className="text-xs text-gray-500 mt-1">Sells in ~1 week</p>
                            </div>
                            <p className="text-2xl font-bold text-[#5f6651]">${priceSuggestions.fair}</p>
                          </div>
                          <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-yellow-400 w-2/3"></div>
                          </div>
                        </button>

                        {/* Max Value */}
                        <button
                          type="button"
                          onClick={() => handlePriceSelect(priceSuggestions.max)}
                          className="w-full p-4 bg-white border border-gray-200 rounded-xl hover:border-[#5f6651] hover:shadow-lg transition-all text-left"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="text-sm font-semibold text-gray-900">💰 Max Value</p>
                              <p className="text-xs text-gray-500 mt-1">May take 2+ weeks</p>
                            </div>
                            <p className="text-2xl font-bold text-[#5f6651]">${priceSuggestions.max}</p>
                          </div>
                          <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-green-400 w-full"></div>
                          </div>
                        </button>
                      </div>

                      <p className="text-xs text-gray-500 mt-4 pt-4 border-t border-gray-200">
                        💡 Click any option to set your price. You can always adjust it later.
                      </p>
                    </div>
                  )}
                </div>

                {/* Allow Offers Toggle */}
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <label className="text-sm font-semibold text-gray-900">Allow Offers</label>
                      <p className="text-xs text-gray-600 mt-1">Let buyers make offers on your item</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAllowOffers(!allowOffers)}
                      className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                        allowOffers ? 'bg-[#5f6651]' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                          allowOffers ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!isFormComplete}
                  className={`w-full px-8 py-4 rounded-full font-semibold text-lg transition-all ${
                    submitted
                      ? 'bg-green-500 text-white'
                      : isFormComplete
                      ? 'bg-[#5f6651] text-white hover:bg-[#4a5040]'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {submitted ? '✓ Item Listed!' : 'List Item'}
                </button>
              </form>
            </div>

            {/* Sidebar */}
            <div>
              {/* Tips Section */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 mb-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Listing Tips</h2>
                <ul className="space-y-4 text-sm text-gray-600">
                  <li className="flex gap-3">
                    <svg className="w-5 h-5 text-[#5f6651] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Use clear, descriptive titles that help buyers find your item</span>
                  </li>
                  <li className="flex gap-3">
                    <svg className="w-5 h-5 text-[#5f6651] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Add high-quality photos from different angles</span>
                  </li>
                  <li className="flex gap-3">
                    <svg className="w-5 h-5 text-[#5f6651] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Be honest about condition to avoid returns</span>
                  </li>
                  <li className="flex gap-3">
                    <svg className="w-5 h-5 text-[#5f6651] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Price competitively by checking similar items</span>
                  </li>
                </ul>
              </div>

              {/* Fee Info Section */}
              <div className="bg-[#5f6651]/5 rounded-2xl p-6 border border-[#5f6651]/20">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Earnings Calculator</h2>
                
                {earnings ? (
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                      <span className="text-gray-600">Item Price</span>
                      <span className="font-semibold text-gray-900">${earnings.price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                      <span className="text-gray-600">Platform Fee</span>
                      <span className="font-semibold text-gray-700">8%</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                      <span className="text-gray-600">Payment Processing</span>
                      <span className="font-semibold text-gray-700">3% + $0.30</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 bg-[#5f6651]/10 p-3 rounded-lg">
                      <span className="font-bold text-gray-900">You Earn</span>
                      <div className="text-right">
                        <p className="text-xl font-bold text-[#5f6651]">${earnings.earnings.toFixed(2)}</p>
                        <p className="text-xs text-gray-500 mt-1">{earnings.earnPercentage}% of sale price</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 text-sm opacity-60">
                    <p className="text-gray-500 text-sm mb-4 font-medium">📊 Example: $100 sale</p>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                      <span className="text-gray-600">Item Price</span>
                      <span className="font-semibold text-gray-900">$100.00</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                      <span className="text-gray-600">Platform Fee</span>
                      <span className="font-semibold text-gray-700">8%</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                      <span className="text-gray-600">Payment Processing</span>
                      <span className="font-semibold text-gray-700">3% + $0.30</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 bg-[#5f6651]/10 p-3 rounded-lg">
                      <span className="font-bold text-gray-900">You Earn</span>
                      <div className="text-right">
                        <p className="text-xl font-bold text-[#5f6651]">$88.70</p>
                        <p className="text-xs text-gray-500 mt-1">89% of sale price</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-900 font-medium">💡 Pro Tip</p>
                  <p className="text-xs text-blue-800 mt-1">Items priced $100+ ship free, increasing buyer confidence</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
