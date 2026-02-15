'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Check } from 'lucide-react'

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
  }
]

interface FormData {
  name: string
  email: string
  street: string
  city: string
  state: string
  zip: string
  shipping: 'standard' | 'express'
  payment: 'card' | 'paypal' | 'apple'
}

export default function CheckoutPage() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    street: '',
    city: '',
    state: 'CA',
    zip: '',
    shipping: 'standard',
    payment: 'card',
  })
  const [loading, setLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    // Hide BottomNav on checkout
    const nav = document.querySelector('[data-bottom-nav]')
    if (nav) nav.setAttribute('hidden', '')
    return () => {
      if (nav) nav.removeAttribute('hidden')
    }
  }, [])

  const item = MOCK_CART_ITEMS[0]
  const subtotal = item.price
  const shippingCost = form.shipping === 'standard' ? (subtotal >= 10000 ? 0 : 595) : 1295
  const protectionFee = Math.ceil(subtotal * 0.05) + 99
  const total = subtotal + shippingCost + protectionFee

  const handleNext = () => {
    if (step === 1 && form.name && form.email && form.street && form.city && form.state && form.zip) {
      setStep(2)
    } else if (step === 2) {
      setStep(3)
    }
  }

  const handlePlaceOrder = async () => {
    setLoading(true)
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false)
      router.push('/checkout/confirmation')
    }, 2000)
  }

  if (!isMounted) return null

  return (
    <div className="min-h-screen bg-var(--off-white)">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-var(--border) z-40">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => step > 1 ? setStep((step - 1) as 1 | 2 | 3) : router.back()}
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold">Checkout</h1>
          </div>

          {/* Progress Bar */}
          <div className="flex gap-1">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`flex-1 h-1 rounded-full transition ${
                  s <= step ? 'bg-var(--brand)' : 'bg-var(--border)'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="pt-24 pb-32 px-4">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Item Summary Card */}
          {step === 1 && (
            <>
              <div className="bg-white rounded-xl p-4 flex gap-4">
                <div className="w-20 h-20 bg-var(--sand-light) rounded-lg flex-shrink-0 flex items-center justify-center text-3xl">
                  🏌️
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-11px text-var(--slate) uppercase font-medium">{item.brand}</p>
                  <p className="font-semibold text-sm mt-1 line-clamp-1">{item.title}</p>
                  <p className="text-xs text-var(--slate) mt-1">{item.condition} • Size {item.size}</p>
                  <p className="text-sm font-bold text-var(--brand) mt-2">${(item.price / 100).toFixed(2)}</p>
                </div>
              </div>

              {/* Address Form */}
              <div className="space-y-3">
                <h2 className="text-sm font-semibold">Shipping Address</h2>

                <input
                  type="text"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 border border-var(--border) rounded-lg text-15px placeholder:text-var(--slate) focus:outline-none focus:ring-1.5 focus:ring-var(--brand)"
                />

                <input
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 border border-var(--border) rounded-lg text-15px placeholder:text-var(--slate) focus:outline-none focus:ring-1.5 focus:ring-var(--brand)"
                />

                <input
                  type="text"
                  placeholder="Street Address"
                  value={form.street}
                  onChange={(e) => setForm({ ...form, street: e.target.value })}
                  className="w-full px-4 py-3 border border-var(--border) rounded-lg text-15px placeholder:text-var(--slate) focus:outline-none focus:ring-1.5 focus:ring-var(--brand)"
                />

                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="City"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full px-4 py-3 border border-var(--border) rounded-lg text-15px placeholder:text-var(--slate) focus:outline-none focus:ring-1.5 focus:ring-var(--brand)"
                  />
                  <input
                    type="text"
                    placeholder="ZIP"
                    value={form.zip}
                    onChange={(e) => setForm({ ...form, zip: e.target.value })}
                    className="w-full px-4 py-3 border border-var(--border) rounded-lg text-15px placeholder:text-var(--slate) focus:outline-none focus:ring-1.5 focus:ring-var(--brand)"
                  />
                </div>

                <select
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  className="w-full px-4 py-3 border border-var(--border) rounded-lg text-15px focus:outline-none focus:ring-1.5 focus:ring-var(--brand)"
                >
                  {US_STATES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* Shipping Method */}
          {step === 2 && (
            <>
              <div className="space-y-2">
                <h2 className="text-sm font-semibold">Shipping Method</h2>

                {/* Standard */}
                <button
                  onClick={() => setForm({ ...form, shipping: 'standard' })}
                  className={`w-full p-4 rounded-lg border-1.5 transition text-left ${
                    form.shipping === 'standard'
                      ? 'border-var(--brand) bg-var(--brand-light)/5'
                      : 'border-var(--border) hover:border-var(--brand)'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-14px">USPS Priority Mail</p>
                      <p className="text-xs text-var(--slate) mt-1">5-7 business days</p>
                    </div>
                    <p className="font-bold text-14px">
                      {shippingCost === 0 ? 'FREE' : `$${(shippingCost / 100).toFixed(2)}`}
                    </p>
                  </div>
                  {form.shipping === 'standard' && <Check className="w-4 h-4 text-var(--brand) mt-3" />}
                </button>

                {/* Express */}
                <button
                  onClick={() => setForm({ ...form, shipping: 'express' })}
                  className={`w-full p-4 rounded-lg border-1.5 transition text-left ${
                    form.shipping === 'express'
                      ? 'border-var(--brand) bg-var(--brand-light)/5'
                      : 'border-var(--border) hover:border-var(--brand)'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-14px">UPS Ground</p>
                      <p className="text-xs text-var(--slate) mt-1">2-3 business days</p>
                    </div>
                    <p className="font-bold text-14px">${(1295 / 100).toFixed(2)}</p>
                  </div>
                  {form.shipping === 'express' && <Check className="w-4 h-4 text-var(--brand) mt-3" />}
                </button>
              </div>

              {/* Payment Methods */}
              <div className="space-y-2">
                <h2 className="text-sm font-semibold">Payment</h2>

                {[
                  { id: 'card', label: 'Credit Card', icon: '💳' },
                  { id: 'paypal', label: 'PayPal', icon: '🅿️' },
                  { id: 'apple', label: 'Apple Pay', icon: '🍎' },
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setForm({ ...form, payment: method.id as any })}
                    className={`w-full p-4 rounded-lg border-1.5 transition text-left flex items-center gap-3 ${
                      form.payment === method.id
                        ? 'border-var(--brand) bg-var(--brand-light)/5'
                        : 'border-var(--border) hover:border-var(--brand)'
                    }`}
                  >
                    <span className="text-xl">{method.icon}</span>
                    <span className="font-medium text-14px">{method.label}</span>
                    {form.payment === method.id && <Check className="w-4 h-4 text-var(--brand) ml-auto" />}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Order Summary */}
          {step === 3 && (
            <div className="bg-white rounded-xl p-4 space-y-4">
              <div className="flex items-start justify-between pb-3 border-b border-var(--border)">
                <div>
                  <p className="text-xs text-var(--slate) uppercase font-medium">{item.brand}</p>
                  <p className="font-medium mt-1 text-14px">{item.title}</p>
                </div>
                <p className="font-bold text-14px">${(item.price / 100).toFixed(2)}</p>
              </div>

              <div className="space-y-2 text-14px">
                <div className="flex justify-between">
                  <span className="text-var(--slate)">Subtotal</span>
                  <span className="font-medium">${(subtotal / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-var(--slate)">Shipping</span>
                  <span className="font-medium">
                    {shippingCost === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      `$${(shippingCost / 100).toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-var(--slate)">Buyer Protection</span>
                  <span className="font-medium">${(protectionFee / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-16px font-bold pt-2 border-t border-var(--border)">
                  <span>Total</span>
                  <span>${(total / 100).toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-xs text-green-700 space-y-1">
                <p className="font-medium">✓ Secure checkout</p>
                <p>Your payment information is encrypted and secure.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fixed Footer Action */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-var(--border) px-4 py-4">
        <button
          onClick={step < 3 ? handleNext : handlePlaceOrder}
          disabled={loading || (step === 1 && (!form.name || !form.email || !form.street || !form.city || !form.state || !form.zip))}
          className="w-full py-4 bg-var(--brand) text-white rounded-lg font-semibold hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : step === 3 ? `Place Order — $${(total / 100).toFixed(2)}` : 'Continue'}
        </button>
      </div>
    </div>
  )
}
