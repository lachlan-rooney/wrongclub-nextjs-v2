'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Sparkles, Cloud, Shirt, Users } from 'lucide-react'
import CaddieChat from '@/components/CaddieChat'

const occasions = [
  {
    id: 'casual',
    title: 'Casual Round',
    icon: Shirt,
    prompt: "I'm going for a casual round of golf with friends. I want to look comfortable and relaxed while playing well.",
    description: 'Comfortable, relaxed, and ready to play',
  },
  {
    id: 'corporate',
    title: 'Corporate Event',
    icon: Users,
    prompt: 'I need an outfit for a corporate golf event or client outing. I want to look professional and impressive.',
    description: 'Professional, polished, and impressive',
  },
  {
    id: 'tournament',
    title: 'Tournament Day',
    icon: Sparkles,
    prompt: 'I have a tournament coming up and want to look sharp and focused. I need an outfit that feels confident and puts me in the zone.',
    description: 'Sharp, confident, and game-ready',
  },
  {
    id: 'rainy',
    title: 'Rainy Day',
    icon: Cloud,
    prompt: 'It looks like rain might be coming. I need an outfit that can handle wet weather while still looking good on the course.',
    description: 'Weather-ready and stylish',
  },
]

export default function CaddiePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [initialPrompt, setInitialPrompt] = useState('')

  // Protect route
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#5f6651]/10 to-transparent">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please log in to access Caddie</p>
          <button
            onClick={() => router.push('/login')}
            className="bg-[#5f6651] text-white px-6 py-2 rounded-lg hover:bg-[#4a5040] transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    )
  }

  const handleOccasionClick = (prompt: string) => {
    setInitialPrompt(prompt)
    setIsOpen(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#5f6651]/5">
      {/* Header/Hero Section */}
      <div className="bg-gradient-to-r from-[#5f6651] to-[#4a5040] text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 mr-3" />
            <h1 className="text-4xl sm:text-5xl font-bold">Caddie AI</h1>
          </div>
          <p className="text-xl text-gray-100 mb-2">Your Personal Golf Style Expert</p>
          <p className="text-gray-200">
            Get AI-powered outfit recommendations tailored to your style and the occasion
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Start Occasions */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Get Started with Quick Occasions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {occasions.map((occasion) => {
              const Icon = occasion.icon
              return (
                <button
                  key={occasion.id}
                  onClick={() => handleOccasionClick(occasion.prompt)}
                  className="group bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-[#5f6651] hover:shadow-lg transition-all"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-[#5f6651]/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#5f6651]/20 transition-colors">
                      <Icon className="w-6 h-6 text-[#5f6651]" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">{occasion.title}</h3>
                    <p className="text-sm text-gray-600">{occasion.description}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Features */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">How Caddie Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="text-3xl font-bold text-[#5f6651] mb-2">1</div>
              <h3 className="font-bold text-gray-900 mb-2">Tell Your Story</h3>
              <p className="text-gray-600">
                Describe the occasion, your style preferences, budget, and what you're looking for
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="text-3xl font-bold text-[#5f6651] mb-2">2</div>
              <h3 className="font-bold text-gray-900 mb-2">AI Recommendations</h3>
              <p className="text-gray-600">
                Caddie AI analyzes your request and curates outfit combinations from our marketplace
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="text-3xl font-bold text-[#5f6651] mb-2">3</div>
              <h3 className="font-bold text-gray-900 mb-2">Shop with Confidence</h3>
              <p className="text-gray-600">
                Click through to view details, save outfits, and add items to your cart
              </p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center mb-12">
          <button
            onClick={() => {
              setInitialPrompt('')
              setIsOpen(true)
            }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#5f6651] to-[#4a5040] text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all hover:scale-105"
          >
            <Sparkles className="w-5 h-5" />
            Start Styling Session
          </button>
        </div>
      </div>

      {/* Chat Modal */}
      <CaddieChat isOpen={isOpen} onClose={() => setIsOpen(false)} initialPrompt={initialPrompt} />
    </div>
  )
}
