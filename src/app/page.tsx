'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'

export default function Home() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const processAuthCode = async () => {
      const code = searchParams.get('code')
      const errorParam = searchParams.get('error')

      if (errorParam) {
        console.error('Auth error:', errorParam)
        setError(`Authentication error: ${errorParam}`)
        setIsProcessing(false)
        return
      }

      if (!code || isProcessing) {
        return
      }

      setIsProcessing(true)

      try {
        const supabase = createClient()
        
        // Exchange code for session
        const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

        if (exchangeError) {
          console.error('Code exchange error:', exchangeError)
          setError(`Failed to authenticate: ${exchangeError.message}`)
          setIsProcessing(false)
          return
        }

        console.log('✅ Auth successful, session established')

        // Remove code from URL
        window.history.replaceState({}, '', '/')

        // Give session a moment to settle
        await new Promise(resolve => setTimeout(resolve, 500))

        // Now redirect to browse
        router.push('/browse')
      } catch (err) {
        console.error('Auth callback error:', err)
        setError('An unexpected error occurred')
        setIsProcessing(false)
      }
    }

    processAuthCode()
  }, [searchParams, router, isProcessing])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Authentication Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <p className="text-sm text-gray-500 mb-6">
            If you continue to have issues, try signing up again or contact support.
          </p>
          <a
            href="/"
            className="inline-block bg-brand-green text-white px-6 py-2 rounded-lg hover:opacity-90 font-medium"
          >
            Back to Home
          </a>
        </div>
      </div>
    )
  }

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-green mx-auto mb-4"></div>
          <p className="text-gray-600">Logging you in...</p>
        </div>
      </div>
    )
  }

  // No code, redirect to browse
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-green mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  )
}
