import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateReplies } from '@/lib/openai'

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { fanId } = await req.json()

  const [{ data: fan }, { data: profile }] = await Promise.all([
    supabase.from('fans').select('*').eq('id', fanId).eq('user_id', user.id).single(),
    supabase.from('profiles').select('creator_tone').eq('id', user.id).single(),
  ])

  if (!fan) return NextResponse.json({ error: 'Fan not found' }, { status: 404 })

  const { data: interactions } = await supabase
    .from('interactions').select('content, direction').eq('fan_id', fanId)
    .order('created_at', { ascending: false }).limit(5)

  const result = await generateReplies({
    nickname: fan.nickname,
    preferredContent: fan.preferred_content,
    notes: fan.notes ?? '',
    recentMessages: interactions?.map(i => `${i.direction}: ${i.content}`).join('\n') ?? '',
    lastPurchaseDays: fan.last_purchase_at
      ? Math.floor((Date.now() - new Date(fan.last_purchase_at).getTime()) / 86400000) : null,
    creatorTone: profile?.creator_tone ?? 'flirty',
    action: fan.recommended_action,
  })

  return NextResponse.json(result)
}
