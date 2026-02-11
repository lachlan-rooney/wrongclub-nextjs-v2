'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

const navItems = [
  {
    label: 'Discover',
    href: '/feed',
    submenu: [
      { icon: '📱', label: 'Feed', description: 'Scroll & shop video content', href: '/feed' },
      { icon: '🔴', label: '19th Hole Live', description: 'Watch live selling events', href: '/live' },
      { icon: '🤖', label: 'Caddie AI', description: 'AI-powered outfit builder', href: '/caddie' },
    ]
  },
  {
    label: 'Shop',
    href: '/browse',
    submenu: [
      { icon: '🛍️', label: 'Browse', description: 'Explore all listings', href: '/browse' },
      { icon: '🔥', label: 'Drops', description: 'Exclusive collabs & releases', href: '/drops' },
      { icon: '⛳', label: 'Courses', description: 'Shop seller storefronts', href: '/courses' },
    ]
  },
  {
    label: 'Sell',
    href: '/sell',
    submenu: [
      { icon: '📝', label: 'Create Listing', description: 'Start selling an item', href: '/sell' },
      { icon: '📊', label: 'My Listings', description: 'Manage your listings', href: '/my-listings' },
      { icon: '📈', label: 'Analytics', description: 'View sales & stats', href: '/analytics' },
    ]
  },
]

