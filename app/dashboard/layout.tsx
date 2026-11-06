import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <aside className="w-56 border-r border-white/10 flex flex-col p-4 shrink-0">
        <Link href="/dashboard" className="text-lg font-bold mb-8 px-2">WhaleSignal</Link>
        <nav className="space-y-1 flex-1">
          {[
            { href: '/dashboard', label: '🌙 Tonight', },
            { href: '/dashboard/fans', label: '👥 Fans' },
            { href: '/dashboard/triage', label: '💰 Triage' },
            { href: '/dashboard/settings', label: '⚙️ Settings' },
          ].map((item) => (
            <Link key={item.href} href={item.href}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 transition">
              {item.label}
            </Link>
          ))}
        </nav>
        <form action="/auth/signout" method="post">
          <button className="w-full text-left px-3 py-2 text-sm text-white/30 hover:text-white/60 transition">Sign out</button>
        </form>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto p-6">
        {children}
      </main>
    </div>
  )
}
