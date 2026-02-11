'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface CheckoutData {
  shippingData: {
    fullName: string
    email: string
    phone: string
    address1: string
    address2: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  shippingMethod: string
  cartItems: Array<{
    id: string
    title: string
    size: string
    condition: string
    price: number
    seller: { username: string }
  }>
  orderNumber: string
  orderTotal: number
  subtotal: number
  shippingCost: number
  timestamp: string
}

export default function ConfirmationPage() {
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null)

  useEffect(() => {
    const data = sessionStorage.getItem('checkoutData')
    if (data) {
      setCheckoutData(JSON.parse(data))
      sessionStorage.removeItem('checkoutData')
    }
  }, [])

  if (!checkoutData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Loading order confirmation...</p>
        </div>
      </div>
    )
  }

  const deliveryDate = (() => {
    const days = checkoutData.shippingMethod === 'express' ? [2, 3] : [5, 7]
    const today = new Date()
    const start = new Date(today)
    start.setDate(start.getDate() + days[0])
    const end = new Date(today)
    end.setDate(end.getDate() + days[1])
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
  })()

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
          <p className="text-lg text-gray-600 mb-2">Thank you for your purchase</p>
          <p className="text-gray-600">A confirmation email has been sent to <span className="font-semibold">{checkoutData.shippingData.email}</span></p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          {/* Order Number */}
          <div className="bg-[#5f6651] text-white p-6 text-center">
            <p className="text-sm opacity-90">Order Number</p>
            <p className="text-2xl font-bold font-mono">{checkoutData.orderNumber}</p>
          </div>

          {/* Items Section */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="font-bold text-lg mb-4">ITEMS ORDERED</h2>
            <div className="space-y-4">
              {checkoutData.cartItems.map(item => (
                <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className="text-3xl">🏌️</div>
                  <div className="flex-1">
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-sm text-gray-600">Size: {item.size}</p>
                    <p className="text-sm text-gray-600">Seller: @{item.seller.username}</p>
                  </div>
                  <p className="font-bold">${(item.price / 100).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="font-bold text-lg mb-4">SHIPPING TO</h2>
            <div className="text-gray-700 space-y-1 text-sm">
              <p className="font-semibold">{checkoutData.shippingData.fullName}</p>
              <p>{checkoutData.shippingData.address1}</p>
              {checkoutData.shippingData.address2 && <p>{checkoutData.shippingData.address2}</p>}
              <p>{checkoutData.shippingData.city}, {checkoutData.shippingData.state} {checkoutData.shippingData.zipCode}</p>
              <p>{checkoutData.shippingData.country}</p>
              <p className="font-semibold mt-3 text-gray-900">Estimated Delivery: {deliveryDate}</p>
            </div>
          </div>

          {/* Order Total */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>ORDER TOTAL</span>
              <span>${(checkoutData.orderTotal / 100).toFixed(2)}</span>
            </div>
          </div>

          {/* What Happens Next */}
          <div className="p-6 bg-gray-50">
            <h2 className="font-bold text-lg mb-4">What happens next?</h2>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex gap-3">
                <span className="text-xl">📦</span>
                <p><span className="font-semibold">Sellers will ship within 2-3 days</span></p>
              </div>
              <div className="flex gap-3">
                <span className="text-xl">📧</span>
                <p><span className="font-semibold">You'll receive tracking info via email</span></p>
              </div>
              <div className="flex gap-3">
                <span className="text-xl">✅</span>
                <p><span className="font-semibold">Once delivered, confirm receipt</span></p>
              </div>
              <div className="flex gap-3">
                <span className="text-xl">💰</span>
                <p><span className="font-semibold">Funds released to sellers</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          <Link href="/browse" className="flex-1">
            <button className="w-full bg-[#5f6651] text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition">
              Continue Shopping
            </button>
          </Link>
          <button className="flex-1 border border-[#5f6651] text-[#5f6651] py-3 rounded-lg font-semibold hover:bg-gray-50 transition">
            Track Order
          </button>
        </div>

        {/* Message Sellers */}
        <div className="bg-white rounded-xl p-6 text-center">
          <p className="text-gray-700 mb-4">Questions? Message sellers directly:</p>
          <div className="flex justify-center gap-4 flex-wrap">
            {checkoutData.cartItems.map(item => (
              <Link
                key={item.id}
                href={`/messages?user=${item.seller.username}`}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold transition"
              >
                @{item.seller.username}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
