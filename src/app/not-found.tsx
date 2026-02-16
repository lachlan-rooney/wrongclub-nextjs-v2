import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-[#5f6651] mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Page not found</h2>
        <p className="text-gray-600 mb-6">The page you're looking for doesn't exist.</p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-[#5f6651] text-white rounded-xl font-medium hover:bg-[#4a5040] transition-colors"
        >
          Go home
        </Link>
      </div>
    </div>
  )
}
