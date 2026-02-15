import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  try {
    if (code) {
      const supabase = await createServerSupabaseClient()
      await supabase.auth.exchangeCodeForSession(code)
    }
  } catch (error) {
    console.error('Server-side code exchange error:', error)
  }

  // Redirect to home - code exchange will be handled by client
  return NextResponse.redirect(new URL('/', requestUrl.origin))
}
