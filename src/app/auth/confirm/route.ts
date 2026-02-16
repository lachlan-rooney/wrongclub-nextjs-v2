import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')

  // If there's an error, redirect to error page
  if (error) {
    return NextResponse.redirect(
      new URL(`/auth/confirmed?error=${error}&message=${encodeURIComponent(errorDescription || 'Confirmation failed')}`, requestUrl.origin)
    )
  }

  // If no code, redirect to error
  if (!code) {
    return NextResponse.redirect(
      new URL('/auth/confirmed?error=no_code&message=No+confirmation+code+found', requestUrl.origin)
    )
  }

  try {
    // Create Supabase client with cookie access
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )

    // Exchange code for session (server-side with cookie access)
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      return NextResponse.redirect(
        new URL(`/auth/confirmed?error=exchange_failed&message=${encodeURIComponent(exchangeError.message)}`, requestUrl.origin)
      )
    }

    // Success - redirect to confirmed page
    return NextResponse.redirect(new URL('/auth/confirmed?success=true', requestUrl.origin))
  } catch (err) {
    console.error('Auth confirmation error:', err)
    return NextResponse.redirect(
      new URL('/auth/confirmed?error=server_error&message=An+unexpected+error+occurred', requestUrl.origin)
    )
  }
}
