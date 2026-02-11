'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Send, Search, Plus, ArrowLeft } from 'lucide-react'

interface Participant {
  id: string
  name: string
  username: string
  avatar_url: string | null
}

interface Listing {
  id: string
  title: string
  price: number
  image_url: string | null
}

interface Message {
  id: string
  content: string
  sent_at: string
  sender_is_me: boolean
}

interface Conversation {
  id: string
  participant: Participant
  listing: Listing
  order_id: string | null
  type: 'buying' | 'selling'
  unread_count: number
  last_message: {
    content: string
    sent_at: string
    sender_is_me: boolean
  }
}

const mockConversations: Conversation[] = [
  {
    id: 'conv1',
    participant: {
      id: 'u1',
      name: 'James T.',
      username: 'golfpro99',
      avatar_url: null,
    },
    listing: {
      id: 'l1',
      title: 'FootJoy Premieres',
      price: 16500,
      image_url: null,
    },
    order_id: 'WC-2026-54321',
    type: 'selling',
    unread_count: 2,
    last_message: {
      content: "What's the pit-to-pit measurement on this?",
      sent_at: '2026-01-20T14:30:00Z',
      sender_is_me: false,
    },
  },
  {
    id: 'conv2',
    participant: {
      id: 'u2',
      name: 'Mike P.',
      username: 'mikep',
      avatar_url: null,
    },
    listing: {
      id: 'l2',
      title: 'Good Good Rope Hat',
      price: 3800,
      image_url: null,
    },
    order_id: 'WC-2026-12345',
    type: 'buying',
    unread_count: 0,
    last_message: {
      content: 'Shipped! Here\'s your tracking number: 1Z999AA10123456784',
      sent_at: '2026-01-19T10:00:00Z',
      sender_is_me: false,
    },
  },
  {
    id: 'conv3',
    participant: {
      id: 'u3',
      name: 'Sarah L.',
      username: 'sarahgolf',
      avatar_url: null,
    },
    listing: {
      id: 'l3',
      title: 'Malbon Bucket Hat',
      price: 5800,
      image_url: null,
    },
    order_id: null,
    type: 'selling',
    unread_count: 0,
    last_message: {
      content: 'Thanks for the quick response! I\'ll think about it.',
      sent_at: '2026-01-17T16:20:00Z',
      sender_is_me: false,
    },
  },
]

const mockMessages: Record<string, Message[]> = {
  conv1: [
    {
      id: 'm1',
      content: 'Hi! I\'m interested in the FootJoy Premieres. Are they still available?',
      sent_at: '2026-01-20T14:00:00Z',
      sender_is_me: false,
    },
    {
      id: 'm2',
      content: 'Yes, they\'re still available! They\'re in great condition, only worn a few times.',
      sent_at: '2026-01-20T14:15:00Z',
      sender_is_me: true,
    },
    {
      id: 'm3',
      content: 'What\'s the pit-to-pit measurement on this?',
      sent_at: '2026-01-20T14:30:00Z',
      sender_is_me: false,
    },
  ],
  conv2: [
    {
      id: 'm4',
      content: 'Just purchased! Can\'t wait to get it.',
      sent_at: '2026-01-18T15:00:00Z',
      sender_is_me: true,
    },
    {
      id: 'm5',
      content: 'Thanks for the purchase! I\'ll ship it out tomorrow.',
      sent_at: '2026-01-18T15:30:00Z',
      sender_is_me: false,
    },
    {
      id: 'm6',
      content: 'Shipped! Here\'s your tracking number: 1Z999AA10123456784',
      sent_at: '2026-01-19T10:00:00Z',
      sender_is_me: false,
    },
  ],
  conv3: [
    {
      id: 'm7',
      content: 'Is this hat adjustable?',
      sent_at: '2026-01-17T15:00:00Z',
      sender_is_me: false,
    },
    {
      id: 'm8',
      content: 'Yes, it has an adjustable strap at the back. One size fits most!',
      sent_at: '2026-01-17T15:45:00Z',
      sender_is_me: true,
    },
    {
      id: 'm9',
      content: 'Thanks for the quick response! I\'ll think about it.',
      sent_at: '2026-01-17T16:20:00Z',
      sender_is_me: false,
    },
  ],
}

function formatMessageTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

function formatRelativeTime(dateString: string): string {
  const now = new Date()
  const date = new Date(dateString)
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHours / 24)

  if (diffHours < 1) return 'Just now'
  if (diffHours < 24) return `${diffHours}h`
  if (diffDays < 7) return `${diffDays}d`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function groupMessagesByDate(messages: Message[]): Record<string, Message[]> {
  const groups: Record<string, Message[]> = {}
  const today = new Date().toDateString()
  const yesterday = new Date(Date.now() - 86400000).toDateString()

  messages.forEach((msg) => {
    const msgDate = new Date(msg.sent_at).toDateString()
    let key = msgDate
    if (msgDate === today) key = 'Today'
    else if (msgDate === yesterday) key = 'Yesterday'
    else
      key = new Date(msg.sent_at).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
      })

    if (!groups[key]) groups[key] = []
    groups[key].push(msg)
  })

  return groups
}

function getAvatarInitial(name: string): string {
  return name.charAt(0).toUpperCase()
}

function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100)
}

export default function MessagesPage() {
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'buying' | 'selling'>('all')
  const [messageInput, setMessageInput] = useState('')
  const [conversations, setConversations] = useState(mockConversations)
  const [messages, setMessages] = useState(mockMessages)
  const [isMobile, setIsMobile] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [selectedConvId, messages])

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch =
      conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.participant.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.listing.title.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter =
      filterType === 'all' || conv.type === filterType

    return matchesSearch && matchesFilter
  })

  const selectedConversation = conversations.find((c) => c.id === selectedConvId)
  const currentMessages = selectedConvId ? messages[selectedConvId] || [] : []

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConvId) return

    const newMessage: Message = {
      id: `m${Date.now()}`,
      content: messageInput,
      sent_at: new Date().toISOString(),
      sender_is_me: true,
    }

    setMessages((prev) => ({
      ...prev,
      [selectedConvId]: [...(prev[selectedConvId] || []), newMessage],
    }))

    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === selectedConvId
          ? {
              ...conv,
              last_message: {
                content: messageInput,
                sent_at: new Date().toISOString(),
                sender_is_me: true,
              },
            }
          : conv
      )
    )

    setMessageInput('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (isMobile && selectedConvId) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Mobile Chat Header */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <button
            onClick={() => setSelectedConvId(null)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">
              {selectedConversation?.participant.name}
            </h3>
            <p className="text-xs text-gray-500">
              @{selectedConversation?.participant.username}
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {Object.entries(groupMessagesByDate(currentMessages)).map(
            ([date, msgs]) => (
              <div key={date}>
                <div className="flex justify-center mb-4">
                  <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {date}
                  </span>
                </div>
                {msgs.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sender_is_me ? 'justify-end' : 'justify-start'
                    } mb-2`}
                  >
                    <div
                      className={`max-w-xs rounded-2xl px-4 py-2 ${
                        msg.sender_is_me
                          ? 'bg-[#5f6651] text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          msg.sender_is_me
                            ? 'text-gray-100'
                            : 'text-gray-500'
                        }`}
                      >
                        {formatMessageTime(msg.sent_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200 sticky bottom-0 bg-white">
          <div className="flex gap-2">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f6651]"
            />
            <button
              onClick={handleSendMessage}
              disabled={!messageInput.trim()}
              className="bg-[#5f6651] text-white p-2 rounded-lg hover:bg-[#4a5040] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Page Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
        <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
        <button className="flex items-center gap-2 bg-[#5f6651] text-white px-4 py-2 rounded-lg hover:bg-[#4a5040] transition-colors">
          <Plus className="w-5 h-5" />
          <span>New Message</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-80 border-r border-gray-200 flex flex-col bg-white">
          {/* Search Bar */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f6651]"
              />
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 px-4 pt-4 border-b border-gray-200">
            {(['all', 'buying', 'selling'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterType(tab)}
                className={`px-3 py-2 text-sm font-medium rounded-lg capitalize transition-colors ${
                  filterType === tab
                    ? 'bg-[#5f6651] text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                <span>No conversations found</span>
              </div>
            ) : (
              filteredConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConvId(conv.id)}
                  className={`w-full p-4 border-b border-gray-100 text-left hover:bg-gray-50 transition-colors ${
                    selectedConvId === conv.id ? 'bg-gray-50 border-l-4 border-l-[#5f6651]' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Unread Indicator */}
                    {conv.unread_count > 0 && (
                      <div className="w-3 h-3 rounded-full bg-[#0072BC] mt-1.5 flex-shrink-0" />
                    )}
                    {conv.unread_count === 0 && (
                      <div className="w-3 h-3 rounded-full bg-gray-300 mt-1.5 flex-shrink-0" />
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="font-medium text-gray-900 truncate">
                          {conv.participant.name}
                        </p>
                        <span className="text-xs text-gray-500 flex-shrink-0">
                          {formatRelativeTime(conv.last_message.sent_at)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 truncate mb-1.5">
                        {conv.listing.title}
                      </p>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {conv.last_message.content}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right Panel - Chat */}
        {selectedConversation ? (
          <div className="flex-1 flex flex-col bg-white">
            {/* Chat Header */}
            <div className="p-6 border-b border-gray-200 flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-full bg-[#5f6651] text-white flex items-center justify-center font-semibold">
                    {getAvatarInitial(selectedConversation.participant.name)}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {selectedConversation.participant.name}
                    </h2>
                    <p className="text-sm text-gray-600">
                      @{selectedConversation.participant.username}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-3">
                  Re: {selectedConversation.listing.title}
                  {selectedConversation.order_id && (
                    <span> • Order #{selectedConversation.order_id}</span>
                  )}
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/listing/${selectedConversation.listing.id}`}
                  className="text-sm text-[#5f6651] hover:underline font-medium"
                >
                  View Listing
                </Link>
                <Link
                  href={`/profile/${selectedConversation.participant.id}`}
                  className="text-sm text-[#5f6651] hover:underline font-medium"
                >
                  View Profile
                </Link>
              </div>
            </div>

            {/* Listing Context Card */}
            <div className="px-6 py-4">
              <div className="border border-gray-200 rounded-lg p-4 flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🏌️</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">
                    {selectedConversation.listing.title}
                  </p>
                  <p className="text-sm text-gray-600">
                    {formatPrice(selectedConversation.listing.price)}
                  </p>
                </div>
                <Link
                  href={`/listing/${selectedConversation.listing.id}`}
                  className="text-sm text-[#5f6651] hover:underline font-medium flex-shrink-0"
                >
                  View
                </Link>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {Object.entries(groupMessagesByDate(currentMessages)).map(
                ([date, msgs]) => (
                  <div key={date}>
                    <div className="flex justify-center mb-4">
                      <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {date}
                      </span>
                    </div>
                    {msgs.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${
                          msg.sender_is_me ? 'justify-end' : 'justify-start'
                        } mb-3`}
                      >
                        <div
                          className={`max-w-md rounded-2xl px-4 py-2 ${
                            msg.sender_is_me
                              ? 'bg-[#5f6651] text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                          <p
                            className={`text-xs mt-1 ${
                              msg.sender_is_me
                                ? 'text-gray-100'
                                : 'text-gray-500'
                            }`}
                          >
                            {msg.sender_is_me ? 'You' : selectedConversation.participant.name} •{' '}
                            {formatMessageTime(msg.sent_at)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-6 border-t border-gray-200 sticky bottom-0 bg-white">
              <div className="flex gap-2">
                <textarea
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  rows={3}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f6651] resize-none"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                  className="bg-[#5f6651] text-white px-4 py-2 rounded-lg hover:bg-[#4a5040] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 font-medium h-fit"
                >
                  <Send className="w-5 h-5" />
                  <span>Send</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-white text-gray-500">
            <span className="text-5xl mb-4">💬</span>
            <p className="text-lg font-medium">Select a conversation</p>
            <p className="text-sm">to start messaging</p>
          </div>
        )}
      </div>
    </div>
  )
}
