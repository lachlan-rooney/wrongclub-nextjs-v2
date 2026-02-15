'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingBag, Compass, Plus, MessageCircle, User } from 'lucide-react'

const tabs = [
  { name: 'Shop', href: '/browse', icon: ShoppingBag },
  { name: 'Explore', href: '/courses', icon: Compass },
  { name: 'Sell', href: '/sell', icon: Plus, elevated: true },
  { name: 'Inbox', href: '/messages', icon: MessageCircle },
  { name: 'Profile', href: '/profile/me', icon: User },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-[var(--border)] md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || pathname.startsWith(tab.href + '/')
          const Icon = tab.icon

          if (tab.elevated) {
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className="relative -top-8 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--brand)] text-white shadow-lg transition-all hover:shadow-xl active:scale-95"
                aria-label={tab.name}
              >
                <Icon size={24} />
              </Link>
            )
          }

          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`flex flex-1 flex-col items-center justify-center gap-1 py-3 px-2 transition-colors ${
                isActive
                  ? 'text-[var(--brand)]'
                  : 'text-[var(--slate)]'
              }`}
              aria-label={tab.name}
            >
              <Icon size={20} />
              <span className="text-xs font-medium">{tab.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
