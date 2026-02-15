'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'

export default function CallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isProcessing, setIsProcessing] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const code = searchParams.get('code')
        const type = searchParams.get('type')

        if (!code) {
          setError('No authentication code provided')
          setIsProcessing(false)
          return
        }

        const supabase = createClient()

        // Exchange code for session
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

        if (exchangeError) {
          console.error('Auth exchange error:', exchangeError)
          setError(`Authentication failed: ${exchangeError.message}`)
          setIsProcessing(false)
          return
        }

        // Handle password recovery redirect
        if (type === 'recovery') {
          router.push('/reset-password')
          return
        }

        // Successful auth - redirect to home
        router.push('/')
      } catch (err) {
        console.error('Callback error:', err)
        setError('An unexpected error occurred')
        setIsProcessing(false)
      }
    }

    handleAuthCallback()
  }, [searchParams, router])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Authentication Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <a
            href="/"
            className="inline-block bg-brand-green text-white px-6 py-2 rounded-lg hover:opacity-90 font-medium"
          >
            Go to Home
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-green mx-auto mb-4"></div>
        <p className="text-gray-600">Completing your sign up...</p>
      </div>
    </div>
  )
}
