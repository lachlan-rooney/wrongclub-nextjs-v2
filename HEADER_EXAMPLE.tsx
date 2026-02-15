'use client'

import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { User, LogOut, Settings, ShoppingBag, MessageSquare } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

export default function Header() {
  const { user, profile, isAuthenticated, signOut, isLoading } = useAuth()
  const [profileOpen, setProfileOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-[#5f6651]">
          Wrong Club
        </Link>

        {/* Navigation - Center */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/browse" className="text-gray-700 hover:text-gray-900 font-medium">
            Browse
          </Link>
          <Link href="/courses" className="text-gray-700 hover:text-gray-900 font-medium">
            Courses
          </Link>
          <Link href="/about" className="text-gray-700 hover:text-gray-900 font-medium">
            About
          </Link>
        </nav>

        {/* Auth Section - Right */}
        <div className="flex items-center gap-4">
          {/* Cart Icon (if not auth loading) */}
          {!isLoading && (
            <Link
              href="/cart"
              className="relative p-2 text-gray-700 hover:text-gray-900"
              title="Shopping cart"
            >
              <ShoppingBag className="w-6 h-6" />
              <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </Link>
          )}

          {/* Auth State */}
          {isLoading ? (
            // Loading skeleton
            <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
          ) : isAuthenticated ? (
            // Authenticated - Profile Dropdown
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="w-10 h-10 bg-[#5f6651] text-white rounded-full flex items-center justify-center font-bold text-sm hover:bg-[#4a5040] transition-colors overflow-hidden"
                title={`Logged in as ${profile?.username}`}
              >
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  profile?.display_name?.charAt(0) || profile?.username?.charAt(0) || 'U'
                )}
              </button>

              {/* Dropdown Menu */}
              {profileOpen && (
                <div className="absolute right-0 top-12 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="font-semibold text-gray-900">
                      {profile?.display_name || profile?.username}
                    </p>
                    <p className="text-sm text-gray-500">@{profile?.username}</p>
                    {profile?.tier && (
                      <p className="text-xs text-[#5f6651] font-medium capitalize">
                        {profile.tier} • {profile.handicap_points} points
                      </p>
                    )}
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    {/* Seller Dashboard */}
                    {profile?.is_seller && (
                      <Link
                        href="/clubhouse"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50"
                      >
                        <ShoppingBag className="w-5 h-5" />
                        <span>My Clubhouse</span>
                      </Link>
                    )}

                    {/* Messages */}
                    <Link
                      href="/messages"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50"
                    >
                      <MessageSquare className="w-5 h-5" />
                      <span>Messages</span>
                    </Link>

                    {/* Profile */}
                    <Link
                      href={`/profile/${profile?.username}`}
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50"
                    >
                      <User className="w-5 h-5" />
                      <span>My Profile</span>
                    </Link>

                    {/* Settings */}
                    <Link
                      href="/settings"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50"
                    >
                      <Settings className="w-5 h-5" />
                      <span>Settings</span>
                    </Link>
                  </div>

                  {/* Seller CTA */}
                  {!profile?.is_seller && (
                    <div className="border-t border-gray-100 pt-1 pb-1 px-4 py-2">
                      <Link
                        href="/sell"
                        onClick={() => setProfileOpen(false)}
                        className="block w-full text-center py-2 bg-[#5f6651] text-white rounded-lg font-medium hover:bg-[#4a5040] transition-colors"
                      >
                        Become a Seller
                      </Link>
                    </div>
                  )}

                  {/* Sign Out */}
                  <div className="border-t border-gray-100 pt-1">
                    <button
                      onClick={() => {
                        setProfileOpen(false)
                        signOut()
                      }}
                      className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 w-full"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Not Authenticated - Auth Links
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-gray-700 hover:text-gray-900 font-medium"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 bg-[#5f6651] text-white rounded-xl font-medium hover:bg-[#4a5040] transition-colors"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
