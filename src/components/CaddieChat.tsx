'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Send, Sparkles, ShoppingBag, X, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface CaddieMessage {
  id: string
  role: 'user' | 'caddie'
  content: string
  outfits?: CaddieOutfit[]
  timestamp: Date
}

interface CaddieOutfit {
  name: string
  description: string
  styleNotes: string
  items: CaddieItem[]
  totalPrice: number
}

interface CaddieItem {
  id: string
  title: string
  brand: string
  price_cents: number
  image_url: string
  role: string
  why: string
}

interface CaddieChatProps {
  isOpen: boolean
  onClose: () => void
  initialPrompt?: string
  referenceListingId?: string
}

export default function CaddieChat({
  isOpen,
  onClose,
  initialPrompt,
  referenceListingId,
}: CaddieChatProps) {
  const { profile } = useAuth()
  const [messages, setMessages] = useState<CaddieMessage[]>([])
  const [input, setInput] = useState(initialPrompt || '')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const suggestedPrompts = [
    'Build me an outfit for a casual weekend round',
    'I need something for a corporate golf event',
    "What's a good rainy day golf outfit?",
    'Show me some bold, statement pieces',
  ]

  // Initial greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: '1',
          role: 'caddie',
          content: `Hey${profile?.display_name ? ` ${profile.display_name}` : ''}! 👋 I'm Caddie, your personal golf style assistant. Tell me what you're looking for and I'll find the perfect pieces from our marketplace. What kind of look are you going for?`,
          timestamp: new Date(),
        },
      ])
    }
  }, [isOpen, profile])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: CaddieMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/caddie', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: referenceListingId ? 'style_match' : 'outfit_builder',
          prompt: input,
          referenceListingId,
          gender: profile?.gender_preference,
        }),
      })

      const data = await response.json()

      if (data.success && data.outfit) {
        const caddieMessage: CaddieMessage = {
          id: (Date.now() + 1).toString(),
          role: 'caddie',
          content: data.outfit.description || "Here's what I found for you!",
          outfits: data.outfit.outfits,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, caddieMessage])
      } else {
        throw new Error(data.error || 'Failed to get recommendations')
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'caddie',
          content:
            'Sorry, I had trouble finding recommendations. Could you try rephrasing your request?',
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-2xl h-[80vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-[#5f6651] to-[#4a5040]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-white">Caddie AI</h2>
              <p className="text-xs text-white/70">Your personal golf stylist</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] ${message.role === 'user' ? 'order-2' : ''}`}>
                {/* Avatar */}
                {message.role === 'caddie' && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-[#5f6651] rounded-full flex items-center justify-center">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-xs text-gray-500">Caddie</span>
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={`rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-[#5f6651] text-white rounded-br-md'
                      : 'bg-gray-100 text-gray-800 rounded-bl-md'
                  }`}
                >
                  <p>{message.content}</p>
                </div>

                {/* Outfit Cards */}
                {message.outfits && message.outfits.length > 0 && (
                  <div className="mt-4 space-y-4">
                    {message.outfits.map((outfit, i) => (
                      <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                        <div className="p-4 border-b border-gray-100">
                          <h3 className="font-semibold text-gray-900">{outfit.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{outfit.description}</p>
                        </div>

                        {/* Items Grid */}
                        <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {outfit.items.map((item) => (
                            <Link key={item.id} href={`/listing/${item.id}`} className="group">
                              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-2">
                                {item.image_url && (
                                  <img
                                    src={item.image_url}
                                    alt={item.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                  />
                                )}
                              </div>
                              <p className="text-xs text-gray-500 uppercase">{item.brand}</p>
                              <p className="text-sm font-medium truncate">{item.title}</p>
                              <p className="text-sm font-bold text-[#5f6651]">
                                ${(item.price_cents / 100).toFixed(2)}
                              </p>
                              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.why}</p>
                            </Link>
                          ))}
                        </div>

                        {/* Style Notes */}
                        {outfit.styleNotes && (
                          <div className="px-4 pb-4">
                            <div className="p-3 bg-[#5f6651]/5 rounded-lg">
                              <p className="text-sm text-gray-700">
                                <span className="font-medium">💡 Styling tip:</span> {outfit.styleNotes}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Total & Add All */}
                        <div className="px-4 pb-4 flex items-center justify-between">
                          <span className="font-semibold">
                            Total: ${(outfit.totalPrice / 100).toFixed(2)}
                          </span>
                          <button className="flex items-center gap-2 px-4 py-2 bg-[#5f6651] text-white rounded-lg text-sm font-medium hover:bg-[#4a5040]">
                            <ShoppingBag className="w-4 h-4" />
                            Add All
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex items-center gap-2 text-gray-500">
              <div className="w-6 h-6 bg-[#5f6651] rounded-full flex items-center justify-center">
                <Loader2 className="w-3 h-3 text-white animate-spin" />
              </div>
              <span className="text-sm">Caddie is thinking...</span>
            </div>
          )}

          {/* Suggested prompts (show only at start) */}
          {messages.length === 1 && (
            <div className="space-y-2">
              <p className="text-xs text-gray-500 font-medium">Try asking:</p>
              {suggestedPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => setInput(prompt)}
                  className="block w-full text-left px-4 py-3 bg-gray-50 rounded-xl text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  "{prompt}"
                </button>
              ))}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Describe what you're looking for..."
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5f6651]"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="px-4 py-3 bg-[#5f6651] text-white rounded-xl hover:bg-[#4a5040] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
