import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
})

export const PLANS = {
  starter: {
    name: 'Starter',
    price: 4900,
    priceId: process.env.STRIPE_STARTER_PRICE_ID!,
    fanLimit: 200,
    features: ['Up to 200 fans', 'Tonight Board', 'Fan scoring', 'Reply drafts', 'Request triage', 'Basic fan memory'],
  },
  closer: {
    name: 'Closer',
    price: 9900,
    priceId: process.env.STRIPE_CLOSER_PRICE_ID!,
    fanLimit: 1000,
    features: ['Up to 1,000 fans', 'Everything in Starter', 'More draft variations', 'Saved pricing rules', 'Spend signal history', 'Priority support'],
  },
  blackcard: {
    name: 'Black Card',
    price: 19900,
    priceId: process.env.STRIPE_BLACKCARD_PRICE_ID!,
    fanLimit: 999999,
    features: ['Unlimited fans', 'Everything in Closer', 'Advanced scoring', 'Custom tone tuning', 'Bulk request triage', 'White-glove onboarding'],
  },
}
