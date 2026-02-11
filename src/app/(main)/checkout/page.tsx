'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const US_STATES = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
]

const MOCK_CART_ITEMS = [
  {
    id: '1',
    listing_id: '1',
    title: 'Travis Mathew Polo',
    brand: 'Travis Mathew',
    size: 'L',
    condition: 'Like New',
    price: 6500,
    image: null,
    seller: { name: 'Mike P.', username: 'mikep' }
  },
  {
    id: '2',
    listing_id: '3',
    title: 'Good Good Rope Hat',
    brand: 'Good Good',
    size: 'One Size',
    condition: 'New with Tags',
    price: 3800,
    image: null,
    seller: { name: 'Tom B.', username: 'tomb' }
  }
]

type Step = 'shipping' | 'method' | 'payment'

interface FormErrors {
  fullName?: string
  email?: string
  phone?: string
  address1?: string
  city?: string
  state?: string
  zipCode?: string
  cardholderName?: string
  cardNumber?: string
  expiry?: string
  cvc?: string
  terms?: string
}

interface ShippingData {
  fullName: string
  email: string
  phone: string
  address1: string
  address2: string
  city: string
  state: string
  zipCode: string
  country: string
  saveAsDefault: boolean
}

interface PaymentData {
  cardholderName: string
  cardNumber: string
  expiry: string
  cvc: string
  saveCard: boolean
}

