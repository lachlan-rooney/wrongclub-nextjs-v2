'use client'

import Link from 'next/link'
import Image from 'next/image'

const walkersProducts = [
  { id: '1', img: '/images/walkers-varsity-jacket.png', title: 'Varsity Jacket', price: 24500 },
  { id: '7', img: '/images/walkers-polo.png', title: 'Shortbread Polo', price: 9500 },
  { id: '12', img: '/images/walkers-rain-jacket.png', title: 'Rain Jacket', price: 29500 },
  { id: '13', img: '/images/walkers-socks.png', title: 'Merino Wool Shortbread Socks', price: 3000 },
  { id: '14', img: '/images/walkers-golf-balls.png', title: 'Shortbread Golf Balls (3-Pack)', price: 1500 },
  { id: '15', img: '/images/walkers-trousers.png', title: 'Golf Trousers - Cream', price: 7500 },
  { id: '16', img: '/images/fairway-fingers.png', title: 'Fairway Fingers Shortbread', price: 500 },
]

function formatPrice(cents: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100)
}

export default function WalkersCollabPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section - Full Width with Poster Image */}
      <div className="w-full relative h-80 md:h-96 overflow-hidden">
        <Image
          src="/images/wrong-club-page.png"
          alt="Walkers Shortbread x Wrong Club"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Main Content */}
      <main className="px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {/* About Section */}
          <div className="mb-12 p-8 bg-gray-50 rounded-2xl border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">The Collection</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              A Walkers Shortbread x Wrong Club collab is, by any sensible measure, completely unnecessary.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Walkers brings generations of shortbread heritage. We bring modern golf mischief and a tendency to ignore good advice. Tartan turns up where it shouldn't. Premium fabrics are asked to do things they were probably never designed for.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              This isn't nostalgia. It just happens to look very good.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Turn up dressed like you might break par, or quietly help yourself to the biscuit tin.
            </p>
          </div>

          {/* Products Grid */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Shop the Collab</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {walkersProducts.map((product) => (
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
