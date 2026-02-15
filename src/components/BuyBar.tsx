'use client'

import { useState } from 'react'
import { OfferSheet } from './OfferSheet'

interface BuyBarProps {
  price: number // in cents
  productId: string
}

export function BuyBar({ price, productId }: BuyBarProps) {
  const [isOfferSheetOpen, setIsOfferSheetOpen] = useState(false)

  const priceUSD = (price / 100).toFixed(2)
  const buyerProtection = (0.70 + (price * 0.05) / 100).toFixed(2)

  return (
    <>
      <div
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--border)]"
        style={{
          backgroundColor: 'rgba(250, 249, 246, 0.95)',
          backdropFilter: 'blur(20px)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
          {/* Price + Subtext */}
          <div className="flex-1">
            <div className="text-[22px] font-bold text-[var(--charcoal)]">
              ${priceUSD}
            </div>
            <div className="text-xs text-[var(--slate)] mt-0.5">
              Buyer protection included
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={() => setIsOfferSheetOpen(true)}
              className="px-5 py-2.5 border-2 border-[var(--brand)] text-[var(--brand)] font-medium text-sm rounded-lg transition-all active:scale-95 hover:bg-[var(--brand)] hover:text-white sm:px-6"
            >
              Offer
            </button>
            <button className="px-5 py-2.5 bg-[var(--brand)] text-white font-medium text-sm rounded-lg transition-all active:scale-95 hover:bg-[var(--brand-dark)] sm:px-6">
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Offer Sheet */}
      <OfferSheet
        isOpen={isOfferSheetOpen}
        onClose={() => setIsOfferSheetOpen(false)}
        productId={productId}
      />

      {/* Spacing for fixed bar */}
      <div className="h-24 sm:h-0" />
    </>
  )
}
