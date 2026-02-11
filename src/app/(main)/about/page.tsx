export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="mb-8 text-center mt-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">About Wrong Club</h1>
            <p className="text-base text-gray-600">America's Golf Apparel Marketplace.</p>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            {/* Mission Section */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Our Mission</h2>
              <p className="text-base text-gray-700 leading-relaxed">
                Wrong Club exists to keep good golf gear flowing between people who care about it.
              </p>
            </section>

            {/* Why Section */}
            <section className="border border-gray-200 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Why Wrong Club?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex gap-2">
                  <span className="text-2xl">🏌️</span>
                  <div>
                    <h3 className="font-bold text-sm text-gray-900">Built by Golfers</h3>
                    <p className="text-sm text-gray-600">Our team lives and breathes golf. We understand what matters to the community.</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="text-2xl">🔒</span>
                  <div>
                    <h3 className="font-bold text-sm text-gray-900">Buyer Protection</h3>
                    <p className="text-sm text-gray-600">Every purchase is protected. We've got your back, always.</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="text-2xl">💰</span>
                  <div>
                    <h3 className="font-bold text-sm text-gray-900">Fair Pricing</h3>
                    <p className="text-sm text-gray-600">No hidden fees. You see what you pay, sellers keep what they earn.</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="text-2xl">⭐</span>
                  <div>
                    <h3 className="font-bold text-sm text-gray-900">Quality Vetted</h3>
                    <p className="text-sm text-gray-600">Every seller is rated by the community. Trust is earned.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* For Buyers/Sellers Section */}
            <section>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-bold text-sm text-gray-900 mb-1 flex items-center gap-2">
                    <span>🛍️</span> For Buyers
                  </h3>
                  <p className="text-sm text-gray-600">
                    It means discovery: curated seller stores, collections from pro shops, exclusive drops, and tools like Caddie AI to help build outfits that actually make sense.
                  </p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-bold text-sm text-gray-900 mb-1 flex items-center gap-2">
                    <span>📦</span> For Sellers
                  </h3>
                  <p className="text-sm text-gray-600">
                    It means control: fast AI-powered listings, custom stores, smart pricing tools, and a reward system that values good taste and consistency—not just volume.
                  </p>
                </div>
              </div>
            </section>

            {/* Story Section */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">The Story</h2>
              <div className="space-y-2 text-sm text-gray-700 leading-relaxed">
                <p>
                  Wrong club started because my girlfriend asked me to clear out the mountain of golf gear in the wardrobe.
                </p>
                
                <p>
                  I tried selling it on Marketplace, but it all got buried between baby strollers and spare plywood. No context. No focus. So I went looking for a golf clothing resale platform and realised there wasn't one.
                </p>
                
                <p>
                  Golf gear has passion and identity baked into it, yet there was nowhere built specifically for trading within the game. Everything was either generic, local pick-up resale or full-price retail. Nothing in between.
                </p>

                <p>
                  So... I built wrong club!
                </p>
              </div>
            </section>

            {/* Values Section */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Values</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-xl mb-1">🤝</h3>
                  <h4 className="font-bold text-sm text-gray-900 mb-1">Trust</h4>
                  <p className="text-sm text-gray-600">
                    We build systems that earn trust. Ratings, buyer protection, and seller accountability are non-negotiable.
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-xl mb-1">⚡</h3>
                  <h4 className="font-bold text-sm text-gray-900 mb-1">Speed</h4>
                  <p className="text-sm text-gray-600">
                    Golfers are busy. We make listing, buying, and shipping as frictionless as possible.
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-xl mb-1">💚</h3>
                  <h4 className="font-bold text-sm text-gray-900 mb-1">Community</h4>
                  <p className="text-sm text-gray-600">
                    We're not just a marketplace. We're building a community of golfers who lift each other up.
                  </p>
                </div>
              </div>
            </section>

            {/* Contact Section */}
            <section className="bg-[#5f6651] text-white rounded-lg p-6 text-center">
              <h2 className="text-2xl font-bold mb-3">Get in Touch</h2>
              <p className="text-base mb-4 opacity-90">
                Have questions? Ideas? Just want to chat about golf? We'd love to hear from you.
              </p>
              <div className="space-y-1">
                <p className="text-sm">
                  <span className="font-semibold">Email:</span> hello@wrongclub.com
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Instagram:</span> @wrongclub
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Twitter:</span> @wrongclub_golf
                </p>
              </div>
            </section>

            {/* Fun Fact */}
            <section className="bg-gray-50 rounded-lg p-5 text-center">
              <p className="text-sm text-gray-700">
                <span className="font-bold">Fun Fact:</span> The name "Wrong Club" comes from a phrase I often shout when I hit too long or too short: <span className="italic">"Shit! Wrong Club"</span>
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
