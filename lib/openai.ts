import OpenAI from 'openai'

export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

export async function scoreFan(fan: {
  nickname: string
  totalSpend: number
  lastPurchaseDays: number | null
  lastContactDays: number | null
  preferredContent: string[]
  tags: string[]
  notes: string
  recentMessages: string
  creatorTone: string
}) {
  const prompt = `You are a revenue intelligence assistant for adult content creators.

Analyze this fan and return JSON with:
- spend_likelihood: number 0-100
- expected_value: number in dollars
- recommended_action: "message_now" | "wait" | "upsell_custom" | "ignore"
- action_reason: one sentence max 15 words
- tags: array from ["big_spender","time_waster","clingy","boundary_risk","loyal","voice_note_buyer","tribute_buyer","custom_buyer"]

Fan:
- Nickname: ${fan.nickname}
- Total spent: $${(fan.totalSpend / 100).toFixed(2)}
- Days since last purchase: ${fan.lastPurchaseDays ?? 'never purchased'}
- Days since last contact: ${fan.lastContactDays ?? 'never contacted'}
- Preferred content: ${fan.preferredContent.join(', ') || 'unknown'}
- Tags: ${fan.tags.join(', ') || 'none'}
- Notes: ${fan.notes || 'none'}
- Recent messages: ${fan.recentMessages || 'none'}

Return ONLY valid JSON.`

  const res = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    temperature: 0.3,
  })
  return JSON.parse(res.choices[0].message.content!)
}

export async function generateReplies(fan: {
  nickname: string
  preferredContent: string[]
  notes: string
  recentMessages: string
  lastPurchaseDays: number | null
  creatorTone: string
  action: string
}) {
  const prompt = `You are a reply assistant for an adult creator with tone: ${fan.creatorTone}.

Write 3 short reply options (1-3 sentences each) for this fan. Match the action: ${fan.action}.

Fan: ${fan.nickname}
Last purchase: ${fan.lastPurchaseDays ? `${fan.lastPurchaseDays} days ago` : 'never'}
Preferred: ${fan.preferredContent.join(', ') || 'unknown'}
Notes: ${fan.notes || 'none'}
Recent: ${fan.recentMessages || 'none'}

Return JSON: { "replies": ["reply1", "reply2", "reply3"] }`

  const res = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    temperature: 0.8,
  })
  return JSON.parse(res.choices[0].message.content!)
}

export async function triageRequest(req: {
  rawRequest: string
  bannedRequests: string[]
  minCustomPrice: number
  creatorTone: string
}) {
  const prompt = `You are a content request triage assistant for an adult creator.

Analyze this custom request and return JSON:
- decision: "approve" | "counter" | "decline"
- suggested_price: dollars (if approve/counter, else null)
- safer_rewrite: cleaner version if countering (else null)
- decline_reason: brief reason if declining (else null)
- boundary_flags: array of concerning elements

Creator:
- Banned: ${req.bannedRequests.join(', ') || 'none'}
- Min price: $${req.minCustomPrice}
- Tone: ${req.creatorTone}

Request: "${req.rawRequest}"

Pricing: simple $20-50, moderate $50-100, complex $100-300+

Return ONLY valid JSON.`

  const res = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    temperature: 0.2,
  })
  return JSON.parse(res.choices[0].message.content!)
}
