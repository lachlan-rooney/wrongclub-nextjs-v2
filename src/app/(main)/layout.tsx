import { Header } from '@/components/layout/Header'
import { BottomNav } from '@/components/BottomNav'
import { CaddieButton } from '@/components'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-20 pb-24 md:pb-0">{children}</main>
      <BottomNav />
      <CaddieButton />
    </div>
  )
}
