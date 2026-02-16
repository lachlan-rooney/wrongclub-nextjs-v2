'use client'

import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import CaddieChat from './CaddieChat'

export default function CaddieButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-4 lg:bottom-8 lg:right-8 z-40 w-14 h-14 bg-gradient-to-br from-[#5f6651] to-[#4a5040] text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center group"
      >
        <Sparkles className="w-6 h-6" />
        <span className="absolute right-full mr-3 px-3 py-1.5 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Ask Caddie AI
        </span>
      </button>

      {/* Chat Modal */}
      <CaddieChat isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
