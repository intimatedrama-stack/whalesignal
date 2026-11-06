import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { scoreFan } from '@/lib/openai'

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { fanId } = await req.json()

  // Get fan + profile
  const [{ data: fan }, { data: profile }] = await Promise.all([
    supabase.from('fans').select('*').eq('id', fanId).eq('user_id', user.id).single(),
    supabase.from('profiles').select('*').eq('id', user.id).single(),
  ])

  if (!fan) return NextResponse.json({ error: 'Fan not found' }, { status: 404 })

  // Get recent interactions
  const { data: interactions } = await supabase
    .from('interactions')
    .select('content, direction, created_at')
    .eq('fan_id', fanId)
    .order('created_at', { ascending: false })
    .limit(10)

  const recentMessages = interactions?.map(i => `${i.direction}: ${i.content}`).join('\n') ?? ''
  const lastPurchaseDays = fan.last_purchase_at
    ? Math.floor((Date.now() - new Date(fan.last_purchase_at).getTime()) / 86400000) : null
  const lastContactDays = fan.last_contact_at
    ? Math.floor((Date.now() - new Date(fan.last_contact_at).getTime()) / 86400000) : null

  const result = await scoreFan({
    nickname: fan.nickname,
    totalSpend: fan.total_spend,
    lastPurchaseDays,
    lastContactDays,
    preferredContent: fan.preferred_content,
    tags: fan.tags,
    notes: fan.notes ?? '',
    recentMessages,
    creatorTone: profile?.creator_tone ?? 'flirty',
  })

  // Update fan with new scores
  await supabase.from('fans').update({
    spend_likelihood: result.spend_likelihood,
    expected_value: result.expected_value,
    recommended_action: result.recommended_action,
    action_reason: result.action_reason,
    tags: [...new Set([...fan.tags, ...(result.tags ?? [])])],
    scored_at: new Date().toISOString(),
  }).eq('id', fanId)

  return NextResponse.json(result)
}
