import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'

export const metadata: Metadata = {
  title: 'Wrong Club | Golf Apparel Marketplace',
  description: 'The peer-to-peer marketplace for golf apparel and accessories. One person\'s rough is another\'s perfect lie.',
  keywords: ['golf', 'apparel', 'marketplace', 'resale', 'golf clothing'],
  openGraph: {
    title: 'Wrong Club | Golf Apparel Marketplace',
    description: 'The peer-to-peer marketplace for golf apparel and accessories.',
    siteName: 'Wrong Club',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wrong Club | Golf Apparel Marketplace',
    description: 'The peer-to-peer marketplace for golf apparel and accessories.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
