export type Plan = 'free' | 'starter' | 'closer' | 'blackcard'
export type RecommendedAction = 'message_now' | 'wait' | 'upsell_custom' | 'ignore'

export interface Profile {
  id: string
  email: string
  tone: string
  creator_tone: string
  niche: string
  allowed_content: string[]
  allowed_requests: string[]
  banned_requests: string[]
  min_custom_price: number
  plan: Plan
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  subscription_status: string
  fan_count: number
  created_at: string
  updated_at: string
}

export interface Fan {
  id: string
  user_id: string
  nickname: string
  total_spend: number
  last_purchase_at: string | null
  last_contact_at: string | null
  preferred_content: string[]
  tags: string[]
  notes: string | null
  spend_likelihood: number
  expected_value: number
  recommended_action: RecommendedAction
  action_reason: string | null
  scored_at: string | null
  created_at: string
  updated_at: string
}

export interface Interaction {
  id: string
  fan_id: string
  user_id: string
  content: string
  direction: 'inbound' | 'outbound'
  converted: boolean
  spend_amount: number
  amount_cents: number
  interaction_type: 'message' | 'custom_request' | 'call' | 'voice_note'
  created_at: string
}

export interface Offer {
  id: string
  user_id: string
  fan_id: string | null
  raw_request: string
  decision: 'approve' | 'counter' | 'decline'
  suggested_price: number | null
  safer_rewrite: string | null
  decline_reason: string | null
  boundary_flags: string[]
  status: 'pending' | 'sent' | 'accepted' | 'declined'
  created_at: string
}

export const ACTION_LABELS: Record<RecommendedAction, string> = {
  message_now: 'Message Now 🔥',
  wait: 'Wait',
  upsell_custom: 'Upsell Custom 💰',
  ignore: 'Ignore',
}

export const ACTION_COLORS: Record<RecommendedAction, string> = {
  message_now: 'text-green-400 bg-green-400/10 border-green-400/20',
  wait: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  upsell_custom: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  ignore: 'text-red-400 bg-red-400/10 border-red-400/20',
}
