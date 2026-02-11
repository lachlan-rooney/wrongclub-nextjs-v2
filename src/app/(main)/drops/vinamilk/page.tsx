'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Trophy, Droplets, Target, Zap, Users } from 'lucide-react'

const vinamilkProducts = [
  { id: '17', img: '/images/vinamilk-tee.png', title: 'Vinamilk x Wrong Club Tee', price: 8500 },
  { id: '18', img: '/images/vinamilk-longsleeve.png', title: 'Vinamilk x Wrong Club Long Sleeve', price: 9500 },
  { id: '19', img: '/images/vinamilk-trousers.png', title: 'Vinamilk x Wrong Club Trousers', price: 12000 },
  { id: '20', img: '/images/vinamilk-gilet.png', title: 'The Milkman Gilet', price: 11000 },
  { id: '21', img: '/images/vinamilk-candle.png', title: 'The Vanillamilk Candle', price: 1000 },
]

function formatPrice(cents: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100)
}

export default function VinamilkCollabPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section - Full Width with Poster Image */}
      <div className="w-full relative h-80 md:h-96 overflow-hidden">
        <Image
          src="/images/Wrong Club - Collab Card Headers (2000 x 600 px).png"
          alt="Vinamilk x Wrong Club"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Main Content */}
      <main className="px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {/* The Story Section */}
          <div className="mb-16 p-8 bg-[#FFF8E7] rounded-2xl border-2 border-[#0072BC]/20">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0072BC] mb-6">The Story</h2>
            <div className="space-y-4 text-gray-800 leading-relaxed">
              <p>
                When you think of heritage brands that understand performance, quality, and nourishment, Vinamilk stands in a class of its own. For over 47 years, they've been fueling Vietnam's growth with pure, wholesome nutrition. Now, they're stepping onto the fairway.
              </p>
              <p>
                Wrong Club has always believed that golf is more than a game—it's a culture, a community, and a bridge between tradition and innovation. When Vinamilk approached us about bringing youth golf development to Vietnam, the partnership felt inevitable.
              </p>
              <p>
                This collection represents more than premium apparel. It's a commitment to introducing a new generation of Vietnamese golfers to the sport they love. Every piece of clothing carries the DNA of both brands: Vinamilk's dedication to nourishment and health, Wrong Club's irreverent approach to golf culture.
              </p>
              <p className="text-[#0072BC] font-semibold">
                Together, we're nourishing the next generation—body, mind, and swing.
              </p>
            </div>
          </div>

          {/* Products Grid */}
          <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Shop the Collab</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {vinamilkProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/listing/${product.id}`}
                  className="group block bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all"
                >
                  <div className="aspect-square bg-gradient-to-b from-[#FFF8E7] to-white flex items-center justify-center overflow-hidden relative">
                    <Image
                      src={product.img}
                      alt={product.title}
                      fill
                      className="object-contain p-4"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2 group-hover:text-[#0072BC] transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-lg font-bold text-[#0072BC]">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* First Tee Vietnam Initiative Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#0072BC] mb-3">First Tee Vietnam</h2>
              <p className="text-gray-700 text-lg">Youth Golf Development Program</p>
            </div>

            {/* Initiative Details Grid */}
            <div className="grid md:grid-cols-5 gap-6 mb-12">
              <div className="flex flex-col items-center text-center p-6 bg-[#FFF8E7] rounded-xl border border-[#0072BC]/20">
                <div className="w-12 h-12 rounded-full bg-[#0072BC] text-white flex items-center justify-center mb-4">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Free Golf Clinics</h3>
                <p className="text-sm text-gray-700">Weekly sessions at courses across Vietnam</p>
              </div>

              <div className="flex flex-col items-center text-center p-6 bg-[#FFF8E7] rounded-xl border border-[#0072BC]/20">
                <div className="w-12 h-12 rounded-full bg-[#0072BC] text-white flex items-center justify-center mb-4">
                  <Droplets className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Free Vinamilk</h3>
                <p className="text-sm text-gray-700">Nutritious milk provided to all participants</p>
              </div>

              <div className="flex flex-col items-center text-center p-6 bg-[#FFF8E7] rounded-xl border border-[#0072BC]/20">
                <div className="w-12 h-12 rounded-full bg-[#0072BC] text-white flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Putting Greens</h3>
                <p className="text-sm text-gray-700">Pop-up areas at schools and community centers</p>
              </div>

              <div className="flex flex-col items-center text-center p-6 bg-[#FFF8E7] rounded-xl border border-[#0072BC]/20">
                <div className="w-12 h-12 rounded-full bg-[#0072BC] text-white flex items-center justify-center mb-4">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Range Time</h3>
                <p className="text-sm text-gray-700">Subsidized driving range sessions</p>
              </div>

              <div className="flex flex-col items-center text-center p-6 bg-[#FFF8E7] rounded-xl border border-[#0072BC]/20">
                <div className="w-12 h-12 rounded-full bg-[#0072BC] text-white flex items-center justify-center mb-4">
                  <Trophy className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Junior Tournaments</h3>
                <p className="text-sm text-gray-700">Quarterly competitions with prizes</p>
              </div>
            </div>

            {/* Impact Stats */}
            <div className="bg-[#0072BC] text-white rounded-2xl p-8 md:p-12 text-center mb-12">
              <h3 className="text-2xl font-bold mb-8">Program Impact</h3>
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <p className="text-4xl md:text-5xl font-bold mb-2">500+</p>
                  <p className="text-[#FFF8E7] text-lg">Young Golfers Reached</p>
                </div>
                <div>
                  <p className="text-4xl md:text-5xl font-bold mb-2">12</p>
                  <p className="text-[#FFF8E7] text-lg">Partner Courses</p>
                </div>
                <div>
                  <p className="text-4xl md:text-5xl font-bold mb-2">10K+</p>
                  <p className="text-[#FFF8E7] text-lg">Milk Cartons Distributed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Impact Statement */}
          <div className="mb-16 border-l-4 border-[#0072BC] pl-8 py-8">
            <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              100% of profits from this collection fund youth golf development in Vietnam.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              Together, Vinamilk and Wrong Club are nourishing the next generation—body and swing. Every purchase puts a club in a child's hand and nutrition on their table.
            </p>
            <Link
              href="/browse"
              className="inline-block px-8 py-3 bg-[#0072BC] text-white rounded-full font-semibold hover:bg-[#0072BC]/90 transition-colors"
            >
              Shop Now & Make an Impact
            </Link>
          </div>

          {/* Final CTA Section */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12 pt-8 border-t border-gray-200">
            <Link
              href="/browse"
              className="px-8 py-3 bg-[#0072BC] text-white rounded-full font-semibold hover:bg-[#0072BC]/90 transition-colors text-center"
            >
              Browse All Collections
            </Link>
            <Link
              href="/"
              className="px-8 py-3 border-2 border-[#0072BC] text-[#0072BC] rounded-full font-semibold hover:bg-[#0072BC] hover:text-white transition-colors text-center"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
