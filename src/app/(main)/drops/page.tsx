'use client'

import Link from 'next/link'
import Image from 'next/image'

const drops = [
  {
    id: '1',
    status: 'Dropping in 2 days',
    brand: 'Walkers Shortbread x Wrong Club',
    title: 'Tartan Collection',
    description: 'Scottish-inspired golf apparel featuring authentic tartan patterns and premium wool blends.',
    emoji: '🧥',
    poster: '/images/Walkers-drops-poster.png',
  },
  {
    id: '2',
    status: 'Available Now',
    brand: 'YETI x Wrong Club',
    title: 'Fairway Cooler Series',
    description: 'Keep your drinks cold for 18+ holes with our limited edition cooler bags and accessories.',
    emoji: '🧊',
    poster: '/images/Yeti Header.png',
  },
  {
    id: '3',
    status: 'Available Now',
    brand: 'Wrong Club Originals',
    title: 'Red Snappers Premium Tees',
    description: 'Our signature wooden tees. The only tee that matters. Limited first run.',
    emoji: '⛳',
    poster: null,
  },
  {
    id: '4',
    status: 'Coming Soon',
    brand: 'Vinamilk x Wrong Club',
    title: 'First Tee Vietnam',
    description: 'Nourishing the next generation of Vietnamese golf. Premium apparel with 100% profits funding youth development.',
    emoji: '🥛',
    poster: '/images/Wrong Club - Collab Card Headers.png',
  },
]

export default function DropsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section - Full Width Green Background */}
      <div className="w-full bg-[#5f6651] px-6 py-12 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-4xl">🔥</span>
            <h1 className="text-4xl font-bold text-white">Exclusive Drops</h1>
          </div>
          <p className="text-white text-base opacity-90">Limited edition collabs and curated releases</p>
        </div>
      </div>

      {/* Drops Grid */}
      <main className="px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {drops.map((drop) => (
              <div
                key={drop.id}
                className="flex flex-col bg-gray-50 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow group"
              >
                {/* Drop Image with Status Badge */}
                <Link href={drop.id === '1' ? '/drops/walkers' : drop.id === '2' ? '/drops/yeti' : drop.id === '4' ? '/drops/vinamilk' : '/browse'} className="relative w-full h-40 bg-gray-200 flex items-center justify-center overflow-hidden block">
                  {drop.poster ? (
                    <Image
                      src={drop.poster}
                      alt={drop.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="text-5xl group-hover:scale-110 transition-transform duration-300">
                      {drop.emoji}
                    </div>
                  )}
                  {/* Status Badge - Positioned on Image */}
                  <div className="absolute top-4 right-4 z-20">
                    <span className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-gray-800 text-white">
                      {drop.status}
                    </span>
                  </div>
                </Link>

                {/* Drop Content */}
                <div className="p-4 flex-1 flex flex-col">
                  <h2 className="text-xs font-semibold text-gray-600 uppercase tracking-widest mb-2">
                    {drop.brand}
                  </h2>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
                    {drop.title}
                  </h3>
                  <p className="text-gray-600 text-xs leading-relaxed flex-1 mb-4">
                    {drop.description}
                  </p>

                  {/* View Collection Button */}
                  <Link
                    href={drop.id === '1' ? '/drops/walkers' : drop.id === '2' ? '/drops/yeti' : drop.id === '4' ? '/drops/vinamilk' : '/browse'}
                    className="w-full py-2 bg-[#5f6651] text-white text-center rounded-lg font-semibold text-sm hover:bg-[#4a5040] transition-colors"
                  >
                    View Collection
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
