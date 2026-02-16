'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function Home() {
  const router = useRouter()
  const { isLoading, isAuthenticated } = useAuth()

  useEffect(() => {
    // If loading, wait
    if (isLoading) return

    // If authenticated, go to browse
    if (isAuthenticated) {
      router.push('/browse')
      return
    }

    // If not authenticated, go to login
    router.push('/login')
  }, [isLoading, isAuthenticated, router])

  // Show loading spinner while checking auth state
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5f6651] mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  )
}
