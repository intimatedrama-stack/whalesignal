import { createClient } from '@/lib/supabase/server'
import { ACTION_LABELS, ACTION_COLORS, type Fan } from '@/lib/types'
import Link from 'next/link'

function daysSince(date: string | null): number | null {
  if (!date) return null
  return Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24))
}

export default async function TonightBoardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: fans } = await supabase
    .from('fans')
    .select('*')
    .eq('user_id', user!.id)
    .order('spend_likelihood', { ascending: false })
    .limit(50) as { data: Fan[] | null }

  const allFans = fans ?? []
  const likelyBuyers = allFans.filter(f => f.recommended_action === 'message_now' || f.spend_likelihood >= 65)
  const timeWasters = allFans.filter(f => f.tags.includes('time_waster') || f.recommended_action === 'ignore')
  const totalOpportunity = allFans.reduce((sum, f) => sum + (f.expected_value || 0), 0)

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Tonight&apos;s Board</h1>
          <p className="text-white/40 text-sm mt-1">Fans ranked by spend likelihood right now</p>
        </div>
        <Link href="/dashboard/fans/new"
          className="bg-white text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-white/90 transition">
          + Add Fan
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="border border-white/10 rounded-xl p-4">
          <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Likely Buyers</p>
          <p className="text-3xl font-bold text-green-400">{likelyBuyers.length}</p>
        </div>
        <div className="border border-white/10 rounded-xl p-4">
          <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Time Wasters</p>
          <p className="text-3xl font-bold text-red-400">{timeWasters.length}</p>
        </div>
        <div className="border border-white/10 rounded-xl p-4">
          <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Est. Opportunity</p>
          <p className="text-3xl font-bold">${totalOpportunity}</p>
        </div>
      </div>

      {/* Fan cards */}
      {allFans.length === 0 ? (
        <div className="border border-white/10 rounded-2xl p-12 text-center">
          <p className="text-white/40 text-lg mb-4">No fans yet.</p>
          <Link href="/dashboard/fans/new" className="text-white underline text-sm">Add your first fan →</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {allFans.map((fan) => (
            <Link key={fan.id} href={`/dashboard/fans/${fan.id}`}
              className="block border border-white/10 rounded-xl p-4 hover:border-white/20 hover:bg-white/2 transition">
              <div className="flex items-center gap-4">
                {/* Likelihood circle */}
                <div className="w-12 h-12 rounded-full border-2 border-white/20 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold">{fan.spend_likelihood}%</span>
                </div>

                {/* Main info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{fan.nickname}</span>
                    {fan.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="text-xs bg-white/5 border border-white/10 px-2 py-0.5 rounded-full text-white/40">
                        {tag.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-4 text-xs text-white/30">
                    <span>Total: ${(fan.total_spend / 100).toFixed(0)}</span>
                    {fan.last_purchase_at && <span>Last paid: {daysSince(fan.last_purchase_at)}d ago</span>}
                    <span>Est: ${fan.expected_value}</span>
                  </div>
                  {fan.action_reason && (
                    <p className="text-xs text-white/40 mt-1 truncate">{fan.action_reason}</p>
                  )}
                </div>

                {/* Action badge */}
                <span className={`text-xs px-3 py-1.5 rounded-full border font-medium shrink-0 ${ACTION_COLORS[fan.recommended_action]}`}>
                  {ACTION_LABELS[fan.recommended_action]}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
