import Link from 'next/link'

const FEATURES = [
  { title: 'Tonight Board', desc: 'A ranked list of your top fans by spend likelihood, urgency, and best next move.' },
  { title: 'Fan Scoring', desc: 'Instant labels: Likely Buyer, Cooling Off, Time-Waster, and Boundary Risk.' },
  { title: 'Reply Drafts', desc: 'Three reply options in your tone for every fan: re-engage, upsell, or hold.' },
  { title: 'Request Triage', desc: 'Paste any custom request and get: approve, counter, decline, suggested price, and safer wording.' },
  { title: 'Fan Memory', desc: 'Track what each person buys, what tone they respond to, and what not to send.' },
]

const PLANS = [
  {
    name: 'Starter', price: '$49', period: '/month',
    features: ['Up to 200 fans', 'Tonight Board', 'Fan scoring', 'Reply drafts', 'Request triage', 'Basic fan memory'],
  },
  {
    name: 'Closer', price: '$99', period: '/month', highlight: true,
    features: ['Up to 1,000 fans', 'Everything in Starter', 'More draft variations', 'Saved pricing rules', 'Spend signal history', 'Priority support'],
  },
  {
    name: 'Black Card', price: '$199', period: '/month',
    features: ['Unlimited fans', 'Everything in Closer', 'Advanced scoring', 'Custom tone tuning', 'Bulk request triage', 'White-glove onboarding'],
  },
]

const FAQS = [
  { q: 'Do I need to connect my accounts?', a: 'No. You can paste conversations manually and start using WhaleSignal immediately.' },
  { q: 'Will it message fans for me?', a: 'No. WhaleSignal tells you who matters, what to say, and what to price. You stay in control.' },
  { q: 'Is this just another AI reply tool?', a: 'No. It combines spend signals, fan memory, and request triage so you know who is actually worth your time.' },
  { q: 'What kinds of creators is it for?', a: 'Creators selling chats, texting, calls, customs, and paid attention.' },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-5xl mx-auto">
        <span className="text-lg font-bold tracking-tight">WhaleSignal</span>
        <div className="flex gap-4 text-sm">
          <Link href="/auth/login" className="text-white/50 hover:text-white transition">Log in</Link>
          <Link href="/auth/signup" className="bg-white text-black px-4 py-2 rounded-full font-semibold hover:bg-white/90 transition">Get Early Access</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-3xl mx-auto text-center px-6 pt-20 pb-24">
        <div className="inline-block text-xs font-semibold tracking-widest text-white/30 uppercase mb-6 border border-white/10 px-3 py-1 rounded-full">
          Revenue intelligence for solo creators
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold leading-tight tracking-tight mb-6">
          Know exactly which fans are worth messaging tonight.
        </h1>
        <p className="text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
          WhaleSignal scores your fans by spend likelihood, flags time-wasters, drafts replies in your tone, and prices custom requests before you waste another hour on people who never buy.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/auth/signup" className="bg-white text-black px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/90 transition">
            Get Early Access
          </Link>
          <Link href="/auth/login" className="border border-white/20 text-white px-8 py-4 rounded-full font-semibold text-lg hover:border-white/40 transition">
            Log In
          </Link>
        </div>
        <p className="text-sm text-white/25 mt-6">
          Built for solo adult creators selling chats, texting, calls, customs, and paid attention.
        </p>
      </section>

      {/* Problem */}
      <section className="bg-white/[0.03] border-y border-white/5 py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Your inbox is full. Your best buyers are buried.</h2>
          <p className="text-white/50 text-lg leading-relaxed mb-8">
            Most creators are guessing. You answer the loudest people first, underprice weird requests, and spend your energy on fans who were never going to buy. WhaleSignal tells you who to message, what to say, when to wait, and when to ignore.
          </p>
          <ul className="space-y-3">
            {[
              'See who is most likely to spend in the next 24 hours',
              'Stop feeding time-wasters and boundary-pushers',
              'Price customs faster without second-guessing',
              'Keep fan memory without digging through old chats',
            ].map(item => (
              <li key={item} className="flex items-start gap-3 text-white/70">
                <span className="text-white mt-1">→</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-4xl mx-auto py-20 px-6">
        <h2 className="text-3xl font-bold text-center mb-14">Paste chats. Score fans. Make better money decisions fast.</h2>
        <div className="grid sm:grid-cols-3 gap-8">
          {[
            { step: '01', title: 'Import fan history', desc: 'Paste conversations or upload a CSV with names, spend, request type, and notes.' },
            { step: '02', title: 'See your Tonight Board', desc: 'Get a ranked list of who to message now, who to leave alone, and who to upsell.' },
            { step: '03', title: 'Use the next move', desc: 'Generate replies in your tone, price custom requests, and filter time-wasters.' },
          ].map(s => (
            <div key={s.step} className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
              <div className="text-4xl font-bold text-white/10 mb-4">{s.step}</div>
              <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-white/[0.03] border-y border-white/5 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-14">Everything you need to monetize attention without burning out</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {FEATURES.map(f => (
              <div key={f.title} className="bg-black border border-white/10 rounded-2xl p-6">
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-5xl mx-auto py-20 px-6">
        <h2 className="text-3xl font-bold text-center mb-4">Simple pricing</h2>
        <p className="text-center text-white/40 mb-14">Cancel anytime. No platform integrations required. Works with pasted chats on day one.</p>
        <div className="grid sm:grid-cols-3 gap-6">
          {PLANS.map(p => (
            <div key={p.name} className={`rounded-2xl p-6 border flex flex-col ${p.highlight ? 'bg-white text-black border-white' : 'bg-white/[0.03] border-white/10'}`}>
              <div className="text-sm font-semibold mb-4 opacity-60">{p.name}</div>
              <div className="text-4xl font-bold mb-1">{p.price}<span className="text-lg font-normal opacity-50">{p.period}</span></div>
              <ul className="mt-6 space-y-2 flex-1">
                {p.features.map(f => (
                  <li key={f} className={`text-sm flex gap-2 ${p.highlight ? 'text-black/70' : 'text-white/50'}`}>
                    <span className={p.highlight ? 'text-black' : 'text-white'}>✓</span>{f}
                  </li>
                ))}
              </ul>
              <Link href="/auth/signup" className={`mt-8 block text-center py-3 rounded-full font-semibold text-sm transition ${p.highlight ? 'bg-black text-white hover:bg-black/80' : 'border border-white/20 text-white hover:border-white/40'}`}>
                Get started
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white/[0.03] border-y border-white/5 py-20 px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">FAQ</h2>
          <div className="space-y-8">
            {FAQS.map(f => (
              <div key={f.q}>
                <h3 className="font-semibold mb-2">{f.q}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-2xl mx-auto text-center py-24 px-6">
        <h2 className="text-4xl font-bold mb-4">Stop guessing who might buy.</h2>
        <p className="text-white/40 text-lg mb-8">If you already know your inbox is costing you money, WhaleSignal is for you.</p>
        <Link href="/auth/signup" className="bg-white text-black px-10 py-4 rounded-full font-semibold text-lg hover:bg-white/90 transition inline-block">
          Get Early Access
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="font-bold">WhaleSignal</span>
          <p className="text-white/25 text-sm">Revenue intelligence for solo adult creators.</p>
          <div className="flex gap-6 text-sm text-white/30">
            <Link href="#pricing" className="hover:text-white transition">Pricing</Link>
            <Link href="/auth/login" className="hover:text-white transition">Log in</Link>
            <Link href="/auth/signup" className="hover:text-white transition">Sign up</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
