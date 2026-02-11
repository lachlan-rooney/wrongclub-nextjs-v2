'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'

const yetiProducts = [
  {
    id: 'yeti-1',
    name: 'Roadie 24 Hard Cooler',
    description: 'The ultimate course companion. Keeps ice for days, fits perfectly on the back of any cart. Rotomolded tough.',
    price: 27500,
    image: '/images/yeti-cooler.png',
    featured: true,
    inStock: true,
  },
  {
    id: 'yeti-2',
    name: 'Rambler 26oz Bottle',
    description: 'Keeps drinks cold for 24+ hours',
    price: 4500,
    image: '/images/yeti-bottle.png',
    featured: false,
    inStock: true,
  },
  {
    id: 'yeti-3',
    name: 'Toile Bucket Hat',
    description: 'Mountain landscape print with adjustable chin strap',
    price: 4800,
    image: null,
    featured: false,
    inStock: true,
  },
  {
    id: 'yeti-4',
    name: 'Rambler 20oz Tumbler',
    description: 'MagSlider lid included',
    price: 3800,
    image: null,
    featured: false,
    inStock: true,
  },
  {
    id: 'yeti-5',
    name: 'Hopper Flip 12 Soft Cooler',
    description: 'Leakproof, carry-friendly, perfect for the walking golfer.',
    price: 25000,
    image: null,
    featured: false,
    inStock: false,
    comingSoon: true,
  },
]

function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100)
}

