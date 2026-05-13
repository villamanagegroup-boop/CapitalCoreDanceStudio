import { useState } from 'react'
import Navbar from '../components/Navbar'
import PageHeader from '../components/PageHeader'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import { supabase } from '../lib/supabase'

const CLASSES = [
  {
    number: '1.',
    title: 'CALM',
    titleScript: 'Confidence',
    description: 'A graceful movement class designed to help women reconnect with themselves through mindful movement, breathwork, and confidence-building exercises in a supportive space.',
    tagline: 'Reconnect. Reset. Move with grace.',
    pills: ['Mindful Movement', 'Confidence Building', 'Stretch & Reflect'],
    accent: '#f4a8b4',          // site soft pink
    accentInk: '#a83a4c',       // darker companion for text on pink
    cardTint: '#fff5f8',        // very soft pink card body
  },
  {
    number: '2.',
    title: 'THROWBACK',
    titleScript: 'Flow',
    description: 'A fun, feel-good dance class inspired by the songs you grew up loving. No experience. Just good vibes and a whole lot of fun!',
    tagline: 'The music. The moves. The vibes. All the feels.',
    pills: ['Throwback Hits', 'Easy & Fun Choreo', 'Cardio That Feels Good'],
    accent: '#c9a868',          // warm gold
    accentInk: '#7a5a1f',
    cardTint: '#fdf6e6',
  },
  {
    number: '3.',
    title: 'FEMME',
    titleScript: 'Flow',
    description: 'An empowering movement class that blends grace, strength, and feminine energy to help you move beautifully and feel confident inside and out.',
    tagline: 'Embrace your confidence. Express yourself.',
    pills: ['Graceful Movement', 'Feminine Expression', 'Confidence & Empowerment'],
    accent: '#c0392b',          // site brand red
    accentInk: '#7a1f1f',
    cardTint: '#fbeeec',
  },
]

const ALL_CLASS_FEATURES = [
  { label: 'Beginner Friendly', icon: '🤍', accent: '#f4a8b4' },
  { label: 'No Experience Needed', icon: '♡', accent: '#7ab3e8' },
  { label: 'Supportive Community', icon: '✿', accent: '#c9a868' },
  { label: 'A Safe Space for You', icon: '✦', accent: '#c0392b' },
]

const INITIAL_FORM = {
  name: '',
  email: '',
  phone: '',
  classInterest: [],
  preferredTimes: [],
  passInterest: '',
  notes: '',
}

const PASS_OPTIONS = [
  { value: 'full_series',  label: 'Full Series Pass · all 6 weeks' },
  { value: 'drop_in',      label: 'Drop-in · pay per class' },
  { value: 'vip',          label: 'VIP Pass · priority + perks' },
  { value: 'not_sure',     label: 'Not sure yet — just keep me in the loop' },
]

const TIME_OPTIONS = [
  { value: 'mon_5_9',     label: 'Monday',          sub: '5 – 9 PM' },
  { value: 'tue_after8',  label: 'Tuesday',         sub: 'After 8 PM' },
  { value: 'wed_after8',  label: 'Wednesday',       sub: 'After 8 PM' },
  { value: 'thu_after8',  label: 'Thursday',        sub: 'After 8 PM' },
  { value: 'fri_5_9',     label: 'Friday',          sub: '5 – 9 PM' },
  { value: 'sun_morning', label: 'Sunday Morning',  sub: '10 AM – 1 PM' },
]