export function Header() {
  const { user, setUser, cart, hydrated, setHydrated } = useStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [headerVisible, setHeaderVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  const handleLogOut = async () => {
    setUser(null)
    window.location.href = '/'
  }

  // Initialize hydration flag only
  useEffect(() => {
    setHydrated(true)
  }, [setHydrated])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('[data-user-menu]')) {
        setUserMenuOpen(false)
      }
    }

    if (userMenuOpen) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [userMenuOpen])

  // Handle header hide/show on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY < 50) {
        // At the top - always show
        setHeaderVisible(true)
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down - hide
        setHeaderVisible(false)
      } else {
        // Scrolling up - show
        setHeaderVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 transition-transform duration-300 ease-in-out ${
      headerVisible ? 'translate-y-0' : '-translate-y-full'
    }`}>
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/images/wrong-club-top-left.png"
              alt="Wrong Club"
              width={169}
              height={48}
              priority
              style={{ width: 'auto', height: '48px' }}
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <div 
                key={item.label} 
                className="relative group"
                onMouseEnter={() => item.submenu && setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  className="px-4 py-2 text-brand-green rounded-lg transition-colors flex items-center gap-1"
                >
                  {item.label}
                </button>
                
                {/* Dropdown Menu */}
                {item.submenu && openDropdown === item.label && (
                  <div className="absolute left-0 mt-0 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-[110]">
                    {item.submenu.map((subitem) => (
                      <Link
                        key={subitem.href}
                        href={subitem.href}
                        className="block px-4 py-3 text-sm first:rounded-t-lg last:rounded-b-lg transition-colors"
                        onClick={() => setOpenDropdown(null)}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-lg">{subitem.icon}</span>
                          <div>
                            <div className="font-semibold text-gray-900">{subitem.label}</div>
                            <div className="text-xs text-gray-600">{subitem.description}</div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
                
                {!item.submenu && (
                  <Link
                    href={item.href}
                    className="absolute inset-0 rounded-lg"
                  />
                )}
              </div>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-1">
            {/* Search Button */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 transition-colors"
            >
              <svg className="w-7 h-7 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 transition-colors"
            >
              <Image
                src="/images/golf-cart.png"
                alt=""
                width={33}
                height={33}
              />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#5f6651] text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {cart.length}
                </span>
              )}
            </Link>

            {/* User */}
            {hydrated && (
              user && user.id ? (
                <div className="relative" data-user-menu>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="w-11 h-11 bg-brand-green text-white rounded-full flex items-center justify-center font-semibold hover:bg-[#4a5040] transition-colors"
                  >
                    {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                  </button>
                  
                  {/* User Dropdown Menu */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-xl shadow-lg z-[110] overflow-hidden">
                      {/* User Info Header */}
                      <div className="bg-gradient-to-br from-brand-green to-[#4a5040] text-white px-4 py-2.5">
                        <p className="font-bold text-sm">{user.name || 'User'}</p>
                        <p className="text-xs text-green-100 mt-0.5">@{user.username || user.email?.split('@')[0] || 'user'} • Eagle Tier</p>
                        
                        {/* User Stats */}
                        <div className="mt-2 grid grid-cols-3 gap-3 pt-3">
                          <div className="text-center">
                            <p className="font-bold text-sm text-white">14.2</p>
                            <p className="text-xs text-green-100 mt-0.5">Handicap</p>
                          </div>
                          <div className="text-center">
                            <p className="font-bold text-sm text-white">12</p>
                            <p className="text-xs text-green-100 mt-0.5">Sales</p>
                          </div>
                          <div className="text-center">
                            <p className="font-bold text-sm text-white">$847</p>
                            <p className="text-xs text-green-100 mt-0.5">Earned</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Menu Items */}
                      <div className="py-1">
                        <Link
                          href="/clubhouse"
                          className="block px-4 py-2.5 text-sm text-gray-900 hover:bg-gray-50 transition-colors flex items-center gap-3"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <span className="text-lg">🏠</span>
                          <div>
                            <span className="font-medium block">My Clubhouse</span>
                            <span className="text-xs text-gray-500">Manage your listings</span>
                          </div>
                        </Link>
                        <Link
                          href="/messages"
                          className="block px-4 py-2.5 text-sm text-gray-900 hover:bg-gray-50 transition-colors flex items-center gap-3"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <span className="text-lg">💬</span>
                          <div>
                            <span className="font-medium block">Messages</span>
                            <span className="text-xs text-gray-500">Chat with buyers & sellers</span>
                          </div>
                        </Link>
                        <div className="border-t border-gray-100"></div>
                        <Link
                          href={`/profile/${user.username || user.id}`}
                          className="block px-4 py-2.5 text-sm text-gray-900 hover:bg-gray-50 transition-colors flex items-center gap-3"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <span className="text-lg">👕</span>
                          <span className="font-medium">Wardrobe</span>
                        </Link>
                        <Link
                          href={`/profile/${user.username || user.id}`}
                          className="block px-4 py-2.5 text-sm text-gray-900 hover:bg-gray-50 transition-colors flex items-center gap-3"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <span className="text-lg">📊</span>
                          <span className="font-medium">My Handicap</span>
                        </Link>
                        <div className="border-t border-gray-100"></div>
                        <Link
                          href="/about"
                          className="block px-4 py-2.5 text-sm text-gray-900 hover:bg-gray-50 transition-colors flex items-center gap-3"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <span className="text-lg">ℹ️</span>
                          <span className="font-medium">About Wrong Club</span>
                        </Link>
                        <Link
                          href="/settings"
                          className="block px-4 py-2.5 text-sm text-gray-900 hover:bg-gray-50 transition-colors flex items-center gap-3"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <span className="text-lg">⚙️</span>
                          <span className="font-medium">Settings</span>
                        </Link>
                        <button
                          onClick={handleLogOut}
                          className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3"
                        >
                          <span className="text-lg">🚪</span>
                          <span className="font-medium">Log Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="px-4 py-2 text-brand-green rounded-lg transition-colors"
                >
                  Sign In
                </Link>
              )
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-100">
            {navItems.map((item) => (
              <div key={item.label}>
                {item.submenu ? (
                  <>
                    <button
                      onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                      className="w-full text-left px-4 py-3 text-brand-green hover:bg-gray-100 rounded-lg flex items-center justify-between"
                    >
                      {item.label}
                      <svg className={`w-4 h-4 transition-transform ${openDropdown === item.label ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                    </button>
                    {openDropdown === item.label && (
                      <div className="bg-gray-50 ml-4">
                        {item.submenu.map((subitem) => (
                          <Link
                            key={subitem.href}
                            href={subitem.href}
                            className="block px-4 py-3 text-gray-900 hover:bg-gray-100 text-sm"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <div className="flex items-start gap-2">
                              <span className="text-base">{subitem.icon}</span>
                              <div>
                                <div className="font-semibold">{subitem.label}</div>
                                <div className="text-xs text-gray-600">{subitem.description}</div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className="block px-4 py-3 text-brand-green hover:bg-gray-100 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        )}
      </div>

      {/* Search Bar */}
      {searchOpen && (
        <div className="border-t border-gray-100 bg-white px-4 sm:px-6 py-4">
          <div className="max-w-7xl mx-auto">
            <input
              type="text"
              placeholder="Search products, brands, styles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  // Handle search
                  console.log('Search for:', searchQuery)
                }
              }}
              autoFocus
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent"
            />
          </div>
        </div>
      )}
    </header>
  )
}
