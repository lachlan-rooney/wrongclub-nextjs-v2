import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')

  // Redirect to confirm page - let the client handle the code exchange
  const confirmUrl = new URL('/auth/confirm', requestUrl.origin)
  
  if (code) {
    confirmUrl.searchParams.append('code', code)
  }
  
  if (error) {
    confirmUrl.searchParams.append('error', error)
    const errorDescription = requestUrl.searchParams.get('error_description')
    if (errorDescription) {
      confirmUrl.searchParams.append('error_description', errorDescription)
    }
  }

  return NextResponse.redirect(confirmUrl)
}