export default function AdultSummerSeries() {
  const [form, setForm] = useState(INITIAL_FORM)
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState('')

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function toggleClassInterest(name, checked) {
    setForm((prev) => ({
      ...prev,
      classInterest: checked
        ? [...prev.classInterest, name]
        : prev.classInterest.filter((c) => c !== name),
    }))
  }

  function togglePreferredTime(value, checked) {
    setForm((prev) => ({
      ...prev,
      preferredTimes: checked
        ? [...prev.preferredTimes, value]
        : prev.preferredTimes.filter((t) => t !== value),
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('submitting')
    setErrorMsg('')

    const { error } = await supabase
      .from('adult_series_interest')
      .insert([{
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        class_interest: form.classInterest.length ? form.classInterest : null,
        preferred_times: form.preferredTimes.length ? form.preferredTimes : null,
        pass_interest: form.passInterest || null,
        notes: form.notes || null,
      }])

    if (error) {
      console.error('Supabase insert error:', JSON.stringify(error, null, 2))
      setStatus('error')
      setErrorMsg('Something went wrong. Please try again or email info@capitalcoredance.com.')
      return
    }

    fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        formType: 'adult_series_interest',
        name: form.name,
        email: form.email,
        phone: form.phone,
        classInterest: form.classInterest,
        preferredTimes: form.preferredTimes,
        passInterest: form.passInterest,
        notes: form.notes,
      }),
    }).catch(() => {})

    setStatus('success')
  }

  return (
    <div className="min-h-screen flex flex-col bg-warm-ivory">
      <SEO
        title="Adult Summer Series · Move For Confidence, Connection &amp; Community | Capital Core Dance Studio"
        description="A boutique 6-week movement series for women in Midlothian, VA. Rotating weekly themes — Calm Confidence, Throwback Flow, and Femme Flow. Join the interest list."
        canonical="/adult-summer-series"
      />
      <Navbar />
      <PageHeader
        eyebrow="Capital Core Dance"
        title="Adult Summer Series"
        subtitle="A boutique 6-week movement series for women — rotating themes, supportive community, and a space to invest in you."
      />

      <main className="flex-1">
        {/* ── Hero ────────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden" style={{ backgroundColor: '#faf3eb' }}>
          {/* soft botanical accents */}
          <div className="absolute top-6 left-6 text-warm-gold/40 text-4xl font-script select-none pointer-events-none">❦</div>
          <div className="absolute bottom-6 right-8 text-warm-gold/30 text-3xl font-script select-none pointer-events-none">✦</div>

          <div className="max-w-4xl mx-auto px-6 py-10 sm:py-12 text-center relative">
            <p className="text-warm-burgundy font-serif italic text-xs tracking-[0.4em] uppercase mb-3">
              Move For
            </p>
            <h2 className="font-serif text-warm-ink text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[0.95]">
              CONFIDENCE
            </h2>
            <p className="font-script text-warm-burgundy text-3xl sm:text-4xl md:text-5xl leading-tight mt-1">
              Connection &amp; Community
            </p>

            <div className="mt-5 flex items-center justify-center gap-3">
              <div className="h-px bg-warm-mocha/40 w-10" />
              <span className="text-warm-gold text-sm">❤</span>
              <div className="h-px bg-warm-mocha/40 w-10" />
            </div>

            <p className="mt-4 text-warm-ink font-serif text-sm sm:text-base tracking-[0.25em] uppercase leading-relaxed">
              Three Unique Classes. One Powerful You.
            </p>
            <p className="text-warm-ink/80 font-serif italic text-sm sm:text-base mt-1">
              This summer, invest in you.
            </p>

            <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => document.getElementById('interest-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className="text-warm-ink font-serif tracking-[0.25em] uppercase text-xs font-bold px-7 py-3 rounded-sm border-2 hover:shadow-xl hover:scale-[1.03] active:scale-[0.98] transition-all"
                style={{
                  background: 'linear-gradient(135deg, #f9c5cb 0%, #f4a8b4 100%)',
                  borderColor: '#e890a5',
                  boxShadow: '0 10px 24px -8px rgba(244, 168, 180, 0.65)',
                }}
              >
                Join the Interest List →
              </button>
              <button
                type="button"
                onClick={() => document.getElementById('classes')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className="text-warm-ink font-serif tracking-[0.2em] uppercase text-[11px] font-bold px-6 py-3 rounded-sm border-2 hover:shadow-lg hover:scale-[1.03] active:scale-[0.98] transition-all"
                style={{
                  background: 'linear-gradient(135deg, #f0d68a 0%, #c9a868 100%)',
                  borderColor: '#a8884a',
                  boxShadow: '0 8px 20px -8px rgba(201, 168, 104, 0.55)',
                }}
              >
                Explore the Classes
              </button>
            </div>
          </div>
        </section>

        {/* ── Three Classes ────────────────────────────────────────────────── */}
        <section id="classes" className="bg-warm-cream py-16 sm:py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <p className="text-warm-burgundy font-serif italic tracking-[0.35em] uppercase text-xs text-center mb-2">
              The Series
            </p>
            <h2 className="text-warm-ink font-serif text-3xl sm:text-4xl font-black text-center tracking-tight mb-12">
              Three Rotating Themes
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14">
              {CLASSES.map((c) => (
                <article
                  key={c.title}
                  className="flex flex-col text-center"
                >
                  {/* Number + accent line */}
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="h-px flex-1" style={{ backgroundColor: c.accent, opacity: 0.4 }} />
                    <span className="font-script text-2xl leading-none" style={{ color: c.accent }}>
                      {c.number}
                    </span>
                    <div className="h-px flex-1" style={{ backgroundColor: c.accent, opacity: 0.4 }} />
                  </div>

                  {/* Title */}
                  <h3 className="font-serif text-warm-ink text-3xl sm:text-4xl font-black tracking-tight leading-none">
                    {c.title}
                  </h3>
                  <p className="font-script text-4xl sm:text-5xl leading-tight mt-1" style={{ color: c.accent }}>
                    {c.titleScript}
                  </p>

                  {/* Tagline */}
                  <p className="font-serif italic text-sm mt-5" style={{ color: c.accentInk }}>
                    {c.tagline}
                  </p>

                  {/* Description */}
                  <p className="text-warm-ink/85 text-sm leading-relaxed mt-4">
                    {c.description}
                  </p>

                  {/* Features as inline text */}
                  <div className="mt-6 flex flex-col gap-1.5 text-[11px] font-bold tracking-[0.2em] uppercase" style={{ color: c.accentInk }}>
                    {c.pills.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── All Classes Are ──────────────────────────────────────────────── */}
        <section
          className="py-14 px-6 border-y border-warm-border"
          style={{ backgroundColor: '#f9e3da' }}
        >
          <div className="max-w-5xl mx-auto">
            <p className="text-warm-burgundy font-serif italic tracking-[0.35em] uppercase text-xs text-center mb-8">
              All Classes Are
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-6 sm:gap-y-0 sm:divide-x divide-warm-burgundy/20">
              {ALL_CLASS_FEATURES.map(({ label, accent }) => (
                <div key={label} className="px-4 text-center">
                  <div className="w-10 h-px mx-auto mb-3" style={{ backgroundColor: accent }} />
                  <p className="font-serif text-warm-ink text-xs sm:text-sm font-bold tracking-widest uppercase leading-tight">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Details ──────────────────────────────────────────────────────── */}
        <section className="bg-warm-cream py-14 px-6">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-y-10 md:gap-y-0 md:divide-x divide-warm-border/70">
            <div className="md:px-6 text-center">
              <p className="text-warm-burgundy font-serif italic tracking-[0.3em] uppercase text-xs mb-3">
                The Format
              </p>
              <p className="font-serif text-warm-ink font-bold text-xl sm:text-2xl">6 Weeks · Once a Week</p>
              <p className="text-warm-ink/80 text-sm mt-2 leading-relaxed">
                One-hour classes. Three rotating themes. Come every week, or just when you can.
              </p>
            </div>
            <div className="md:px-6 text-center">
              <p className="text-warm-burgundy font-serif italic tracking-[0.3em] uppercase text-xs mb-3">
                Pricing
              </p>
              <p className="font-serif text-warm-ink font-bold text-xl sm:text-2xl">
                $110 – $145 <span className="font-normal text-warm-taupe text-base">full series</span>
              </p>
              <p className="font-serif text-warm-ink font-bold text-base sm:text-lg mt-1">
                $20 – $25 <span className="font-normal text-warm-taupe text-sm">per drop-in</span>
              </p>
              <p className="text-warm-ink/70 text-xs mt-2 italic">
                Final pricing finalized once class times are confirmed.
              </p>
            </div>
            <div className="md:px-6 text-center">
              <p className="text-warm-burgundy font-serif italic tracking-[0.3em] uppercase text-xs mb-3">
                Capital Core Dance
              </p>
              <p className="font-serif text-warm-ink font-bold text-xl sm:text-2xl">A Stronger You</p>
              <p className="text-warm-ink/80 text-sm mt-2 leading-relaxed">
                A community that moves — boutique movement experiences for women in Midlothian, VA.
              </p>
            </div>
          </div>
        </section>

        {/* ── Mission Quote ────────────────────────────────────────────────── */}
        <section className="bg-warm-burgundy py-12 px-6 text-center">
          <p className="font-script text-warm-ivory text-3xl sm:text-4xl md:text-5xl leading-tight">
            Your summer. Your movement. Your confidence.
          </p>
        </section>

        {/* ── Flyer + Interest List (side-by-side on lg+) ─────────────────── */}
        <section id="interest-list" className="bg-white py-16 sm:py-20 px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-start">

            {/* Flyer (left on lg+) */}
            <div className="lg:sticky lg:top-24">
              <img
                src="/flyer-adult-summer-series.png"
                alt="Capital Core Adult Summer Series flyer — Move for Confidence, Connection & Community — Calm Confidence, Throwback Flow, Femme Flow — 6 weeks once a week"
                className="w-full rounded-md shadow-xl border border-surface-border"
              />
            </div>

            {/* Form (right on lg+) */}
            <div>
              <p className="text-brand-red text-xs font-bold tracking-[0.3em] uppercase mb-2">
                Spots are limited
              </p>
              <h2 className="text-navy-dark text-2xl sm:text-3xl font-black tracking-tight">
                Join Our Interest List
              </h2>
              <p className="text-[#5a6a8a] text-sm sm:text-base mt-3 mb-8 leading-relaxed">
                Be the first to know registration dates, class times, and special offers. No spam — just a heads-up when sign-ups open.
              </p>

              {status === 'success' ? (
                <div className="bg-[#fff5f8] border border-[#f4c8d4] rounded-lg px-6 py-8 text-center">
                  <p className="font-script text-warm-burgundy text-4xl mb-3">You're on the list ♡</p>
                  <p className="text-[#3a4a6a] text-sm leading-relaxed">
                    Thank you, <span className="font-bold text-navy-dark">{form.name.split(' ')[0] || 'friend'}</span> — we'll be in touch as soon as registration opens. Keep an eye on your inbox.
                  </p>
                  <p className="text-[#8a9aaa] text-xs mt-4">
                    In the meantime, follow us on <a href="https://www.instagram.com/capitalcoredance" target="_blank" rel="noreferrer" className="text-brand-red underline">Instagram</a>{' '}for behind-the-scenes peeks.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5" aria-label="Adult Summer Series interest list">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-navy-dark text-sm font-semibold" htmlFor="name">
                      Your Name <span className="text-brand-red text-xs font-normal">required</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      placeholder="Full name"
                      value={form.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className="border border-surface-border rounded-md px-4 py-2.5 text-sm bg-surface-light focus:outline-none focus:border-[#f4a8b4] focus:ring-1 focus:ring-[#f4a8b4]"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex flex-col gap-1.5 flex-1">
                      <label className="text-navy-dark text-sm font-semibold" htmlFor="email">
                        Email <span className="text-brand-red text-xs font-normal">required</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        placeholder="your@email.com"
                        value={form.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className="border border-surface-border rounded-md px-4 py-2.5 text-sm bg-surface-light focus:outline-none focus:border-[#f4a8b4] focus:ring-1 focus:ring-[#f4a8b4]"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 flex-1">
                      <label className="text-navy-dark text-sm font-semibold" htmlFor="phone">
                        Phone <span className="text-[#8a9aaa] text-xs font-normal">(optional)</span>
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        placeholder="(000) 000-0000"
                        value={form.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        className="border border-surface-border rounded-md px-4 py-2.5 text-sm bg-surface-light focus:outline-none focus:border-[#f4a8b4] focus:ring-1 focus:ring-[#f4a8b4]"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-navy-dark text-sm font-semibold">
                      Which classes interest you? <span className="text-[#8a9aaa] text-xs font-normal">(select any)</span>
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-1">
                      {CLASSES.map((c) => {
                        const label = `${c.title} ${c.titleScript}`
                        const checked = form.classInterest.includes(label)
                        return (
                          <label
                            key={label}
                            className={`relative border rounded-md px-3 py-3 cursor-pointer text-center transition-colors ${
                              checked
                                ? 'border-[#f4a8b4] bg-[#fff5f8]'
                                : 'border-surface-border bg-white hover:border-[#c8ddf4]'
                            }`}
                          >
                            <input
                              type="checkbox"
                              className="sr-only"
                              checked={checked}
                              onChange={(e) => toggleClassInterest(label, e.target.checked)}
                            />
                            {checked && (
                              <span
                                aria-hidden="true"
                                className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#f4a8b4] text-white flex items-center justify-center text-xs font-bold"
                              >
                                ✓
                              </span>
                            )}
                            <p className="font-serif text-navy-dark text-sm font-bold">{c.title}</p>
                            <p className="font-script text-warm-burgundy text-lg leading-none">{c.titleScript}</p>
                          </label>
                        )
                      })}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-navy-dark text-sm font-semibold">
                      Which day works best for you? <span className="text-[#8a9aaa] text-xs font-normal">(select any)</span>
                    </span>
                    <p className="text-[#8a9aaa] text-xs italic">
                      These are <span className="font-semibold not-italic text-navy-dark">possible</span> class times — your feedback helps us pick the slot most of you can make. Tues / Wed / Thurs would run after 8 PM, Mon &amp; Fri are flexible 5–9 PM, and Sunday mornings 10 AM – 1 PM are an option too.
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
                      {TIME_OPTIONS.map((t) => {
                        const checked = form.preferredTimes.includes(t.value)
                        return (
                          <label
                            key={t.value}
                            className={`relative border rounded-md px-3 py-3 cursor-pointer text-center transition-colors ${
                              checked
                                ? 'border-[#f4a8b4] bg-[#fff5f8]'
                                : 'border-surface-border bg-white hover:border-[#c8ddf4]'
                            }`}
                          >
                            <input
                              type="checkbox"
                              className="sr-only"
                              checked={checked}
                              onChange={(e) => togglePreferredTime(t.value, e.target.checked)}
                            />
                            {checked && (
                              <span
                                aria-hidden="true"
                                className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#f4a8b4] text-white flex items-center justify-center text-xs font-bold"
                              >
                                ✓
                              </span>
                            )}
                            <p className="text-navy-dark text-sm font-bold">{t.label}</p>
                            <p className="text-[#5a6a8a] text-xs mt-0.5">{t.sub}</p>
                          </label>
                        )
                      })}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-navy-dark text-sm font-semibold" htmlFor="passInterest">
                      Pricing Interest <span className="text-[#8a9aaa] text-xs font-normal">(optional)</span>
                    </label>
                    <select
                      id="passInterest"
                      value={form.passInterest}
                      onChange={(e) => handleChange('passInterest', e.target.value)}
                      className="border border-surface-border rounded-md px-4 py-2.5 text-sm bg-surface-light focus:outline-none focus:border-[#f4a8b4] focus:ring-1 focus:ring-[#f4a8b4]"
                    >
                      <option value="">— Pick what feels right —</option>
                      {PASS_OPTIONS.map((p) => (
                        <option key={p.value} value={p.value}>{p.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-navy-dark text-sm font-semibold" htmlFor="notes">
                      Anything Else? <span className="text-[#8a9aaa] text-xs font-normal">(optional)</span>
                    </label>
                    <textarea
                      id="notes"
                      rows={3}
                      placeholder="Questions, scheduling preferences, anything you'd like us to know..."
                      value={form.notes}
                      onChange={(e) => handleChange('notes', e.target.value)}
                      className="border border-surface-border rounded-md px-4 py-2.5 text-sm bg-surface-light resize-none focus:outline-none focus:border-[#f4a8b4] focus:ring-1 focus:ring-[#f4a8b4]"
                    />
                  </div>

                  {status === 'error' && (
                    <p className="text-brand-red text-sm">{errorMsg}</p>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full text-warm-ink font-serif tracking-[0.25em] uppercase text-sm font-bold px-8 py-4 rounded-md border-2 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                    style={{
                      background: status === 'submitting'
                        ? '#f4a8b4'
                        : 'linear-gradient(135deg, #f9c5cb 0%, #f4a8b4 100%)',
                      borderColor: '#e890a5',
                      boxShadow: '0 10px 24px -8px rgba(244, 168, 180, 0.65)',
                    }}
                  >
                    {status === 'submitting' ? 'Adding you to the list…' : 'Join the Interest List →'}
                  </button>

                  <p className="text-[#8a9aaa] text-xs text-center">
                    Your information stays with us — we never share or sell. Questions? <a href="mailto:info@capitalcoredance.com" className="underline hover:text-navy-dark">info@capitalcoredance.com</a>
                  </p>
                </form>
              )}
            </div>

          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
