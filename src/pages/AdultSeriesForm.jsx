import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import PageHeader from '../components/PageHeader'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import { supabase } from '../lib/supabase'
import { applyPromo, validatePromoCode } from '../lib/promos'
import { PASS_PRICE, DROP_IN_PRICE, SESSION_DATES, dateLabel } from '../lib/adultSeries'
import PrivacyNotice from '../components/PrivacyNotice'

const EXPERIENCE_OPTIONS = [
  'New to dance — total beginner',
  'A little experience',
  'Comfortable dancer',
]

const INITIAL_FORM = {
  name: '',
  email: '',
  phone: '',
  regType: 'pass', // 'pass' | 'drop_in'
  dropInDate: '',
  experience: '',
  notes: '',
  policyAck: false,
  waiverAck: false,
}

export default function AdultSeriesForm() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [form, setForm] = useState(INITIAL_FORM)
  const [status, setStatus] = useState('idle')
  const [errorMsg, setErrorMsg] = useState('')

  // Promo code state
  const [promoInput, setPromoInput] = useState('')
  const [promo, setPromo] = useState(null)
  const [promoStatus, setPromoStatus] = useState('idle') // idle | checking | applied | error
  const [promoError, setPromoError] = useState('')

  async function tryApplyPromo(rawCode) {
    setPromoStatus('checking')
    setPromoError('')
    const result = await validatePromoCode(rawCode, 'adult_series')
    if (!result.valid) {
      setPromo(null)
      setPromoStatus('error')
      setPromoError(result.error || 'That code isn\'t valid.')
      return false
    }
    setPromo(result)
    setPromoStatus('applied')
    return true
  }

  function clearPromo() {
    setPromo(null)
    setPromoInput('')
    setPromoStatus('idle')
    setPromoError('')
  }

  // Auto-apply ?promo= from URL once on mount.
  useEffect(() => {
    const urlPromo = searchParams.get('promo')
    if (!urlPromo) return
    setPromoInput(urlPromo.toUpperCase())
    tryApplyPromo(urlPromo)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const totals = useMemo(() => {
    const base = form.regType === 'pass' ? PASS_PRICE : DROP_IN_PRICE
    const { discount, total: dueToday } = applyPromo(promo, base)
    return { base, discount, dueToday }
  }, [form.regType, promo])

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('submitting')
    setErrorMsg('')

    if (!form.name.trim()) { setStatus('error'); setErrorMsg('Please enter your name.'); return }
    if (!form.email.trim()) { setStatus('error'); setErrorMsg('Please enter your email.'); return }
    if (form.regType === 'drop_in' && !form.dropInDate) {
      setStatus('error'); setErrorMsg('Please pick which Monday you\'d like to drop in.'); return
    }

    const typeLabel = form.regType === 'pass'
      ? 'Summer Series Pass · all 6 Mondays'
      : `Drop-In · ${dateLabel(form.dropInDate)}`

    const { data, error } = await supabase
      .from('adult_series_registrations')
      .insert([{
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        registration_type: form.regType,
        drop_in_date: form.regType === 'drop_in' ? form.dropInDate : null,
        experience: form.experience || null,
        amount_due: totals.dueToday,
        promo_code: promo?.code || null,
        promo_label: promo?.label || null,
        discount_amount: totals.discount || 0,
        notes: form.notes || null,
      }])
      .select()
      .single()

    if (error) {
      console.error('Supabase insert error:', JSON.stringify(error, null, 2))
      setStatus('error')
      setErrorMsg('Something went wrong saving your registration. Please try again or email info@capitalcoredance.com.')
      return
    }

    fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        formType: 'adult_series_registration',
        name: form.name,
        email: form.email,
        phone: form.phone,
        registrationType: form.regType,
        typeLabel,
        dropInDate: form.regType === 'drop_in' ? dateLabel(form.dropInDate) : null,
        experience: form.experience,
        amountDue: totals.dueToday,
        promoCode: promo?.code || null,
        promoLabel: promo?.label || null,
        discountAmount: totals.discount || 0,
        notes: form.notes,
      }),
    }).catch(() => {})

    navigate('/adult-summer-series/payment', {
      state: {
        registrationId: data?.id || null,
        name: form.name,
        email: form.email,
        registrationType: form.regType,
        typeLabel,
        dropInDate: form.regType === 'drop_in' ? form.dropInDate : null,
        amountDueToday: totals.dueToday,
        promoCode: promo?.code || null,
        promoLabel: promo?.label || null,
        discountAmount: totals.discount || 0,
      },
    })
  }

  const inputClass = 'border border-surface-border rounded-md px-4 py-2.5 text-sm bg-surface-light focus:outline-none focus:border-[#f4a8b4] focus:ring-1 focus:ring-[#f4a8b4]'
  const labelClass = 'text-navy-dark text-sm font-semibold'
  const fieldClass = 'flex flex-col gap-1.5'

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Adult Summer Series Registration | Capital Core Dance Studio – Midlothian, VA"
        description="Register for the Adult Summer Series at Capital Core Dance Studio. Mondays 6–7:30 PM, six weeks starting June 29. $25 drop-in or $120 Summer Series Pass."
        canonical="/adult-summer-series/signup"
        noindex
      />
      <Navbar />
      <PageHeader
        eyebrow="Adult Summer Series · Mondays 6:00 – 7:30 PM"
        title="Register for the Series"
        subtitle="A 90-minute movement experience for women — Throwback Flow, Femme Flow & Calm Confidence. Grab the full pass or drop in for a single Monday."
      />

      <section className="bg-white flex-1 px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <form className="flex flex-col gap-8" onSubmit={handleSubmit} aria-label="Adult Summer Series registration form">

            {/* ── Step 1: Your info ── */}
            <div className="flex flex-col gap-5">
              <div>
                <p className="text-brand-red text-xs font-bold tracking-[0.3em] uppercase mb-1">Step 1</p>
                <h2 className="text-navy-dark text-lg font-black">Your Details</h2>
                <p className="text-[#5a6a8a] text-sm mt-1">
                  No dance experience needed. No pressure. Just a space to move, grow, and do something for yourself.
                </p>
              </div>

              <div className={fieldClass}>
                <label className={labelClass} htmlFor="name">Full Name <span className="text-brand-red text-xs font-normal">required</span></label>
                <input id="name" type="text" required placeholder="Your name" value={form.name} onChange={(e) => update('name', e.target.value)} className={inputClass} />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className={`${fieldClass} flex-1`}>
                  <label className={labelClass} htmlFor="email">Email Address <span className="text-brand-red text-xs font-normal">required</span></label>
                  <input id="email" type="email" required placeholder="your@email.com" value={form.email} onChange={(e) => update('email', e.target.value)} className={inputClass} />
                </div>
                <div className={`${fieldClass} flex-1`}>
                  <label className={labelClass} htmlFor="phone">Phone Number <span className="text-[#8a9aaa] text-xs font-normal">(optional)</span></label>
                  <input id="phone" type="tel" placeholder="(000) 000-0000" value={form.phone} onChange={(e) => update('phone', e.target.value)} className={inputClass} />
                </div>
              </div>

              <div className={fieldClass}>
                <label className={labelClass} htmlFor="experience">Dance Experience <span className="text-[#8a9aaa] text-xs font-normal">(optional)</span></label>
                <select id="experience" value={form.experience} onChange={(e) => update('experience', e.target.value)} className={inputClass}>
                  <option value="">— Prefer not to say —</option>
                  {EXPERIENCE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>

            <hr className="border-surface-border" />

            {/* ── Step 2: Pass or drop-in ── */}
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-brand-red text-xs font-bold tracking-[0.3em] uppercase mb-1">Step 2</p>
                <h2 className="text-navy-dark text-lg font-black">Pass or Drop-In?</h2>
                <p className="text-[#5a6a8a] text-sm mt-1">
                  The Summer Series Pass covers all six Monday classes and saves you $30.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {[
                  { value: 'pass', title: `Summer Series Pass · $${PASS_PRICE}`, desc: 'All 6 Monday classes (June 29 – Aug 3). Best value — save $30.' },
                  { value: 'drop_in', title: `Drop-In · $${DROP_IN_PRICE}`, desc: 'Join us for a single Monday class.' },
                ].map((opt) => {
                  const active = form.regType === opt.value
                  return (
                    <label
                      key={opt.value}
                      className={`border rounded-lg px-4 py-3 cursor-pointer transition-colors ${
                        active ? 'border-[#f4a8b4] bg-[#fff5f8]' : 'border-surface-border bg-white hover:border-[#c8ddf4]'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="regType"
                          value={opt.value}
                          checked={active}
                          onChange={() => update('regType', opt.value)}
                          className="mt-1 flex-shrink-0"
                        />
                        <div>
                          <p className="font-semibold text-navy-dark">{opt.title}</p>
                          <p className="text-[#5a6a8a] text-xs mt-0.5">{opt.desc}</p>
                        </div>
                      </div>
                    </label>
                  )
                })}
              </div>

              {form.regType === 'drop_in' && (
                <div className={fieldClass}>
                  <label className={labelClass} htmlFor="dropInDate">Which Monday? <span className="text-brand-red text-xs font-normal">required</span></label>
                  <select id="dropInDate" required value={form.dropInDate} onChange={(e) => update('dropInDate', e.target.value)} className={inputClass}>
                    <option value="">Select a date…</option>
                    {SESSION_DATES.map((d) => (
                      <option key={d.value} value={d.value}>{d.label}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Promo code */}
            <div className="flex flex-col gap-2">
              <p className={labelClass}>Promo code <span className="text-[#8a9aaa] text-xs font-normal">(optional)</span></p>
              {promoStatus === 'applied' && promo ? (
                <div className="bg-[#f0faf5] border border-[#b5e0c8] rounded-md px-4 py-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[#0a7c3e] font-black text-sm">{promo.code} applied</p>
                    <p className="text-[#3a4a6a] text-xs mt-0.5">{promo.label}</p>
                  </div>
                  <button type="button" onClick={clearPromo} className="text-[#5a6a8a] text-xs font-bold underline hover:text-navy-dark">Remove</button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                    className={`${inputClass} flex-1 uppercase tracking-wide`}
                  />
                  <button
                    type="button"
                    onClick={() => tryApplyPromo(promoInput)}
                    disabled={promoStatus === 'checking' || !promoInput.trim()}
                    className="bg-navy-dark text-white text-sm font-bold px-5 rounded-md hover:bg-navy-mid transition-colors disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {promoStatus === 'checking' ? 'Checking…' : 'Apply'}
                  </button>
                </div>
              )}
              {promoStatus === 'error' && promoError && (
                <p className="text-brand-red text-xs">{promoError}</p>
              )}
            </div>

            {/* Order summary */}
            <div className="bg-white border-2 border-navy-dark rounded-lg px-5 py-4">
              <p className="text-navy-dark font-bold mb-2 text-sm uppercase tracking-wide">Order Summary</p>
              <div className="flex justify-between text-sm">
                <span className="text-[#5a6a8a]">
                  {form.regType === 'pass'
                    ? 'Summer Series Pass · all 6 Mondays'
                    : `Drop-In${form.dropInDate ? ` · ${dateLabel(form.dropInDate)}` : ''}`}
                </span>
                <span className="font-semibold text-navy-dark">${totals.base}</span>
              </div>
              {totals.discount > 0 && (
                <div className="flex justify-between text-sm pt-1">
                  <span className="text-[#0a7c3e]">Promo discount{promo?.code ? ` (${promo.code})` : ''}</span>
                  <span className="font-semibold text-[#0a7c3e]">−${totals.discount}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-2 mt-2 border-t border-surface-border">
                <span className="text-navy-dark font-bold">Due today</span>
                <span className="text-navy-dark font-black text-2xl">${totals.dueToday}</span>
              </div>
            </div>

            <hr className="border-surface-border" />

            {/* Notes */}
            <div className="flex flex-col gap-3">
              <div>
                <p className="text-brand-red text-xs font-bold tracking-[0.3em] uppercase mb-1">Anything Else?</p>
                <h2 className="text-navy-dark text-lg font-black">Notes <span className="text-[#8a9aaa] text-sm font-normal">(optional)</span></h2>
              </div>
              <textarea
                rows={3}
                placeholder="Questions, accommodations, or anything we should know..."
                value={form.notes}
                onChange={(e) => update('notes', e.target.value)}
                className={`${inputClass} resize-none`}
              />
            </div>

            <hr className="border-surface-border" />

            {/* Policies */}
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-brand-red text-xs font-bold tracking-[0.3em] uppercase mb-1">Policies</p>
                <h2 className="text-navy-dark text-lg font-black">Acknowledgements</h2>
              </div>

              <div className="bg-[#fff5f8] border border-[#f4c8d4] rounded-lg px-5 py-4">
                <label className="flex items-start gap-3 text-[#3a4a6a] text-sm cursor-pointer">
                  <input type="checkbox" checked={form.policyAck} onChange={(e) => update('policyAck', e.target.checked)} required className="mt-0.5 flex-shrink-0" />
                  I understand that drop-in and Summer Series Pass payments are non-refundable, and that spots are limited and confirmed in the order they're paid.
                </label>
              </div>

              <div className="bg-[#f0f6ff] border border-[#c8ddf4] rounded-lg px-5 py-4">
                <label className="flex items-start gap-3 text-[#3a4a6a] text-sm cursor-pointer">
                  <input type="checkbox" checked={form.waiverAck} onChange={(e) => update('waiverAck', e.target.checked)} required className="mt-0.5 flex-shrink-0" />
                  I understand I'll complete a movement waiver before my first class.
                </label>
              </div>
            </div>

            {status === 'error' && (
              <p className="text-brand-red text-sm">{errorMsg}</p>
            )}

            <PrivacyNotice />

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="bg-brand-red text-white font-bold py-3 rounded-md hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === 'submitting'
                ? 'Submitting…'
                : totals.dueToday <= 0
                  ? 'Confirm Registration →'
                  : `Continue to Payment · $${totals.dueToday} →`}
            </button>

            <p className="text-[#8a9aaa] text-xs text-center">
              Questions? Call us at <a href="tel:8042344014" className="underline hover:text-navy-dark">(804) 234-4014</a> or email <a href="mailto:info@capitalcoredance.com" className="underline hover:text-navy-dark">info@capitalcoredance.com</a>.
            </p>

          </form>
        </div>
      </section>

      <Footer />
    </div>
  )
}