export default function YETICollabPage() {
  const [addedToCart, setAddedToCart] = useState<string | null>(null)

  const handleAddToCart = (productId: string) => {
    setAddedToCart(productId)
    setTimeout(() => setAddedToCart(null), 2000)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] bg-[#2D3436] overflow-hidden">
        {/* Mountain silhouette background */}
        <div className="absolute inset-0">
          {/* First mountain layer */}
          <svg className="absolute bottom-0 w-full h-96 text-[#374244]" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="currentColor" d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,149.3C672,149,768,203,864,208C960,213,1056,171,1152,149.3C1248,128,1344,128,1392,128L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"/>
          </svg>
          
          {/* Second mountain layer */}
          <svg className="absolute bottom-0 w-full h-72 text-[#2C3E2D]" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="currentColor" d="M0,224L60,213.3C120,203,240,181,360,181.3C480,181,600,203,720,197.3C840,192,960,160,1080,165.3C1200,171,1320,213,1380,234.7L1440,256L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"/>
          </svg>
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-24 text-center">
          {/* Logo lockup */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="text-4xl md:text-5xl font-bold text-white">YETI</span>
            <span className="text-3xl text-[#7DCCE0]">×</span>
            <span className="text-4xl md:text-5xl font-bold text-white">Wrong Club</span>
          </div>
          
          {/* Tagline */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Built for the<br />
            <span className="text-[#7DCCE0]">Back Nine</span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
            From mountain courses to coastal links, keep your drinks ice cold 
            through all 18 holes and beyond.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="#collection" 
              className="px-8 py-4 bg-[#7DCCE0] text-[#2D3436] rounded-full font-bold text-lg hover:bg-[#6BC1D5] transition-colors"
            >
              Shop the Collection
            </a>
            <a 
              href="#story" 
              className="px-8 py-4 border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white/10 transition-colors"
            >
              Our Story
            </a>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* 2. THE STORY SECTION */}
      <section id="story" className="py-24 bg-[#F5F6FA]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            
            {/* Image placeholder */}
            <div className="relative">
              <div className="aspect-[4/3] bg-[#2D3436] rounded-2xl overflow-hidden flex items-center justify-center text-8xl">
                🏔️⛳
              </div>
              {/* Ice blue accent */}
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[#7DCCE0] rounded-2xl -z-10" />
            </div>
            
            {/* Story content */}
            <div>
              <p className="text-[#7DCCE0] font-bold uppercase tracking-wider mb-4">The Story</p>
              <h2 className="text-4xl md:text-5xl font-bold text-[#2D3436] mb-6">
                Where Wilderness Meets the Fairway
              </h2>
              <div className="space-y-4 text-lg text-gray-600">
                <p>
                  Some of the world's most breathtaking golf courses sit at the foot of 
                  mountains, carved through forests, and perched on rugged terrain. 
                  These courses demand gear that's as tough as the landscape.
                </p>
                <p>
                  YETI has spent years perfecting drinkware and coolers that survive 
                  the harshest conditions. Wrong Club knows what golfers actually need 
                  on the course. Together, we've created a collection that keeps your 
                  drinks cold from the first tee to the 19th hole.
                </p>
                <p className="font-semibold text-[#2D3436]">
                  Built wild. Played wild.
                </p>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* 3. PRODUCTS SECTION */}
      <section id="collection" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          
          {/* Section header */}
          <div className="text-center mb-16">
            <p className="text-[#7DCCE0] font-bold uppercase tracking-wider mb-4">The Collection</p>
            <h2 className="text-4xl md:text-5xl font-bold text-[#2D3436]">
              Gear Up for Any Course
            </h2>
          </div>
          
          {/* Products grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Product 1 - Roadie 24 Cooler (Featured) */}
            <div className="lg:col-span-2 lg:row-span-2 group">
              <div className="relative h-full bg-[#2D3436] rounded-3xl overflow-hidden p-8 flex flex-col hover:shadow-2xl transition-shadow">
                {/* Badge */}
                <span className="absolute top-6 left-6 px-3 py-1 bg-[#7DCCE0] text-[#2D3436] text-sm font-bold rounded-full">
                  Featured
                </span>
                
                {/* Image */}
                <div className="flex-1 flex items-center justify-center py-8">
                  {yetiProducts[0].image ? (
                    <img 
                      src={yetiProducts[0].image}
                      alt={yetiProducts[0].name}
                      className="max-h-64 object-contain group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="text-8xl">🧊</div>
                  )}
                </div>
                
                {/* Info */}
                <div className="mt-auto">
                  <h3 className="text-2xl font-bold text-white mb-2">{yetiProducts[0].name}</h3>
                  <p className="text-gray-400 mb-4">
                    {yetiProducts[0].description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-[#7DCCE0]">{formatPrice(yetiProducts[0].price)}</span>
                    <button 
                      onClick={() => handleAddToCart(yetiProducts[0].id)}
                      className="px-6 py-3 bg-[#7DCCE0] text-[#2D3436] rounded-full font-bold hover:bg-[#6BC1D5] transition-colors flex items-center gap-2"
                    >
                      {addedToCart === yetiProducts[0].id ? '✓ Added' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Product 2 - Rambler Bottle */}
            <div className="group">
              <div className="bg-[#F5F6FA] rounded-3xl overflow-hidden p-6 h-full flex flex-col hover:shadow-lg transition-shadow">
                <div className="aspect-square flex items-center justify-center mb-4">
                  {yetiProducts[1].image ? (
                    <img 
                      src={yetiProducts[1].image}
                      alt={yetiProducts[1].name}
                      className="max-h-48 object-contain group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="text-7xl">🧊</div>
                  )}
                </div>
                <h3 className="text-xl font-bold text-[#2D3436] mb-1">{yetiProducts[1].name}</h3>
                <p className="text-gray-500 text-sm mb-3">{yetiProducts[1].description}</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-2xl font-bold text-[#2D3436]">{formatPrice(yetiProducts[1].price)}</span>
                  <button 
                    onClick={() => handleAddToCart(yetiProducts[1].id)}
                    className="px-4 py-2 bg-[#2D3436] text-white rounded-full font-medium hover:bg-[#3d4446] transition-colors"
                  >
                    {addedToCart === yetiProducts[1].id ? '✓' : '+'}
                  </button>
                </div>
              </div>
            </div>
            
            {/* Product 3 - Bucket Hat */}
            <div className="group">
              <div className="bg-[#F5F6FA] rounded-3xl overflow-hidden p-6 h-full flex flex-col hover:shadow-lg transition-shadow">
                <div className="aspect-square flex items-center justify-center mb-4">
                  <div className="text-7xl">🧢</div>
                </div>
                <h3 className="text-xl font-bold text-[#2D3436] mb-1">{yetiProducts[2].name}</h3>
                <p className="text-gray-500 text-sm mb-3">{yetiProducts[2].description}</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-2xl font-bold text-[#2D3436]">{formatPrice(yetiProducts[2].price)}</span>
                  <button 
                    onClick={() => handleAddToCart(yetiProducts[2].id)}
                    className="px-4 py-2 bg-[#2D3436] text-white rounded-full font-medium hover:bg-[#3d4446] transition-colors"
                  >
                    {addedToCart === yetiProducts[2].id ? '✓' : '+'}
                  </button>
                </div>
              </div>
            </div>
            
            {/* Product 4 - Tumbler */}
            <div className="group">
              <div className="bg-[#F5F6FA] rounded-3xl overflow-hidden p-6 h-full flex flex-col hover:shadow-lg transition-shadow">
                <div className="aspect-square flex items-center justify-center mb-4">
                  <div className="text-7xl">🥤</div>
                </div>
                <h3 className="text-xl font-bold text-[#2D3436] mb-1">{yetiProducts[3].name}</h3>
                <p className="text-gray-500 text-sm mb-3">{yetiProducts[3].description}</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-2xl font-bold text-[#2D3436]">{formatPrice(yetiProducts[3].price)}</span>
                  <button 
                    onClick={() => handleAddToCart(yetiProducts[3].id)}
                    className="px-4 py-2 bg-[#2D3436] text-white rounded-full font-medium hover:bg-[#3d4446] transition-colors"
                  >
                    {addedToCart === yetiProducts[3].id ? '✓' : '+'}
                  </button>
                </div>
              </div>
            </div>
            
            {/* Product 5 - Soft Cooler */}
            <div className="group md:col-span-2 lg:col-span-2">
              <div className="bg-[#2C3E2D] rounded-3xl overflow-hidden p-8 flex flex-col md:flex-row items-center gap-8 hover:shadow-lg transition-shadow">
                <div className="flex-shrink-0 text-8xl">🎒</div>
                <div className="flex-1 text-center md:text-left">
                  <span className="inline-block px-3 py-1 bg-[#7DCCE0] text-[#2D3436] text-sm font-bold rounded-full mb-3">
                    Coming Soon
                  </span>
                  <h3 className="text-2xl font-bold text-white mb-2">{yetiProducts[4].name}</h3>
                  <p className="text-gray-300 mb-4">
                    {yetiProducts[4].description}
                  </p>
                  <div className="flex items-center justify-center md:justify-start gap-4">
                    <span className="text-3xl font-bold text-[#7DCCE0]">{formatPrice(yetiProducts[4].price)}</span>
                    <button className="px-6 py-3 border-2 border-white text-white rounded-full font-bold hover:bg-white/10 transition-colors">
                      Join Waitlist
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* 4. FEATURES SECTION */}
      <section className="py-24 bg-[#2D3436]">
        <div className="max-w-6xl mx-auto px-6">
          
          {/* Section header */}
          <div className="text-center mb-16">
            <p className="text-[#7DCCE0] font-bold uppercase tracking-wider mb-4">Built Different</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Adventure-Ready Features
            </h2>
          </div>
          
          {/* Features grid */}
          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <div className="text-center p-8">
              <div className="w-20 h-20 bg-[#7DCCE0]/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🧊</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Ice for Days</h3>
              <p className="text-gray-400">
                Our coolers keep ice frozen for up to 3 days. Your post-round beers 
                will be as cold as when you packed them.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="text-center p-8">
              <div className="w-20 h-20 bg-[#7DCCE0]/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🏔️</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Rugged Construction</h3>
              <p className="text-gray-400">
                Rotomolded tough. These products survive bear country, 
                they'll handle your golf cart.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="text-center p-8">
              <div className="w-20 h-20 bg-[#7DCCE0]/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">⛳</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Course Designed</h3>
              <p className="text-gray-400">
                Sized to fit cart cup holders and cooler racks. 
                Every detail considered for the course.
              </p>
            </div>
            
          </div>
        </div>
      </section>

      {/* 5. LIFESTYLE / GALLERY SECTION */}
      <section className="py-24 bg-[#F5F6FA]">
        <div className="max-w-6xl mx-auto px-6">
          
          <div className="text-center mb-16">
            <p className="text-[#7DCCE0] font-bold uppercase tracking-wider mb-4">In The Wild</p>
            <h2 className="text-4xl md:text-5xl font-bold text-[#2D3436]">
              From Tee to Summit
            </h2>
          </div>
          
          {/* Image grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            <div className="aspect-square bg-[#2D3436] rounded-2xl flex items-center justify-center text-4xl col-span-2 row-span-2">
              🏔️⛳
            </div>
            <div className="aspect-square bg-[#374244] rounded-2xl flex items-center justify-center text-4xl">
              🧊
            </div>
            <div className="aspect-square bg-[#2C3E2D] rounded-2xl flex items-center justify-center text-4xl">
              🌲
            </div>
            <div className="aspect-square bg-[#636E72] rounded-2xl flex items-center justify-center text-4xl">
              🍺
            </div>
            <div className="aspect-square bg-[#374244] rounded-2xl flex items-center justify-center text-4xl">
              ⛰️
            </div>
          </div>
          
          {/* Quote */}
          <div className="text-center">
            <blockquote className="text-2xl md:text-3xl font-bold text-[#2D3436] italic max-w-3xl mx-auto">
              "The best rounds are the ones where you forget you're playing golf 
              and just enjoy being outside."
            </blockquote>
            <p className="mt-4 text-gray-500">— Wrong Club Team</p>
          </div>
          
        </div>
      </section>

      {/* 6. FINAL CTA SECTION */}
      <section className="relative py-32 bg-[#2D3436] overflow-hidden">
        {/* Mountain silhouette */}
        <svg className="absolute bottom-0 w-full h-48 text-[#374244]" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="currentColor" d="M0,64L80,96C160,128,320,192,480,192C640,192,800,128,960,122.7C1120,117,1280,171,1360,197.3L1440,224L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"/>
        </svg>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Ready for the<br />
            <span className="text-[#7DCCE0]">Wild Round?</span>
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Limited collaboration. Once they're gone, they're gone. 
            Grab yours before the next tee time.
          </p>
          <a 
            href="#collection" 
            className="inline-block px-10 py-5 bg-[#7DCCE0] text-[#2D3436] rounded-full font-bold text-xl hover:bg-[#6BC1D5] transition-colors"
          >
            Shop YETI × Wrong Club
          </a>
        </div>
      </section>

      {/* 7. FOOTER NOTE */}
      <section className="py-12 bg-[#1a1f20]">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-gray-500 text-sm">
            YETI® is a registered trademark of YETI Coolers, LLC. 
            This collaboration is produced in partnership with YETI.
          </p>
        </div>
      </section>
    </div>
  )
}
