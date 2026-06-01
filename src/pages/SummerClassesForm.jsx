import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import PageHeader from '../components/PageHeader'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import { supabase } from '../lib/supabase'
import { applyPromo, validatePromoCode } from '../lib/promos'
import PrivacyNotice from '../components/PrivacyNotice'

const SUMMER_CLASSES = [
  { key: 'tu-tiny',  day: 'Tuesday',   time: '5:30 – 6:00 PM', name: 'Tiny Ballet & Tumble',             ages: 'Ages 2–3',  duration: '30 min', price: 120 },
  { key: 'tu-bbhh',  day: 'Tuesday',   time: '6:00 – 7:00 PM', name: 'Beginner Ballet & Hip Hop',        ages: 'Ages 5–7',  duration: '60 min', price: 140 },
  { key: 'tu-tumb',  day: 'Tuesday',   time: '7:00 – 7:45 PM', name: 'Tumble Techniques',                ages: 'Ages 6+',   duration: '45 min', price: 120 },
  { key: 'we-bbtap', day: 'Wednesday', time: '5:30 – 6:30 PM', name: 'Beginner Ballet & Tap',            ages: 'Ages 5–7',  duration: '60 min', price: 140 },
  { key: 'we-hh',    day: 'Wednesday', time: '6:30 – 7:15 PM', name: 'Hip Hop',                          ages: 'Ages 5+',   duration: '45 min', price: 120 },
  { key: 'we-bc',    day: 'Wednesday', time: '7:15 – 8:30 PM', name: 'Ballet & Contemporary Technique',  ages: 'Ages 7+',   duration: '75 min', price: 180 },
  { key: 'th-tiny',  day: 'Thursday',  time: '5:30 – 6:00 PM', name: 'Tiny Ballet & Tumble',             ages: 'Ages 3–4',  duration: '30 min', price: 120 },
  { key: 'th-jt',    day: 'Thursday',  time: '6:00 – 7:00 PM', name: 'Beginner Jazz & Tumble',           ages: 'Ages 5–9',  duration: '60 min', price: 140 },
  { key: 'th-tt',    day: 'Thursday',  time: '7:00 – 7:45 PM', name: 'Tik Tok Hip Hop Dance Workshop',   ages: 'Ages 6+',   duration: '45 min', price: 120 },
]

const SESSION_WEEKS = [
  { value: 'wk1', label: 'Week 1 · June 23–28' },
  { value: 'wk2', label: 'Week 2 · June 30 – July 5' },
  { value: 'wk3', label: 'Week 3 · July 7–12' },
  { value: 'wk4', label: 'Week 4 · July 14–19' },
  { value: 'wk5', label: 'Week 5 · July 21–26' },
  { value: 'wk6', label: 'Week 6 · July 28–30' },
]

const FLEX_PASS_PRICE = 329
const DROP_IN_PRICE = 25
const DEPOSIT_AMOUNT = 50

const GENDER_OPTIONS = ['Female', 'Male', 'Non-binary', 'Prefer not to say']

const classByKey = (key) => SUMMER_CLASSES.find((c) => c.key === key)

function newDancer() {
  return {
    id: Math.random().toString(36).slice(2, 10),
    isReturning: '',         // 'Yes' | 'No'
    name: '',
    age: '',
    gender: '',
    signupType: 'classes',   // 'classes' | 'flex_pass' | 'drop_in'
    classes: [],             // class keys
    dropInClass: '',
    dropInWeek: '',
  }
}

const INITIAL_FORM = {
  parentName: '',
  email: '',
  phone: '',
  dancers: [newDancer()],
  paymentChoice: 'deposit',  // 'deposit' | 'full' (applies to non-dropin only)
  notes: '',
  policyDeposit: false,
  policyBalance: false,
  waiverAck: false,
}

function computeDancerTuition(dancer) {
  if (dancer.signupType === 'classes') {
    return dancer.classes.reduce((sum, k) => sum + (classByKey(k)?.price || 0), 0)
  }
  if (dancer.signupType === 'flex_pass') return FLEX_PASS_PRICE
  if (dancer.signupType === 'drop_in')   return DROP_IN_PRICE
  return 0
}

