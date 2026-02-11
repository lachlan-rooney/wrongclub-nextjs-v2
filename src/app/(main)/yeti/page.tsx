'use client'

import Link from 'next/link'
import Image from 'next/image'

const yetiProducts = [
  { id: '5', img: '/images/yeti-cooler.png', title: 'Roadie 24 Cooler', price: 27500 },
  { id: '6', img: '/images/yeti-bottle.png', title: 'Rambler 26oz Bottle', price: 4500 },
  { id: '8', img: '/images/yeti-hat.png', title: 'Toile Bucket Hat', price: 4800 },
]

function formatPrice(cents: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100)
}

export default function YetiCollabPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section - Full Width */}
      <div className="w-full bg-gradient-to-r from-[#5f6651] to-[#4a5040] px-6 py-16 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-4xl">🧊</span>
            <div>
              <h1 className="text-4xl font-bold text-white">YETI</h1>
              <p className="text-white opacity-90 text-lg">x Wrong Club</p>
            </div>
          </div>
          <p className="text-white text-base opacity-90 max-w-2xl">
            Keep your gear and beverages at the perfect temperature. Limited edition collaboration featuring YETI's legendary durability and performance combined with exclusive Wrong Club designs.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {/* About Section */}
          <div className="mb-12 p-8 bg-gray-50 rounded-2xl border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">The Collection</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              YETI is the leader in engineered coolers and drinkware designed for the toughest conditions. This exclusive collaboration with Wrong Club brings YETI's premium performance to the golf course and beyond. Every piece combines YETI's legendary durability with distinctive Wrong Club branding.
            </p>
            <p className="text-gray-700 leading-relaxed">
              From insulated coolers to temperature-controlled drinkware, this collection ensures your rounds stay cool and your gear stays protected.
            </p>
          </div>

          {/* Products Grid */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Shop the Collab</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {yetiProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/listing/${product.id}`}
                  className="group block bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all"
                >
                  <div className="aspect-square bg-gray-50 flex items-center justify-center overflow-hidden relative">
                    <Image
                      src={product.img}
                      alt={product.title}
                      fill
                      className="object-contain p-4"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2 group-hover:text-[#5f6651] transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-lg font-bold text-[#5f6651]">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <Link
              href="/browse"
              className="px-8 py-3 bg-[#5f6651] text-white rounded-full font-semibold hover:bg-[#4a5040] transition-colors text-center"
            >
              Browse More Products
            </Link>
            <Link
              href="/about"
              className="px-8 py-3 border-2 border-[#5f6651] text-[#5f6651] rounded-full font-semibold hover:bg-[#5f6651] hover:text-white transition-colors text-center"
            >
              About Wrong Club
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
