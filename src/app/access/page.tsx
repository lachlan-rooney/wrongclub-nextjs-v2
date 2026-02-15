'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AccessPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const router = useRouter()

  const SITE_PASSWORD = 'wrongclub2026' // Change this to your password

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (password === SITE_PASSWORD) {
      // Set cookie for 7 days
      document.cookie = `site-access=granted; path=/; max-age=${60 * 60 * 24 * 7}`
      router.push('/')
    } else {
      setError(true)
      setPassword('')
    }
  }

  return (
    <div className="min-h-screen bg-[#5f6651] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white">Wrong Club</h1>
          <p className="text-white/70 mt-2">Private Beta</p>
        </div>

        {/* Password form */}
        <div className="bg-white rounded-2xl p-8 shadow-xl">
          <h2 className="text-xl font-semibold text-gray-900 text-center mb-2">
            Enter Access Code
          </h2>
          <p className="text-gray-500 text-center text-sm mb-6">
            This site is currently in private beta.
          </p>

          <form onSubmit={handleSubmit}>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError(false)
              }}
              placeholder="Enter password"
              className={`w-full px-4 py-3 border rounded-xl text-center text-lg focus:outline-none focus:ring-2 focus:ring-[#5f6651] ${
                error ? 'border-red-500 bg-red-50' : 'border-gray-200'
              }`}
              autoFocus
            />

            {error && (
              <p className="text-red-500 text-sm text-center mt-2">
                Incorrect password. Please try again.
              </p>
            )}

            <button
              type="submit"
              className="w-full mt-4 py-3 bg-[#5f6651] text-white rounded-xl font-semibold hover:bg-[#4a5040] transition-colors"
            >
              Enter Site
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-white/50 text-center text-sm mt-8">
          Interested in access? Contact us at hello@wrongclub.com
        </p>
      </div>
    </div>
  )
}
