'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Check, XCircle } from 'lucide-react'

export default function ConfirmedPage() {
  const searchParams = useSearchParams()
  const success = searchParams.get('success')
  const error = searchParams.get('error')
  const message = searchParams.get('message')?.replace(/\+/g, ' ')

  const isSuccess = success === 'true'

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
          
          {isSuccess ? (
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
          ) : (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Confirmation Failed</h1>
              <p className="text-gray-600 mb-6">{message || 'Something went wrong'}</p>
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