export default function CheckoutPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<Step>('shipping')
  const [isProcessing, setIsProcessing] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  const [shippingData, setShippingData] = useState<ShippingData>({
    fullName: '',
    email: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: 'CA',
    zipCode: '',
    country: 'United States',
    saveAsDefault: false,
  })

  const [shippingMethod, setShippingMethod] = useState('standard')
  const [paymentData, setPaymentData] = useState<PaymentData>({
    cardholderName: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
    saveCard: false,
  })
  const [agreeToTerms, setAgreeToTerms] = useState(false)

  const cartItems = MOCK_CART_ITEMS
  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0)
  const FREE_SHIPPING_THRESHOLD = 10000

  const qualifiesForFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD
  const shippingRates = {
    standard: qualifiesForFreeShipping ? 0 : 595,
    express: 1295,
  }
  const shippingCost = shippingRates[shippingMethod as keyof typeof shippingRates] || 595
  const buyerProtectionFee = 99
  const total = subtotal + shippingCost + buyerProtectionFee

  const validateShipping = (): boolean => {
    const newErrors: FormErrors = {}

    if (!shippingData.fullName || shippingData.fullName.trim().length < 2) {
      newErrors.fullName = 'Please enter a valid name'
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(shippingData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/
    if (!phoneRegex.test(shippingData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number'
    }

    if (!shippingData.address1 || shippingData.address1.trim().length < 5) {
      newErrors.address1 = 'Please enter your street address'
    }

    if (!shippingData.city) {
      newErrors.city = 'Please enter a city'
    }

    if (!shippingData.state) {
      newErrors.state = 'Please select a state'
    }

    const zipRegex = /^\d{5}$/
    if (!zipRegex.test(shippingData.zipCode)) {
      newErrors.zipCode = 'Please enter a valid ZIP code'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validatePayment = (): boolean => {
    const newErrors: FormErrors = {}

    if (!paymentData.cardholderName || paymentData.cardholderName.trim().length < 2) {
      newErrors.cardholderName = 'Please enter a valid cardholder name'
    }

    const cardRegex = /^\d{13,19}$/
    if (!cardRegex.test(paymentData.cardNumber.replace(/\s/g, ''))) {
      newErrors.cardNumber = 'Please enter a valid card number'
    }

    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/
    if (!expiryRegex.test(paymentData.expiry)) {
      newErrors.expiry = 'Please enter a valid expiry date (MM/YY)'
    }

    const cvcRegex = /^\d{3,4}$/
    if (!cvcRegex.test(paymentData.cvc)) {
      newErrors.cvc = 'Please enter a valid CVC'
    }

    if (!agreeToTerms) {
      newErrors.terms = 'Please accept the terms to continue'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleContinueToMethod = () => {
    if (validateShipping()) {
      setCurrentStep('method')
      window.scrollTo(0, 0)
    }
  }

  const handleContinueToPayment = () => {
    setCurrentStep('payment')
    window.scrollTo(0, 0)
  }

  const handleEditShipping = () => {
    setCurrentStep('shipping')
    window.scrollTo(0, 0)
  }

  const handleEditMethod = () => {
    setCurrentStep('method')
    window.scrollTo(0, 0)
  }

  const handlePlaceOrder = async () => {
    if (!validatePayment()) {
      return
    }

    setIsProcessing(true)

    // Save checkout data to sessionStorage for confirmation page
    const checkoutData = {
      shippingData,
      shippingMethod,
      paymentData,
      cartItems,
      orderTotal: total,
      subtotal,
      shippingCost,
      buyerProtectionFee,
      orderNumber: `WC-2026-${Math.random().toString().slice(2, 7)}`,
      timestamp: new Date().toISOString(),
    }
    sessionStorage.setItem('checkoutData', JSON.stringify(checkoutData))

    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000))

    setIsProcessing(false)
    router.push('/checkout/confirmation')
  }

  const handleCardNumberChange = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 19)
    const formatted = cleaned.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim()
    setPaymentData({ ...paymentData, cardNumber: formatted })
  }

  const handleExpiryChange = (value: string) => {
    let cleaned = value.replace(/\D/g, '').slice(0, 4)
    if (cleaned.length >= 2) {
      cleaned = cleaned.slice(0, 2) + '/' + cleaned.slice(2)
    }
    setPaymentData({ ...paymentData, expiry: cleaned })
  }

  const handlePhoneChange = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 10)
    let formatted = cleaned
    if (cleaned.length > 0) {
      if (cleaned.length <= 3) {
        formatted = cleaned
      } else if (cleaned.length <= 6) {
        formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`
      } else {
        formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
      }
    }
    setShippingData({ ...shippingData, phone: formatted })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress Indicator */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                currentStep === 'shipping' || currentStep === 'method' || currentStep === 'payment'
                  ? 'bg-[#5f6651] text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                ✓
              </div>
              <span className="text-sm font-medium">Shipping</span>
            </div>
            <div className={`flex-1 h-0.5 mx-4 ${currentStep === 'method' || currentStep === 'payment' ? 'bg-[#5f6651]' : 'bg-gray-200'}`}></div>
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                currentStep === 'method' || currentStep === 'payment'
                  ? 'bg-[#5f6651] text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {currentStep === 'payment' ? '✓' : '2'}
              </div>
              <span className="text-sm font-medium">Shipping Method</span>
            </div>
            <div className={`flex-1 h-0.5 mx-4 ${currentStep === 'payment' ? 'bg-[#5f6651]' : 'bg-gray-200'}`}></div>
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                currentStep === 'payment'
                  ? 'bg-[#5f6651] text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                3
              </div>
              <span className="text-sm font-medium">Review</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Column */}
          <div className="lg:col-span-2">
            {/* STEP 1: SHIPPING */}
            {currentStep === 'shipping' && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold mb-6">Shipping Address</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={shippingData.fullName}
                      onChange={(e) => setShippingData({ ...shippingData, fullName: e.target.value })}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f6651] ${
                        errors.fullName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="John Doe"
                    />
                    {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">Email</label>
                      <input
                        type="email"
                        value={shippingData.email}
                        onChange={(e) => setShippingData({ ...shippingData, email: e.target.value })}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f6651] ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="john@example.com"
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">Phone</label>
                      <input
                        type="tel"
                        value={shippingData.phone}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f6651] ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="(555) 123-4567"
                      />
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">Address Line 1</label>
                    <input
                      type="text"
                      value={shippingData.address1}
                      onChange={(e) => setShippingData({ ...shippingData, address1: e.target.value })}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f6651] ${
                        errors.address1 ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="123 Main Street"
                    />
                    {errors.address1 && <p className="text-red-500 text-sm mt-1">{errors.address1}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">Address Line 2 (Optional)</label>
                    <input
                      type="text"
                      value={shippingData.address2}
                      onChange={(e) => setShippingData({ ...shippingData, address2: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f6651]"
                      placeholder="Apartment, suite, etc."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">City</label>
                      <input
                        type="text"
                        value={shippingData.city}
                        onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f6651] ${
                          errors.city ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="San Francisco"
                      />
                      {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">State</label>
                      <select
                        value={shippingData.state}
                        onChange={(e) => setShippingData({ ...shippingData, state: e.target.value })}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f6651] ${
                          errors.state ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        {US_STATES.map(state => (
                          <option key={state.value} value={state.value}>{state.label}</option>
                        ))}
                      </select>
                      {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">ZIP Code</label>
                    <input
                      type="text"
                      value={shippingData.zipCode}
                      onChange={(e) => setShippingData({ ...shippingData, zipCode: e.target.value.replace(/\D/g, '').slice(0, 5) })}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f6651] ${
                        errors.zipCode ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="94102"
                    />
                    {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="saveAddress"
                      checked={shippingData.saveAsDefault}
                      onChange={(e) => setShippingData({ ...shippingData, saveAsDefault: e.target.checked })}
                      className="rounded border-gray-300"
                    />
                    <label htmlFor="saveAddress" className="text-sm text-gray-700">Save as default address</label>
                  </div>

                  <button
                    onClick={handleContinueToMethod}
                    className="w-full mt-6 bg-[#5f6651] text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition"
                  >
                    Continue to Shipping Method
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: SHIPPING METHOD */}
            {currentStep === 'method' && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold mb-6">Shipping Method</h2>

                <div className="space-y-3 mb-6">
                  {qualifiesForFreeShipping && (
                    <label className="flex items-start gap-4 p-4 border-2 border-green-500 rounded-lg cursor-pointer bg-green-50">
                      <input
                        type="radio"
                        name="shipping"
                        value="standard"
                        checked={shippingMethod === 'standard'}
                        onChange={(e) => setShippingMethod(e.target.value)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">Standard Shipping</span>
                          <span className="text-sm bg-green-600 text-white px-2 py-1 rounded">🎉 Free!</span>
                        </div>
                        <p className="text-sm text-gray-600">5-7 business days</p>
                        <p className="text-xs text-green-700 mt-1">You qualify for free shipping!</p>
                      </div>
                      <div className="text-lg font-semibold">$0.00</div>
                    </label>
                  )}

                  <label className={`flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer ${
                    shippingMethod === 'standard' && !qualifiesForFreeShipping ? 'border-[#5f6651] bg-[#5f6651]/5' : 'border-gray-200'
                  }`}>
                    <input
                      type="radio"
                      name="shipping"
                      value="standard"
                      checked={shippingMethod === 'standard'}
                      onChange={(e) => setShippingMethod(e.target.value)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="font-semibold">Standard Shipping</div>
                      <p className="text-sm text-gray-600">5-7 business days</p>
                    </div>
                    <div className="text-lg font-semibold">${(shippingRates.standard / 100).toFixed(2)}</div>
                  </label>

                  <label className={`flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer ${
                    shippingMethod === 'express' ? 'border-[#5f6651] bg-[#5f6651]/5' : 'border-gray-200'
                  }`}>
                    <input
                      type="radio"
                      name="shipping"
                      value="express"
                      checked={shippingMethod === 'express'}
                      onChange={(e) => setShippingMethod(e.target.value)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="font-semibold">Express Shipping</div>
                      <p className="text-sm text-gray-600">2-3 business days</p>
                    </div>
                    <div className="text-lg font-semibold">${(shippingRates.express / 100).toFixed(2)}</div>
                  </label>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Estimated Delivery:</span> {(() => {
                      const days = shippingMethod === 'express' ? [2, 3] : [5, 7]
                      const today = new Date()
                      const start = new Date(today)
                      start.setDate(start.getDate() + days[0])
                      const end = new Date(today)
                      end.setDate(end.getDate() + days[1])
                      return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                    })()}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleEditShipping}
                    className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
                  >
                    Back to Shipping
                  </button>
                  <button
                    onClick={handleContinueToPayment}
                    className="flex-1 bg-[#5f6651] text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition"
                  >
                    Continue to Review
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: PAYMENT & REVIEW */}
            {currentStep === 'payment' && (
              <div className="space-y-6">
                {/* Payment Form */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="text-2xl font-bold mb-6">Payment Information</h2>

                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">Cardholder Name</label>
                      <input
                        type="text"
                        value={paymentData.cardholderName}
                        onChange={(e) => setPaymentData({ ...paymentData, cardholderName: e.target.value })}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f6651] ${
                          errors.cardholderName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="John Doe"
                      />
                      {errors.cardholderName && <p className="text-red-500 text-sm mt-1">{errors.cardholderName}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">Card Number</label>
                      <input
                        type="text"
                        value={paymentData.cardNumber}
                        onChange={(e) => handleCardNumberChange(e.target.value)}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f6651] font-mono ${
                          errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="4242 4242 4242 4242"
                      />
                      {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1">Expiry (MM/YY)</label>
                        <input
                          type="text"
                          value={paymentData.expiry}
                          onChange={(e) => handleExpiryChange(e.target.value)}
                          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f6651] font-mono ${
                            errors.expiry ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="12/25"
                        />
                        {errors.expiry && <p className="text-red-500 text-sm mt-1">{errors.expiry}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1">CVC</label>
                        <input
                          type="text"
                          value={paymentData.cvc}
                          onChange={(e) => setPaymentData({ ...paymentData, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f6651] font-mono ${
                            errors.cvc ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="123"
                        />
                        {errors.cvc && <p className="text-red-500 text-sm mt-1">{errors.cvc}</p>}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="saveCard"
                        checked={paymentData.saveCard}
                        onChange={(e) => setPaymentData({ ...paymentData, saveCard: e.target.checked })}
                        className="rounded border-gray-300"
                      />
                      <label htmlFor="saveCard" className="text-sm text-gray-700">Save card for future purchases</label>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-1 text-xs text-gray-600 bg-gray-50 p-3 rounded">
                    <span>🔒</span>
                    <span>Secured by Stripe</span>
                  </div>
                </div>

                {/* Review Section */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold mb-4">Review Your Order</h3>

                  <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                    <div>
                      <h4 className="font-semibold mb-2">Shipping Address</h4>
                      <p className="text-sm text-gray-600">
                        {shippingData.fullName}<br />
                        {shippingData.address1}{shippingData.address2 && <><br />{shippingData.address2}</>}<br />
                        {shippingData.city}, {shippingData.state} {shippingData.zipCode}<br />
                        {shippingData.country}
                      </p>
                      <button
                        onClick={handleEditShipping}
                        className="text-[#5f6651] text-sm font-semibold hover:underline mt-2"
                      >
                        Edit
                      </button>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Shipping Method</h4>
                      <p className="text-sm text-gray-600">
                        {shippingMethod === 'standard' ? 'Standard Shipping' : 'Express Shipping'} - ${(shippingCost / 100).toFixed(2)}<br />
                        {(() => {
                          const days = shippingMethod === 'express' ? [2, 3] : [5, 7]
                          const today = new Date()
                          const start = new Date(today)
                          start.setDate(start.getDate() + days[0])
                          const end = new Date(today)
                          end.setDate(end.getDate() + days[1])
                          return `Arrives ${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                        })()}
                      </p>
                      <button
                        onClick={handleEditMethod}
                        className="text-[#5f6651] text-sm font-semibold hover:underline mt-2"
                      >
                        Edit
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="agreeTerms"
                        checked={agreeToTerms}
                        onChange={(e) => setAgreeToTerms(e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <label htmlFor="agreeTerms" className="text-sm text-gray-700">
                        I agree to the <a href="#" className="text-[#5f6651] hover:underline">Terms of Service</a> and <a href="#" className="text-[#5f6651] hover:underline">Privacy Policy</a>
                      </label>
                    </div>
                    {errors.terms && <p className="text-red-500 text-sm">{errors.terms}</p>}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleEditMethod}
                      className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
                    >
                      Back
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={isProcessing}
                      className="flex-1 bg-[#5f6651] text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition disabled:opacity-50"
                    >
                      {isProcessing ? 'Processing...' : 'Place Order'}
                    </button>
                  </div>

                  {isProcessing && (
                    <p className="text-center text-sm text-gray-600 mt-4">
                      Processing your order...
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-20">
              <h3 className="font-bold text-lg mb-4">Order Summary</h3>

              <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                {cartItems.map(item => (
                  <div key={item.id} className="flex gap-3 text-sm">
                    <div className="text-2xl">🏌️</div>
                    <div className="flex-1">
                      <p className="font-medium">{item.title}</p>
                      <p className="text-xs text-gray-600">Size: {item.size} • {item.condition}</p>
                      <p className="text-xs text-gray-600">Seller: @{item.seller.username}</p>
                    </div>
                    <p className="font-semibold">${(item.price / 100).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-sm mb-4 pb-4 border-b border-gray-200">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${(subtotal / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {shippingCost === 0 ? (
                      <span className="text-green-600">Free!</span>
                    ) : (
                      `$${(shippingCost / 100).toFixed(2)}`
                    )}
                  </span>
                </div>
                {shippingCost === 0 && (
                  <div className="text-green-600 text-xs font-medium">
                    🎉 Free shipping applied!
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Buyer Protection</span>
                  <span className="font-medium">${(buyerProtectionFee / 100).toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold mb-6 pb-6 border-b border-gray-200">
                <span>Total</span>
                <span>${(total / 100).toFixed(2)}</span>
              </div>

              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <span>🔒</span>
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🛡️</span>
                  <span>Buyer protection included</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>↩️</span>
                  <span>Easy returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
