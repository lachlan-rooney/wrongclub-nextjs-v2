'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { redirect } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  useEffect(() => {
    // If there's a code parameter, it means the callback route didn't catch it
    // This shouldn't happen with the new page.tsx in /auth/callback, but handle it as fallback
    if (code) {
      router.replace('/auth/callback?' + new URLSearchParams({ code }).toString())
      return
    }

    // If there's an error, log it and redirect to browse anyway
    if (error) {
      console.error('Auth error:', error)
      router.push('/browse')
      return
    }

    // Normal redirect to browse
    router.push('/browse')
  }, [code, error, router])

  // Show loading while redirect happens
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-green mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  )
}
