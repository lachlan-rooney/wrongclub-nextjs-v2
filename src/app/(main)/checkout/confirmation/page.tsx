'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Check, ArrowRight } from 'lucide-react'

export default function ConfirmationPage() {
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)
  const [orderNum] = useState(() => 
    'WC-' + Math.random().toString(36).substring(2, 9).toUpperCase()
  )

  useEffect(() => {
    setIsMounted(true)
    // Hide BottomNav on confirmation
    const nav = document.querySelector('[data-bottom-nav]')
    if (nav) nav.setAttribute('hidden', '')
    return () => {
      if (nav) nav.removeAttribute('hidden')
    }
  }, [])

  if (!isMounted) return null

  return (
    <div className="min-h-screen bg-var(--off-white) flex flex-col items-center justify-center px-4 py-8">
      <div className="max-w-sm w-full text-center space-y-6">
        {/* Checkmark Animation */}
        <div className="mx-auto">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto animate-pop">
            <Check className="w-10 h-10 text-green-600" strokeWidth={3} />
          </div>
        </div>

        {/* Confirmation Message */}
        <div>
          <h1 className="text-2xl font-bold mb-2">You're on the fairway!</h1>
          <p className="text-var(--slate) text-sm">
            Your order has been confirmed. A confirmation email is on its way.
          </p>
        </div>

        {/* Order Number */}
        <div className="bg-white rounded-xl p-4 border border-var(--border)">
          <p className="text-xs text-var(--slate) uppercase font-medium">Order Number</p>
          <p className="text-lg font-bold mt-2 font-mono">{orderNum}</p>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-xl p-4 space-y-3 text-left text-sm">
          <div className="flex justify-between pb-3 border-b border-var(--border)">
            <span className="text-var(--slate)">Order Date</span>
            <span className="font-medium">{new Date().toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between pb-3 border-b border-var(--border)">
            <span className="text-var(--slate)">Estimated Delivery</span>
            <span className="font-medium">5-7 business days</span>
          </div>
          <div className="flex justify-between">
            <span className="text-var(--slate)">Shipping To</span>
            <span className="font-medium">Saved Address</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={() => router.push('/browse')}
            className="w-full py-3 bg-var(--brand) text-white rounded-lg font-semibold hover:bg-opacity-90 transition flex items-center justify-center gap-2"
          >
            Continue Shopping
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => router.push('/profile/orders')}
            className="w-full py-3 border-1.5 border-var(--brand) text-var(--brand) rounded-lg font-semibold hover:bg-var(--brand-light)/5 transition"
          >
            Track Order
          </button>
        </div>

        {/* Support Note */}
        <p className="text-xs text-var(--slate) pt-4">
          Questions? <Link href="/messages" className="text-var(--brand) hover:underline">
            Contact seller
          </Link>
        </p>
      </div>
    </div>
  )
}
