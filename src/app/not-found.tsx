'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Wrong Page PNG - Big and wide */}
      <div className="w-1/2 mb-4 relative" style={{ aspectRatio: '16/9' }}>
        <Image
          src="/images/Wrong Page.png"
          alt="Wrong Page"
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Small Wrong Club Logo */}
      <div className="w-16 h-16 mx-auto relative mb-3">
        <Image
          src="/images/Wrong Club Logo.png"
          alt="Wrong Club"
          fill
          className="object-contain"
        />
      </div>

      {/* Error 404 */}
      <p className="text-2xl font-bold text-gray-900 mb-4">Error 404</p>

      {/* CTA Buttons */}
      <div className="flex gap-3 justify-center">
        <Link
          href="/"
          className="px-6 py-2 bg-[#5f6651] text-white rounded-full font-bold hover:bg-[#4a5040] transition-colors text-sm"
        >
          Home
        </Link>
        <Link
          href="/browse"
          className="px-6 py-2 border-2 border-[#5f6651] text-[#5f6651] rounded-full font-bold hover:bg-[#5f6651] hover:text-white transition-colors text-sm"
        >
          Browse
        </Link>
      </div>
    </div>
  )
}