function describeDancerItems(dancer) {
  if (dancer.signupType === 'classes') {
    return dancer.classes.map((k) => {
      const c = classByKey(k)
      return c ? { key: `${dancer.id}-${k}`, label: `${dancer.name || 'Dancer'} · ${c.day} ${c.name} (${c.time})`, price: c.price } : null
    }).filter(Boolean)
  }
  if (dancer.signupType === 'flex_pass') {
    return [{ key: `${dancer.id}-flex`, label: `${dancer.name || 'Dancer'} · Summer Flex Pass (unlimited)`, price: FLEX_PASS_PRICE }]
  }
  if (dancer.signupType === 'drop_in') {
    const c = classByKey(dancer.dropInClass)
    const w = SESSION_WEEKS.find((s) => s.value === dancer.dropInWeek)
    const label = c && w
      ? `${dancer.name || 'Dancer'} · Drop-in: ${c.day} ${c.name} (${c.time}) — ${w.label}`
      : `${dancer.name || 'Dancer'} · Drop-in`
    return [{ key: `${dancer.id}-dropin`, label, price: DROP_IN_PRICE }]
  }
  return []
}

export default function SummerClassesForm() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [form, setForm] = useState(INITIAL_FORM)
  const [status, setStatus] = useState('idle')
  const [errorMsg, setErrorMsg] = useState('')

  // Promo code state
  const [promoInput, setPromoInput] = useState('')
  const [promo, setPromo] = useState(null) // { valid, code, label, discountType, discountValue } or null
  const [promoStatus, setPromoStatus] = useState('idle') // idle | checking | applied | error
  const [promoError, setPromoError] = useState('')

  async function tryApplyPromo(rawCode) {
    setPromoStatus('checking')
    setPromoError('')
    const result = await validatePromoCode(rawCode, 'summer_classes')
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
    const perDancer = form.dancers.map((d) => ({
      id: d.id,
      name: d.name,
      signupType: d.signupType,
      items: describeDancerItems(d),
      tuition: computeDancerTuition(d),
    }))
    const items = perDancer.flatMap((d) => d.items)
    const tuitionTotal = perDancer.reduce((s, d) => s + d.tuition, 0)

    // Deposit logic per dancer:
    // - drop_in dancers pay $25 (full) now
    // - others: $50 deposit OR full tuition based on global paymentChoice
    let dueBeforePromo = 0
    for (const d of perDancer) {
      if (d.signupType === 'drop_in') {
        dueBeforePromo += d.tuition
      } else if (form.paymentChoice === 'full') {
        dueBeforePromo += d.tuition
      } else {
        dueBeforePromo += Math.min(DEPOSIT_AMOUNT, d.tuition || DEPOSIT_AMOUNT)
      }
    }

    // Promo applies to the amount due today (trial codes zero it out).
    const { discount, total: dueToday } = applyPromo(promo, dueBeforePromo)
    const balanceDue = promo?.discountType === 'full'
      ? 0
      : Math.max(0, tuitionTotal - dueBeforePromo)
    const dancerCount = form.dancers.length
    const hasNonDropIn = perDancer.some((d) => d.signupType !== 'drop_in')

    return {
      perDancer, items, tuitionTotal,
      dueBeforePromo, discount, dueToday,
      balanceDue, dancerCount, hasNonDropIn,
    }
  }, [form.dancers, form.paymentChoice, promo])

  function updateParent(id, value) {
    setForm((prev) => ({ ...prev, [id]: value }))
  }

  function updateDancer(dancerId, patch) {
    setForm((prev) => ({
      ...prev,
      dancers: prev.dancers.map((d) => d.id === dancerId ? { ...d, ...patch } : d),
    }))
  }

  function toggleDancerClass(dancerId, classKey, checked) {
    setForm((prev) => ({
      ...prev,
      dancers: prev.dancers.map((d) => {
        if (d.id !== dancerId) return d
        const classes = checked ? [...d.classes, classKey] : d.classes.filter((k) => k !== classKey)
        return { ...d, classes }
      }),
    }))
  }

  function addDancer() {
    setForm((prev) => ({ ...prev, dancers: [...prev.dancers, newDancer()] }))
  }

  function removeDancer(dancerId) {
    setForm((prev) => ({
      ...prev,
      dancers: prev.dancers.length > 1 ? prev.dancers.filter((d) => d.id !== dancerId) : prev.dancers,
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('submitting')
    setErrorMsg('')

    // Validate each dancer
    for (const d of form.dancers) {
      if (!d.isReturning) { setStatus('error'); setErrorMsg('Please tell us whether each dancer is returning or new.'); return }
      if (!d.name.trim()) { setStatus('error'); setErrorMsg('Each dancer needs a name.'); return }
      if (d.isReturning === 'No' && (!d.age || !d.gender)) {
        setStatus('error'); setErrorMsg(`We need age and gender for new dancer ${d.name || ''}.`); return
      }
      if (d.signupType === 'classes' && d.classes.length === 0) {
        setStatus('error'); setErrorMsg(`Please pick at least one class for ${d.name || 'each dancer'}.`); return
      }
      if (d.signupType === 'drop_in' && (!d.dropInClass || !d.dropInWeek)) {
        setStatus('error'); setErrorMsg(`Please pick a drop-in class and week for ${d.name || 'each drop-in dancer'}.`); return
      }
    }

    const summaryText = totals.items.map((i) => `${i.label} — $${i.price}`).join(' | ')
    const primary = form.dancers[0]
    const allReturning = form.dancers.every((d) => d.isReturning === 'Yes')

    const dancersForDb = form.dancers.map((d) => ({
      name: d.name,
      isReturning: d.isReturning,
      age: d.isReturning === 'No' ? d.age : null,
      gender: d.isReturning === 'No' ? d.gender : null,
      signupType: d.signupType,
      classes: d.signupType === 'classes' ? d.classes : [],
      dropInClass: d.signupType === 'drop_in' ? d.dropInClass : null,
      dropInWeek: d.signupType === 'drop_in' ? d.dropInWeek : null,
      tuition: computeDancerTuition(d),
    }))

    const { data, error } = await supabase
      .from('summer_class_registrations')
      .insert([{
        parent_name: form.parentName,
        email: form.email,
        phone: form.phone,
        // Legacy single-dancer columns kept for backwards-compat — populated from
        // the first dancer so existing admin queries still see something useful.
        dancer_name: primary?.name || '',
        dancer_age: primary?.age || null,
        dancer_gender: primary?.gender || null,
        current_student: allReturning ? 'Yes' : (form.dancers.some((d) => d.isReturning === 'Yes') ? 'Mixed' : 'No'),
        signup_type: form.dancers.length === 1 ? primary.signupType : 'multi',
        class_selection: form.dancers.length === 1 && primary.signupType === 'classes' ? primary.classes : null,
        drop_in_class: form.dancers.length === 1 && primary.signupType === 'drop_in' ? primary.dropInClass : null,
        drop_in_week: form.dancers.length === 1 && primary.signupType === 'drop_in' ? primary.dropInWeek : null,
        dancers: dancersForDb,
        dancer_count: form.dancers.length,
        summary_text: summaryText,
        tuition_total: totals.tuitionTotal,
        payment_choice: totals.hasNonDropIn ? form.paymentChoice : 'full',
        amount_due_today: totals.dueToday,
        additional_notes: form.notes || null,
        promo_code: promo?.code || null,
        promo_label: promo?.label || null,
        discount_amount: totals.discount || 0,
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
        formType: 'summer_class_registration',
        parentName: form.parentName,
        email: form.email,
        phone: form.phone,
        dancers: dancersForDb,
        dancerCount: form.dancers.length,
        items: totals.items,
        tuitionTotal: totals.tuitionTotal,
        paymentChoice: totals.hasNonDropIn ? form.paymentChoice : 'full',
        amountDueToday: totals.dueToday,
        balanceDue: totals.balanceDue,
        notes: form.notes,
        promoCode: promo?.code || null,
        promoLabel: promo?.label || null,
        discountAmount: totals.discount || 0,
      }),
    }).catch(() => {})

    navigate('/summer-classes/payment', {
      state: {
        registrationId: data?.id || null,
        parentName: form.parentName,
        email: form.email,
        dancers: dancersForDb,
        dancerCount: form.dancers.length,
        items: totals.items,
        tuitionTotal: totals.tuitionTotal,
        paymentChoice: totals.hasNonDropIn ? form.paymentChoice : 'full',
        amountDueToday: totals.dueToday,
        balanceDue: totals.balanceDue,
        promoCode: promo?.code || null,
        promoLabel: promo?.label || null,
        discountAmount: totals.discount || 0,
      },
    })
  }

  const inputClass = 'border border-surface-border rounded-md px-4 py-2.5 text-sm bg-surface-light focus:outline-none focus:border-[#f4a8b4] focus:ring-1 focus:ring-[#f4a8b4]'
  const labelClass = 'text-navy-dark text-sm font-semibold'
  const fieldClass = 'flex flex-col gap-1.5'
  const radioClass = 'flex items-center gap-2 text-[#3a4a6a] text-sm cursor-pointer'

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Summer Class Sign-Up | Capital Core Dance Studio – Midlothian, VA"
        description="Reserve your dancer's spot in Capital Core Dance Studio's 6-week summer classes. Pick per-class, grab the Flex Pass, or drop in. A $50 deposit reserves your spot."
        canonical="/summer-classes/signup"
        noindex
      />
      <Navbar />
      <PageHeader
        eyebrow="Summer 2026 · June 23 – July 30"
        title="Summer Class Sign-Up"
        subtitle="Add one or more dancers, pick what they want to do, and reserve their spots. $50 deposit per dancer applies toward tuition."
      />

      <section className="bg-white flex-1 px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <form className="flex flex-col gap-8" onSubmit={handleSubmit} aria-label="Summer dance class sign-up form">

            {/* ── Step 1: Parent + Dancers ── */}
            <div className="flex flex-col gap-5">
              <div>
                <p className="text-brand-red text-xs font-bold tracking-[0.3em] uppercase mb-1">Step 1</p>
                <h2 className="text-navy-dark text-lg font-black">Parent &amp; Dancers</h2>
                <p className="text-[#5a6a8a] text-sm mt-1">
                  Add as many dancers as you'd like. Returning dancers only need a name — we'll match them in our records.
                </p>
              </div>

              <div className={fieldClass}>
                <label className={labelClass} htmlFor="parentName">Parent / Guardian Full Name <span className="text-brand-red text-xs font-normal">required</span></label>
                <input id="parentName" type="text" required placeholder="Full name" value={form.parentName} onChange={(e) => updateParent('parentName', e.target.value)} className={inputClass} />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className={`${fieldClass} flex-1`}>
                  <label className={labelClass} htmlFor="email">Email Address <span className="text-brand-red text-xs font-normal">required</span></label>
                  <input id="email" type="email" required placeholder="your@email.com" value={form.email} onChange={(e) => updateParent('email', e.target.value)} className={inputClass} />
                </div>
                <div className={`${fieldClass} flex-1`}>
                  <label className={labelClass} htmlFor="phone">Phone Number <span className="text-[#8a9aaa] text-xs font-normal">(optional)</span></label>
                  <input id="phone" type="tel" placeholder="(000) 000-0000" value={form.phone} onChange={(e) => updateParent('phone', e.target.value)} className={inputClass} />
                </div>
              </div>

              {/* Dancers list */}
              <div className="flex flex-col gap-4 mt-2">
                {form.dancers.map((dancer, idx) => (
                  <div
                    key={dancer.id}
                    className="border border-surface-border rounded-lg px-5 py-4 bg-surface-light/40 flex flex-col gap-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-navy-dark font-bold text-sm uppercase tracking-wide">
                        Dancer {idx + 1}{dancer.name ? ` · ${dancer.name}` : ''}
                      </p>
                      {form.dancers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeDancer(dancer.id)}
                          className="text-brand-red text-xs font-bold underline hover:text-red-700"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    {/* Returning / New */}
                    <div className={fieldClass}>
                      <span className={labelClass}>Returning Capital Core student? <span className="text-brand-red text-xs font-normal">required</span></span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                        {[
                          { value: 'Yes', title: 'Returning dancer', desc: 'Info already on file — name only.' },
                          { value: 'No',  title: 'New dancer',        desc: 'First time — we need a few details.' },
                        ].map((opt) => {
                          const active = dancer.isReturning === opt.value
                          return (
                            <label
                              key={opt.value}
                              className={`border rounded-lg px-3 py-2.5 cursor-pointer transition-colors ${
                                active ? 'border-[#f4a8b4] bg-[#fff5f8]' : 'border-surface-border bg-white hover:border-[#c8ddf4]'
                              }`}
                            >
                              <div className="flex items-start gap-2.5">
                                <input
                                  type="radio"
                                  name={`isReturning-${dancer.id}`}
                                  value={opt.value}
                                  checked={active}
                                  onChange={() => updateDancer(dancer.id, { isReturning: opt.value })}
                                  required
                                  className="mt-1 flex-shrink-0"
                                />
                                <div>
                                  <p className="font-semibold text-navy-dark text-sm">{opt.title}</p>
                                  <p className="text-[#5a6a8a] text-xs mt-0.5">{opt.desc}</p>
                                </div>
                              </div>
                            </label>
                          )
                        })}
                      </div>
                    </div>

                    {dancer.isReturning === 'Yes' && (
                      <div className={fieldClass}>
                        <label className={labelClass}>Dancer's Full Name <span className="text-brand-red text-xs font-normal">required</span></label>
                        <input
                          type="text"
                          required
                          placeholder="Dancer's name (so we can match the file)"
                          value={dancer.name}
                          onChange={(e) => updateDancer(dancer.id, { name: e.target.value })}
                          className={inputClass}
                        />
                        <p className="text-[#8a9aaa] text-xs">We'll pull age and other details from our records.</p>
                      </div>
                    )}

                    {dancer.isReturning === 'No' && (
                      <>
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className={`${fieldClass} flex-1`}>
                            <label className={labelClass}>Dancer's Full Name <span className="text-brand-red text-xs font-normal">required</span></label>
                            <input
                              type="text"
                              required
                              placeholder="Dancer's name"
                              value={dancer.name}
                              onChange={(e) => updateDancer(dancer.id, { name: e.target.value })}
                              className={inputClass}
                            />
                          </div>
                          <div className={`${fieldClass} flex-1`}>
                            <label className={labelClass}>Age <span className="text-brand-red text-xs font-normal">required</span></label>
                            <input
                              type="number"
                              min="2"
                              max="18"
                              required
                              placeholder="e.g. 7"
                              value={dancer.age}
                              onChange={(e) => updateDancer(dancer.id, { age: e.target.value })}
                              className={inputClass}
                            />
                          </div>
                        </div>

                        <div className={fieldClass}>
                          <span className={labelClass}>Gender <span className="text-brand-red text-xs font-normal">required</span></span>
                          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-1">
                            {GENDER_OPTIONS.map((opt) => (
                              <label key={opt} className={radioClass}>
                                <input
                                  type="radio"
                                  name={`gender-${dancer.id}`}
                                  value={opt}
                                  checked={dancer.gender === opt}
                                  onChange={() => updateDancer(dancer.id, { gender: opt })}
                                  required
                                />
                                {opt}
                              </label>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {/* Signup Type */}
                    {dancer.isReturning && (
                      <>
                        <div className={fieldClass}>
                          <span className={labelClass}>How will {dancer.name || 'this dancer'} join us?</span>
                          <div className="grid grid-cols-1 gap-2 mt-1">
                            {[
                              { value: 'classes',   title: 'Per Class · Full 6 Weeks',  desc: 'Pick one or more classes. $120–$180 each.' },
                              { value: 'flex_pass', title: 'Summer Flex Pass · $329',   desc: 'Unlimited classes all summer.' },
                              { value: 'drop_in',   title: 'Drop-In · $25',             desc: 'Try one class for a single week.' },
                            ].map((opt) => {
                              const active = dancer.signupType === opt.value
                              return (
                                <label
                                  key={opt.value}
                                  className={`border rounded-lg px-3 py-2.5 cursor-pointer transition-colors ${
                                    active ? 'border-[#f4a8b4] bg-[#fff5f8]' : 'border-surface-border bg-white hover:border-[#c8ddf4]'
                                  }`}
                                >
                                  <div className="flex items-start gap-2.5">
                                    <input
                                      type="radio"
                                      name={`signupType-${dancer.id}`}
                                      value={opt.value}
                                      checked={active}
                                      onChange={() => updateDancer(dancer.id, {
                                        signupType: opt.value,
                                        classes: [],
                                        dropInClass: '',
                                        dropInWeek: '',
                                      })}
                                      className="mt-1 flex-shrink-0"
                                    />
                                    <div>
                                      <p className="font-semibold text-navy-dark text-sm">{opt.title}</p>
                                      <p className="text-[#5a6a8a] text-xs mt-0.5">{opt.desc}</p>
                                    </div>
                                  </div>
                                </label>
                              )
                            })}
                          </div>
                        </div>

                        {/* Per-class picker */}
                        {dancer.signupType === 'classes' && (
                          <div className="flex flex-col gap-2">
                            <span className={labelClass}>Choose classes <span className="text-brand-red text-xs font-normal">required</span></span>
                            {['Tuesday', 'Wednesday', 'Thursday'].map((day) => (
                              <div key={day} className="flex flex-col gap-1.5 mt-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-navy-dark font-bold text-xs uppercase tracking-wide">{day}</span>
                                  <div className="flex-1 h-px bg-surface-border" />
                                </div>
                                {SUMMER_CLASSES.filter((c) => c.day === day).map((c) => {
                                  const checked = dancer.classes.includes(c.key)
                                  return (
                                    <label
                                      key={c.key}
                                      className={`border rounded-md px-3 py-2 cursor-pointer transition-colors ${
                                        checked ? 'border-[#f4a8b4] bg-[#fff5f8]' : 'border-surface-border bg-white'
                                      }`}
                                    >
                                      <div className="flex items-start gap-2">
                                        <input
                                          type="checkbox"
                                          checked={checked}
                                          onChange={(e) => toggleDancerClass(dancer.id, c.key, e.target.checked)}
                                          className="mt-1 flex-shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                          <div className="flex justify-between items-baseline gap-2">
                                            <span className="font-semibold text-navy-dark text-sm">{c.name}</span>
                                            <span className="text-brand-red font-bold text-xs whitespace-nowrap">${c.price}</span>
                                          </div>
                                          <div className="text-[#5a6a8a] text-xs">
                                            {c.time} · {c.ages} · {c.duration}
                                          </div>
                                        </div>
                                      </div>
                                    </label>
                                  )
                                })}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Drop-in picker */}
                        {dancer.signupType === 'drop_in' && (
                          <div className="flex flex-col gap-3">
                            <div className={fieldClass}>
                              <label className={labelClass}>Class <span className="text-brand-red text-xs font-normal">required</span></label>
                              <select
                                required
                                value={dancer.dropInClass}
                                onChange={(e) => updateDancer(dancer.id, { dropInClass: e.target.value })}
                                className={inputClass}
                              >
                                <option value="">Select a class…</option>
                                {SUMMER_CLASSES.map((c) => (
                                  <option key={c.key} value={c.key}>
                                    {c.day} · {c.time} · {c.name} ({c.ages})
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className={fieldClass}>
                              <label className={labelClass}>Week <span className="text-brand-red text-xs font-normal">required</span></label>
                              <select
                                required
                                value={dancer.dropInWeek}
                                onChange={(e) => updateDancer(dancer.id, { dropInWeek: e.target.value })}
                                className={inputClass}
                              >
                                <option value="">Select a week…</option>
                                {SESSION_WEEKS.map((w) => (
                                  <option key={w.value} value={w.value}>{w.label}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        )}

                        {/* Flex pass copy */}
                        {dancer.signupType === 'flex_pass' && (
                          <div className="bg-[#f4ecff] border border-[#d7c4f4] rounded-md px-4 py-3 text-sm">
                            <p className="text-[#7a4ed8] text-[10px] font-bold tracking-[0.3em] uppercase mb-1">Summer Flex Pass</p>
                            <p className="text-navy-dark font-black">$329 · Unlimited classes for 6 weeks</p>
                          </div>
                        )}

                        {/* Per-dancer subtotal */}
                        <div className="flex justify-between items-center bg-white border border-surface-border rounded-md px-3 py-2 text-sm">
                          <span className="text-[#5a6a8a]">
                            {dancer.name || 'This dancer'} subtotal
                          </span>
                          <span className="font-bold text-navy-dark">${computeDancerTuition(dancer)}</span>
                        </div>
                      </>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addDancer}
                  className="border-2 border-dashed border-surface-border rounded-lg px-4 py-3 text-navy-dark font-bold text-sm hover:border-[#f4a8b4] hover:text-brand-red transition-colors"
                >
                  + Add another dancer
                </button>
              </div>
            </div>

            <hr className="border-surface-border" />

            {/* ── Payment Choice ── */}
            {totals.hasNonDropIn && totals.tuitionTotal > 0 && (
              <div className="flex flex-col gap-3">
                <div>
                  <p className="text-brand-red text-xs font-bold tracking-[0.3em] uppercase mb-1">Step 2</p>
                  <h2 className="text-navy-dark text-lg font-black">Pay Deposit or Pay in Full?</h2>
                  <p className="text-[#5a6a8a] text-sm mt-1">
                    $50 deposit per non-drop-in dancer applies toward tuition. Drop-ins are always paid in full.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { value: 'deposit', title: `Pay $${totals.dueToday} now`, sub: `$50 deposit per dancer${totals.balanceDue > 0 ? ` · $${totals.balanceDue} balance due before classes start` : ''}.` },
                    { value: 'full',    title: `Pay $${totals.tuitionTotal} in full`, sub: 'Done in one step — nothing else due.' },
                  ].map((opt) => {
                    const active = form.paymentChoice === opt.value
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
                            name="paymentChoice"
                            value={opt.value}
                            checked={active}
                            onChange={() => updateParent('paymentChoice', opt.value)}
                            className="mt-1 flex-shrink-0"
                          />
                          <div>
                            <p className="font-semibold text-navy-dark">{opt.title}</p>
                            <p className="text-[#5a6a8a] text-xs mt-0.5">{opt.sub}</p>
                          </div>
                        </div>
                      </label>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Promo code */}
            {totals.tuitionTotal > 0 && (
              <div className="flex flex-col gap-2">
                <p className={labelClass}>Promo code <span className="text-[#8a9aaa] text-xs font-normal">(optional)</span></p>
                {promoStatus === 'applied' && promo ? (
                  <div className="bg-[#f0faf5] border border-[#b5e0c8] rounded-md px-4 py-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[#0a7c3e] font-black text-sm">{promo.code} applied</p>
                      <p className="text-[#3a4a6a] text-xs mt-0.5">{promo.label}</p>
                    </div>
                    <button
                      type="button"
                      onClick={clearPromo}
                      className="text-[#5a6a8a] text-xs font-bold underline hover:text-navy-dark"
                    >
                      Remove
                    </button>
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
            )}

            {/* Running total */}
            {totals.items.length > 0 && (
              <div className="bg-white border-2 border-navy-dark rounded-lg px-5 py-4">
                <p className="text-navy-dark font-bold mb-2 text-sm uppercase tracking-wide">
                  Order Summary · {totals.dancerCount} dancer{totals.dancerCount !== 1 ? 's' : ''}
                </p>
                <ul className="text-[#3a4a6a] text-xs flex flex-col gap-1 mb-3">
                  {totals.items.map((item) => (
                    <li key={item.key} className="flex justify-between gap-3">
                      <span className="truncate">{item.label}</span>
                      <span className="font-semibold text-navy-dark whitespace-nowrap">${item.price}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex justify-between text-sm pt-3 border-t border-surface-border">
                  <span className="text-[#5a6a8a]">Tuition total</span>
                  <span className="font-semibold text-navy-dark">${totals.tuitionTotal}</span>
                </div>
                {totals.discount > 0 && (
                  <div className="flex justify-between text-sm pt-1">
                    <span className="text-[#0a7c3e]">Promo discount{promo?.code ? ` (${promo.code})` : ''}</span>
                    <span className="font-semibold text-[#0a7c3e]">−${totals.discount}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2">
                  <span className="text-navy-dark font-bold">Due today</span>
                  <span className="text-navy-dark font-black text-2xl">${totals.dueToday}</span>
                </div>
                {totals.balanceDue > 0 && (
                  <p className="text-[#8a9aaa] text-xs mt-2">
                    Remaining balance of <span className="font-semibold text-navy-dark">${totals.balanceDue}</span> due before the first class.
                  </p>
                )}
                {promo?.discountType === 'full' && (
                  <p className="text-[#3a4a6a] text-xs mt-2 leading-relaxed bg-[#fdf8ec] border border-[#e8d8a8] rounded-md px-3 py-2">
                    <span className="font-black text-[#b88820]">Free trial applied.</span> This code is for new dancers trying one class. The studio will confirm your selection before classes begin.
                  </p>
                )}
              </div>
            )}

            <hr className="border-surface-border" />

            {/* Notes */}
            <div className="flex flex-col gap-3">
              <div>
                <p className="text-brand-red text-xs font-bold tracking-[0.3em] uppercase mb-1">Anything Else?</p>
                <h2 className="text-navy-dark text-lg font-black">Notes <span className="text-[#8a9aaa] text-sm font-normal">(optional)</span></h2>
              </div>
              <textarea
                rows={3}
                placeholder="Allergies, accommodations, or anything we should know..."
                value={form.notes}
                onChange={(e) => updateParent('notes', e.target.value)}
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

              <div className="bg-[#fff5f8] border border-[#f4c8d4] rounded-lg px-5 py-4 flex flex-col gap-3">
                {[
                  { id: 'policyDeposit', label: 'I understand the $50 deposit (per non-drop-in dancer) is non-refundable and applies toward tuition. Drop-in fees are also non-refundable.' },
                  { id: 'policyBalance', label: 'I understand any remaining tuition balance is due before the first class of the summer session.' },
                ].map(({ id, label }) => (
                  <label key={id} className="flex items-start gap-3 text-[#3a4a6a] text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form[id]}
                      onChange={(e) => updateParent(id, e.target.checked)}
                      required
                      className="mt-0.5 flex-shrink-0"
                    />
                    {label}
                  </label>
                ))}
              </div>

              <div className="bg-[#f0f6ff] border border-[#c8ddf4] rounded-lg px-5 py-4">
                <label className="flex items-start gap-3 text-[#3a4a6a] text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.waiverAck}
                    onChange={(e) => updateParent('waiverAck', e.target.checked)}
                    required
                    className="mt-0.5 flex-shrink-0"
                  />
                  I understand that all dancers must have a waiver completed prior to participating in class.
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
                  ? 'Confirm Free Trial Registration →'
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
