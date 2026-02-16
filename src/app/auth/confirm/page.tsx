'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import Link from 'next/link'
import { Check, Loader2, XCircle } from 'lucide-react'

export default function ConfirmPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const handleConfirmation = async () => {
      const code = searchParams.get('code')
      const error = searchParams.get('error')
      const errorDescription = searchParams.get('error_description')

      // Check for errors from Supabase
      if (error) {
        setStatus('error')
        setErrorMessage(errorDescription?.replace(/\+/g, ' ') || 'Confirmation failed')
        return
      }

      // No code means direct visit
      if (!code) {
        setStatus('error')
        setErrorMessage('No confirmation code found. Please check your email link.')
        return
      }

      try {
        const supabase = createClient()
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

        if (exchangeError) {
          setStatus('error')
          setErrorMessage(exchangeError.message)
          return
        }

        setStatus('success')
      } catch (err) {
        setStatus('error')
        setErrorMessage('Something went wrong. Please try again.')
      }
    }

    handleConfirmation()
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
          
          {status === 'loading' && (
            <>
              <div className="w-16 h-16 bg-[#5f6651]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Loader2 className="w-8 h-8 text-[#5f6651] animate-spin" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Confirming your email...</h1>
              <p className="text-gray-600">Please wait while we verify your account.</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Email Confirmed!</h1>
              <p className="text-gray-600 mb-8">
                Welcome to Wrong Club. Your account is ready to go.
              </p>
              <Link
                href="/browse"
                className="inline-block w-full py-3 bg-[#5f6651] text-white rounded-xl font-semibold hover:bg-[#4a5040] transition-colors"
              >
                Start Browsing
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Confirmation Failed</h1>
              <p className="text-gray-600 mb-6">{errorMessage}</p>
              <div className="space-y-3">
                <Link
                  href="/signup"
                  className="inline-block w-full py-3 bg-[#5f6651] text-white rounded-xl font-semibold hover:bg-[#4a5040] transition-colors"
                >
                  Try Signing Up Again
                </Link>
                <Link
                  href="/login"
                  className="inline-block w-full py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Go to Login
                </Link>
              </div>
            </>
          )}

        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Having trouble? <a href="mailto:hello@wrongclub.com" className="text-[#5f6651] hover:underline">Contact support</a>
        </p>
      </div>
    </div>
  )
}
