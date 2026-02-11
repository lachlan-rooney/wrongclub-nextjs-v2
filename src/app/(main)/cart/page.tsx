'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'

function formatPrice(cents: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100)
}

export default function CartPage() {
  const router = useRouter()
  const { cart, removeFromCart } = useStore()
  
  const cartItems = cart.map(item => ({
    id: item.listing.id,
    brand: item.listing.brand || '',
    title: item.listing.title,
    price: item.listing.price,
    size: item.listing.size,
    condition: item.listing.condition,
  }))

  const removeItem = (id: string) => {
    removeFromCart(id)
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0)
  const shipping = subtotal > 10000 ? 0 : 995
  const total = subtotal + shipping

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <main className="px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          {cartItems.length === 0 ? (
            // Empty Cart State
            <div className="py-20 text-center">
              <div className="w-64 h-64 mx-auto mb-8 relative">
                <Image
                  src="/images/empty-golf-cart.png"
                  alt="Golf cart"
                  width={256}
                  height={256}
                  priority
                  quality={100}
                />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">Your cart is empty</h1>
              <p className="text-gray-600 text-lg mb-8">Looks like you haven't added anything yet. Let's find you some great gear!</p>
              <Link
                href="/browse"
                className="inline-block px-8 py-4 bg-[#5f6651] text-white rounded-full font-semibold hover:bg-[#4a5040] transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div>
              {/* Cart Header */}
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900">
                  Shopping Cart
                </h1>
                <p className="text-gray-600 mt-2">
                  {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2">
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-6 p-6 border border-gray-200 rounded-2xl hover:shadow-lg transition-shadow"
                      >
                        {/* Product Image */}
                        <div className="w-24 h-24 rounded-xl bg-gray-100 flex items-center justify-center text-4xl flex-shrink-0">
                          🏌️
                        </div>

                        {/* Product Details */}
                        <div className="flex-1">
                          <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">
                            {item.brand}
                          </p>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {item.title}
                          </h3>
                          <div className="flex gap-4 text-sm text-gray-600 mb-4">
                            {item.size && (
                              <div>
                                <span className="text-gray-500">Size:</span> {item.size}
                              </div>
                            )}
                            {item.condition && (
                              <div>
                                <span className="text-gray-500">Condition:</span> {item.condition}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-2xl font-bold text-[#5f6651]">
                              {formatPrice(item.price)}
                            </p>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Continue Shopping */}
                  <div className="mt-8">
                    <Link
                      href="/browse"
                      className="text-[#5f6651] hover:text-[#4a5040] font-medium flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Continue Shopping
                    </Link>
                  </div>
                </div>

                {/* Order Summary Sidebar */}
                <div>
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 sticky top-24">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                    {/* Breakdown */}
                    <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                      <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span>{formatPrice(subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Shipping</span>
                        <span>
                          {shipping === 0 ? (
                            <span className="text-green-600 font-medium">FREE</span>
                          ) : (
                            formatPrice(shipping)
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Free Shipping Message */}
                    {subtotal <= 10000 && (
                      <div className="mb-6 p-3 bg-blue-50 text-blue-700 text-sm rounded-lg">
                        Add ${formatPrice(10000 - subtotal)} more for free shipping!
                      </div>
                    )}

                    {/* Total */}
                    <div className="mb-6 flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900">Total</span>
                      <span className="text-3xl font-bold text-[#5f6651]">
                        {formatPrice(total)}
                      </span>
                    </div>

                    {/* Checkout Button */}
                    <button 
                      onClick={() => router.push('/checkout')}
                      className="w-full px-6 py-4 bg-[#5f6651] text-white rounded-full font-semibold text-lg hover:bg-[#4a5040] transition-colors mb-3"
                    >
                      Proceed to Checkout
                    </button>

                    {/* Continue Shopping Button */}
                    <Link
                      href="/browse"
                      className="block w-full px-6 py-3 text-center border-2 border-gray-300 text-gray-900 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                    >
                      Continue Shopping
                    </Link>

                    {/* Trust Badges */}
                    <div className="mt-8 pt-6 border-t border-gray-200 space-y-3 text-sm text-gray-600">
                      <div className="flex gap-2">
                        <svg className="w-5 h-5 text-[#5f6651] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Secure checkout</span>
                      </div>
                      <div className="flex gap-2">
                        <svg className="w-5 h-5 text-[#5f6651] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                        <span>Free returns</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
