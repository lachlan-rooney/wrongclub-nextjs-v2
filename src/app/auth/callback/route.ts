import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const type = requestUrl.searchParams.get('type')

  try {
    if (code) {
      const supabase = await createServerSupabaseClient()
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Session exchange error:', error)
        return NextResponse.redirect(new URL('/?error=auth_failed', requestUrl.origin))
      }
    }

    // Handle password recovery redirect
    if (type === 'recovery') {
      return NextResponse.redirect(new URL('/reset-password', requestUrl.origin))
    }

    // Redirect to home after successful auth
    return NextResponse.redirect(new URL('/', requestUrl.origin))
  } catch (error) {
    console.error('Callback route error:', error)
    return NextResponse.redirect(new URL('/?error=callback_failed', requestUrl.origin))
  }
}
