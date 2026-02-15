'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

interface OfferSheetProps {
  isOpen: boolean
  onClose: () => void
  productId: string
}

export function OfferSheet({ isOpen, onClose, productId }: OfferSheetProps) {
  const [offerAmount, setOfferAmount] = useState('')

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle offer submission
    console.log('Offer submitted:', offerAmount)
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 bg-black transition-opacity"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl p-6 max-w-md mx-auto w-full transition-transform"
        style={{
          transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
          transitionDuration: '0.3s',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        {/* Drag Handle */}
        <div className="flex justify-center mb-4">
          <div
            className="w-8 h-1 bg-gray-300 rounded-full"
            style={{ cursor: 'grab' }}
          />
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-center mb-6 text-[var(--charcoal)]">
          Make an Offer
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Input */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[40px] font-bold text-[var(--brand)] pointer-events-none">
              $
            </div>
            <input
              type="number"
              placeholder="0.00"
              value={offerAmount}
              onChange={(e) => setOfferAmount(e.target.value)}
              className="w-full pl-16 pr-4 py-4 text-center text-[40px] font-bold text-[var(--charcoal)] bg-[var(--sand-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:ring-offset-0"
              step="0.01"
              min="0"
            />
          </div>

          {/* Hint Text */}
          <p className="text-xs text-[var(--slate)] text-center">
            Seller will receive your offer and can accept, counter, or decline
          </p>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!offerAmount}
            className="w-full py-3 bg-[var(--brand)] text-white font-medium rounded-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--brand-dark)]"
          >
            Send Offer
          </button>

          {/* Cancel */}
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 border border-[var(--border)] text-[var(--charcoal)] font-medium rounded-lg transition-all active:scale-95 hover:bg-[var(--sand-light)]"
          >
            Cancel
          </button>
        </form>
      </div>
    </>
  )
}
