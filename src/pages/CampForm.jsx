import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import PageHeader from '../components/PageHeader'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import { supabase } from '../lib/supabase'

const CAMP_WEEKS = [
  { key: 'wk1', label: 'Week 1: June 15 – June 19 · Rainbow Remix' },
  { key: 'wk2', label: 'Week 2: June 22 – June 26 · Glow Dance Party' },
  { key: 'wk3', label: 'Week 3: June 29 – July 3 · Pop Stars and Performers' },
  { key: 'wk4', label: 'Week 4: July 6 – July 10 · Around The World' },
  { key: 'wk5', label: 'Week 5: July 13 – July 17 · Beach Bash Boogie' },
  { key: 'wk6', label: 'Week 6: July 20 – July 24 · Movie Magic Dance Camp' },
  { key: 'wk7', label: 'Week 7: July 27 – July 31 · Dance & Dream Spirit Week' },
  { key: 'wk8', label: 'Week 8: August 3 – August 7 · Princess and Heroes' },
]

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

const ATTENDANCE_TYPES = [
  { value: 'full_week', label: 'Full week (M–F, full days)' },
  { value: 'half_week', label: 'Half-day full week (M–F, half days)' },
  { value: 'single_days', label: 'Single full day(s)' },
  { value: 'single_half_days', label: 'Single half day(s)' },
]

const RATES = {
  current: { full_week: 205, half_week: 155, single_day: 50, single_half_day: 35 },
  non:     { full_week: 225, half_week: 175, single_day: 55, single_half_day: 40 },
}

const CARE_RATE = 15 // $/hour

// 15-minute interval options. Before-care window 8:00–9:15, after-care 3:45–5:00.
const BEFORE_CARE_TIMES = ['8:00', '8:15', '8:30', '8:45', '9:00', '9:15']
const AFTER_CARE_TIMES = ['3:45', '4:00', '4:15', '4:30', '4:45', '5:00']

const BEFORE_CARE_END = '9:15' // care ends when this window closes
const AFTER_CARE_START = '3:45'

function timeStrToMinutes(t) {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

function beforeCareHours(dropOff) {
  const minutes = timeStrToMinutes(BEFORE_CARE_END) - timeStrToMinutes(dropOff)
  return Math.max(0, minutes / 60)
}

function afterCareHours(pickup) {
  const minutes = timeStrToMinutes(pickup) - timeStrToMinutes(AFTER_CARE_START)
  return Math.max(0, minutes / 60)
}

const GENDER_OPTIONS = ['Female', 'Male', 'Non-binary', 'Prefer not to say']

// Promo codes — case-insensitive. `per_full_week` deducts a flat amount per
// selected full-week or half-day-full-week registration (single-day options
// don't qualify since the discount is intended as a per-week deal).
const PROMO_CODES = {
  CKSummer26: {
    label: 'CertifiKid · $40 off per week (current dancer) or $60 off per week (non-studio)',
    type: 'per_full_week',
    currentRate: 40,
    nonRate: 60,
  },
}

// Case-insensitive lookup that preserves the canonical key casing for display.
function validatePromo(code) {
  const trimmed = (code || '').trim()
  if (!trimmed) return null
  const upper = trimmed.toUpperCase()
  const match = Object.entries(PROMO_CODES).find(([key]) => key.toUpperCase() === upper)
  if (!match) return null
  const [key, value] = match
  return { code: key, ...value }
}

const INITIAL_FORM = {
  parentName: '',
  email: '',
  phone: '',
  camperName: '',
  camperAge: '',
  camperBirthdate: '',
  camperGender: '',
  currentStudent: '',
  weeks: {}, // { wk1: { type: 'full_week', days: [] }, ... }
  beforeCare: { enabled: false, time: '8:30', days: [] },
  afterCare: { enabled: false, time: '4:30', days: [] },
  notes: '',
  policyDeposit: false,
  policyConfirm: false,
}

function calcWeekPrice(selection, currentStudent) {
  if (!selection || !selection.type) return 0
  const tier = currentStudent === 'Yes' ? RATES.current : RATES.non
  switch (selection.type) {
    case 'full_week': return tier.full_week
    case 'half_week': return tier.half_week
    case 'single_days': return tier.single_day * (selection.days?.length || 0)
    case 'single_half_days': return tier.single_half_day * (selection.days?.length || 0)
    default: return 0
  }
}

function describeSelection(selection) {
  if (!selection || !selection.type) return ''
  switch (selection.type) {
    case 'full_week': return 'Full week (M–F)'
    case 'half_week': return 'Half-day full week (M–F)'
    case 'single_days': return `Single full day${(selection.days?.length || 0) > 1 ? 's' : ''}: ${selection.days?.join(', ') || '—'}`
    case 'single_half_days': return `Single half day${(selection.days?.length || 0) > 1 ? 's' : ''}: ${selection.days?.join(', ') || '—'}`
    default: return ''
  }
}

function attendedDays(selection) {
  if (!selection || !selection.type) return []
  if (selection.type === 'full_week' || selection.type === 'half_week') return WEEKDAYS
  return selection.days || []
}

export default function CampForm() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [form, setForm] = useState(INITIAL_FORM)
  const [status, setStatus] = useState('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const [promoInput, setPromoInput] = useState('')
  const [promo, setPromo] = useState(null)
  const [promoError, setPromoError] = useState('')
  const [promoFromLink, setPromoFromLink] = useState(false)

  // If user arrived via a promo link (e.g. "Get the Deal" → ?promo=CKSummer26),
  // pre-fill and auto-apply the code, and show a banner at the top.
  useEffect(() => {
    const code = searchParams.get('promo')
    if (!code) return
    const result = validatePromo(code)
    if (result) {
      setPromoInput(result.code)
      setPromo(result)
      setPromoFromLink(true)
    }
  }, [searchParams])

  const tier = form.currentStudent === 'Yes' ? RATES.current : RATES.non
  const isCurrent = form.currentStudent === 'Yes'

  const totals = useMemo(() => {
    const items = Object.entries(form.weeks).map(([weekKey, selection]) => {
      const week = CAMP_WEEKS.find((w) => w.key === weekKey)
      return {
        weekKey,
        weekLabel: week?.label || weekKey,
        description: describeSelection(selection),
        price: calcWeekPrice(selection, form.currentStudent),
        type: selection.type,
        days: selection.days || [],
      }
    })
    const campSubtotal = items.reduce((sum, item) => sum + item.price, 0)

    const careItems = []

    const before = form.beforeCare || {}
    if (before.enabled && (before.days?.length || 0) > 0) {
      const hours = beforeCareHours(before.time)
      let totalDayCount = 0
      for (const [, selection] of Object.entries(form.weeks)) {
        const attended = new Set(attendedDays(selection))
        const matched = (before.days || []).filter((d) => attended.has(d))
        totalDayCount += matched.length
      }
      if (totalDayCount > 0 && hours > 0) {
        careItems.push({
          type: 'before',
          description: `Before care · drop-off ${before.time} (${hours.toFixed(2).replace(/\.?0+$/, '')} hr × ${totalDayCount} day${totalDayCount > 1 ? 's' : ''})`,
          price: Math.round(hours * CARE_RATE * totalDayCount * 100) / 100,
          dayCount: totalDayCount,
          hours,
          time: before.time,
        })
      }
    }

    const after = form.afterCare || {}
    if (after.enabled && (after.days?.length || 0) > 0) {
      const hours = afterCareHours(after.time)
      let totalDayCount = 0
      for (const [, selection] of Object.entries(form.weeks)) {
        const attended = new Set(attendedDays(selection))
        const matched = (after.days || []).filter((d) => attended.has(d))
        totalDayCount += matched.length
      }
      if (totalDayCount > 0 && hours > 0) {
        careItems.push({
          type: 'after',
          description: `After care · pickup ${after.time} (${hours.toFixed(2).replace(/\.?0+$/, '')} hr × ${totalDayCount} day${totalDayCount > 1 ? 's' : ''})`,
          price: Math.round(hours * CARE_RATE * totalDayCount * 100) / 100,
          dayCount: totalDayCount,
          hours,
          time: after.time,
        })
      }
    }

    const careSubtotal = careItems.reduce((sum, item) => sum + item.price, 0)
    const grossSubtotal = Math.round((campSubtotal + careSubtotal) * 100) / 100

    // Promo discount
    let discount = 0
    let promoQualifyingWeeks = 0
    if (promo && promo.type === 'per_full_week') {
      const rate = isCurrent ? promo.currentRate : promo.nonRate
      for (const [, selection] of Object.entries(form.weeks)) {
        if (selection.type === 'full_week' || selection.type === 'half_week') {
          promoQualifyingWeeks += 1
        }
      }
      // Cap so total never goes below zero
      discount = Math.min(grossSubtotal, rate * promoQualifyingWeeks)
    }

    const subtotal = Math.max(0, Math.round((grossSubtotal - discount) * 100) / 100)
    return { items, careItems, campSubtotal, careSubtotal, grossSubtotal, discount, promoQualifyingWeeks, subtotal }
  }, [form.weeks, form.currentStudent, form.beforeCare, form.afterCare, promo, isCurrent])

  function handleChange(e) {
    const { id, value, type, checked } = e.target
    if (type === 'checkbox') {
      setForm((prev) => ({ ...prev, [id]: checked }))
    } else {
      setForm((prev) => ({ ...prev, [id]: value }))
    }
  }

  function toggleWeek(weekKey, enabled) {
    setForm((prev) => {
      const next = { ...prev.weeks }
      if (enabled) {
        next[weekKey] = { type: 'full_week', days: [] }
      } else {
        delete next[weekKey]
      }
      return { ...prev, weeks: next }
    })
  }

  function setWeekType(weekKey, newType) {
    setForm((prev) => ({
      ...prev,
      weeks: { ...prev.weeks, [weekKey]: { type: newType, days: [] } },
    }))
  }

  function toggleWeekDay(weekKey, day, checked) {
    setForm((prev) => {
      const current = prev.weeks[weekKey] || { type: 'single_days', days: [] }
      const days = checked
        ? [...current.days, day]
        : current.days.filter((d) => d !== day)
      return { ...prev, weeks: { ...prev.weeks, [weekKey]: { ...current, days } } }
    })
  }

  function setCareEnabled(kind, enabled) {
    setForm((prev) => ({ ...prev, [kind]: { ...prev[kind], enabled } }))
  }

  function setCareTime(kind, time) {
    setForm((prev) => ({ ...prev, [kind]: { ...prev[kind], time } }))
  }

  function toggleCareDay(kind, day, checked) {
    setForm((prev) => {
      const current = prev[kind]
      const days = checked
        ? [...current.days, day]
        : current.days.filter((d) => d !== day)
      return { ...prev, [kind]: { ...current, days } }
    })
  }

  function applyPromo() {
    const result = validatePromo(promoInput)
    if (result) {
      setPromo(result)
      setPromoError('')
    } else {
      setPromo(null)
      setPromoError('Invalid code')
    }
  }

  function removePromo() {
    setPromo(null)
    setPromoInput('')
    setPromoError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('submitting')
    setErrorMsg('')

    const weekKeys = Object.keys(form.weeks)
    if (weekKeys.length === 0) {
      setStatus('error')
      setErrorMsg('Please select at least one camp week.')
      return
    }
    for (const wk of weekKeys) {
      const sel = form.weeks[wk]
      if ((sel.type === 'single_days' || sel.type === 'single_half_days') && (!sel.days || sel.days.length === 0)) {
        setStatus('error')
        setErrorMsg('Please pick at least one day for each week set to "Single day" or "Single half day".')
        return
      }
    }

    const summaryText = totals.items.map((i) => `${i.weekLabel} — ${i.description} — $${i.price}`).join(' | ')

    const { data, error } = await supabase
      .from('camp_registrations')
      .insert([{
        parent_name: form.parentName,
        email: form.email,
        phone: form.phone,
        camper_name: form.camperName,
        camper_age: form.camperAge,
        camper_birthdate: form.camperBirthdate || null,
        camper_gender: form.camperGender,
        current_student: form.currentStudent,
        camp_weeks: summaryText,
        camp_selection: form.weeks,
        before_care: form.beforeCare.enabled ? form.beforeCare : null,
        after_care: form.afterCare.enabled ? form.afterCare : null,
        promo_code: promo?.code || null,
        promo_discount: totals.discount || 0,
        estimated_total: totals.subtotal,
        additional_notes: form.notes || null,
      }])
      .select()
      .single()

    if (error) {
      console.error('Supabase insert error:', JSON.stringify(error, null, 2))
      setStatus('error')
      setErrorMsg('Something went wrong. Please try again or email us at info@capitalcoredance.com.')
      return
    }

    fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        formType: 'camp_registration',
        parentName: form.parentName,
        email: form.email,
        phone: form.phone,
        camperName: form.camperName,
        camperAge: form.camperAge,
        camperBirthdate: form.camperBirthdate,
        camperGender: form.camperGender,
        currentStudent: form.currentStudent,
        selection: totals.items,
        careItems: totals.careItems,
        beforeCare: form.beforeCare.enabled ? form.beforeCare : null,
        afterCare: form.afterCare.enabled ? form.afterCare : null,
        promoCode: promo?.code || null,
        promoDiscount: totals.discount || 0,
        grossSubtotal: totals.grossSubtotal,
        estimatedTotal: totals.subtotal,
        notes: form.notes,
      }),
    }).catch(() => {})

    navigate('/camp-payment', {
      state: {
        registrationId: data?.id || null,
        parentName: form.parentName,
        email: form.email,
        camperName: form.camperName,
        items: totals.items,
        careItems: totals.careItems,
        promoCode: promo?.code || null,
        promoLabel: promo?.label || null,
        promoDiscount: totals.discount || 0,
        grossSubtotal: totals.grossSubtotal,
        estimatedTotal: totals.subtotal,
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
        title="Summer Camp Registration | Capital Core Dance Studio – Midlothian, VA"
        description="Register your camper for Capital Core Dance Studio's 2026 summer dance camps in Midlothian, VA. Pick full weeks, half-day weeks, single days, or single half days. A $50 deposit holds your spot."
        canonical="/camp-registration"
        noindex
      />
      <Navbar />
      <PageHeader
        eyebrow="Summer Camps 2026"
        title="Camp Registration"
        subtitle="Pick the weeks and days that work for you. A $50 deposit holds your camper's spot."
      />

      <section className="bg-white flex-1 px-6 py-12">
        <div className="max-w-2xl mx-auto">

          {promoFromLink && promo && (
            <div className="mb-8 bg-[#fff5f8] border border-[#f4a8b4] rounded-xl px-5 py-4 flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">🎉</span>
              <div>
                <p className="text-navy-dark font-black text-base leading-snug">
                  Code <span className="text-brand-red">{promo.code}</span> added!
                </p>
                <p className="text-[#5a6a8a] text-sm mt-1 leading-relaxed">
                  Choose your studio status below to see how much you got off — savings are different for current dancers vs. non-studio campers.
                </p>
              </div>
            </div>
          )}

          <form className="flex flex-col gap-8" onSubmit={handleSubmit} aria-label="Summer camp registration form">

            {/* ── Parent Info ── */}
            <div className="flex flex-col gap-5">
              <div>
                <p className="text-brand-red text-xs font-bold tracking-[0.3em] uppercase mb-1">Step 1</p>
                <h2 className="text-navy-dark text-lg font-black">Parent / Guardian Info</h2>
              </div>

              <div className={fieldClass}>
                <label className={labelClass} htmlFor="parentName">Parent / Guardian Full Name <span className="text-brand-red text-xs font-normal">required</span></label>
                <input id="parentName" type="text" required placeholder="Full name" value={form.parentName} onChange={handleChange} className={inputClass} />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className={`${fieldClass} flex-1`}>
                  <label className={labelClass} htmlFor="email">Email Address <span className="text-brand-red text-xs font-normal">required</span></label>
                  <input id="email" type="email" required placeholder="your@email.com" value={form.email} onChange={handleChange} className={inputClass} />
                </div>
                <div className={`${fieldClass} flex-1`}>
                  <label className={labelClass} htmlFor="phone">Phone Number <span className="text-brand-red text-xs font-normal">required</span></label>
                  <input id="phone" type="tel" required placeholder="(000) 000-0000" value={form.phone} onChange={handleChange} className={inputClass} />
                </div>
              </div>
            </div>

            <hr className="border-surface-border" />

            {/* ── Camper Info ── */}
            <div className="flex flex-col gap-5">
              <div>
                <p className="text-brand-red text-xs font-bold tracking-[0.3em] uppercase mb-1">Step 2</p>
                <h2 className="text-navy-dark text-lg font-black">About Your Camper</h2>
              </div>

              <div className={fieldClass}>
                <label className={labelClass} htmlFor="camperName">Camper's Full Name <span className="text-brand-red text-xs font-normal">required</span></label>
                <input id="camperName" type="text" required placeholder="Camper's name" value={form.camperName} onChange={handleChange} className={inputClass} />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className={`${fieldClass} flex-1`}>
                  <label className={labelClass} htmlFor="camperAge">Age <span className="text-brand-red text-xs font-normal">required</span></label>
                  <input id="camperAge" type="number" min="3" max="18" required placeholder="e.g. 8" value={form.camperAge} onChange={handleChange} className={inputClass} />
                </div>
                <div className={`${fieldClass} flex-1`}>
                  <label className={labelClass} htmlFor="camperBirthdate">Date of Birth <span className="text-brand-red text-xs font-normal">required</span></label>
                  <input id="camperBirthdate" type="date" required value={form.camperBirthdate} onChange={handleChange} className={inputClass} />
                </div>
              </div>

              <div className={fieldClass}>
                <span className={labelClass}>Gender <span className="text-brand-red text-xs font-normal">required</span></span>
                <div className="flex flex-wrap gap-x-6 gap-y-2 mt-1">
                  {GENDER_OPTIONS.map((opt) => (
                    <label key={opt} className={radioClass}>
                      <input type="radio" name="camperGender" id="camperGender" value={opt} checked={form.camperGender === opt} onChange={handleChange} required />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>

              <div className={fieldClass}>
                <span className={labelClass}>Is your camper a current Capital Core Dance Studio student? <span className="text-brand-red text-xs font-normal">required</span></span>
                <div className="flex gap-6 mt-1">
                  {['Yes', 'No'].map((opt) => (
                    <label key={opt} className={radioClass}>
                      <input type="radio" name="currentStudent" id="currentStudent" value={opt} checked={form.currentStudent === opt} onChange={handleChange} required />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <hr className="border-surface-border" />

            {/* ── Weeks & Attendance ── */}
            <div className="flex flex-col gap-5">
              <div>
                <p className="text-brand-red text-xs font-bold tracking-[0.3em] uppercase mb-1">Step 3</p>
                <h2 className="text-navy-dark text-lg font-black">Pick Weeks & Attendance</h2>
                <p className="text-[#5a6a8a] text-sm mt-1">
                  Select the weeks you want, then choose how your camper will attend each week.
                </p>
              </div>

              {/* Rate card */}
              <div className="bg-[#f0f6ff] border border-[#c8ddf4] rounded-lg px-5 py-4 text-sm">
                <p className="font-bold text-navy-dark mb-2">Camp Rates</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-left text-[#5a6a8a]">
                        <th className="py-1 pr-3 font-semibold"></th>
                        <th className={`py-1 pr-3 font-semibold ${isCurrent ? 'text-brand-red' : ''}`}>
                          Current dancer
                        </th>
                        <th className={`py-1 font-semibold ${form.currentStudent === 'No' ? 'text-brand-red' : ''}`}>
                          Non-studio
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-[#3a4a6a]">
                      <tr className="border-t border-[#c8ddf4]/60">
                        <td className="py-1 pr-3 font-bold">Full week (M–F)</td>
                        <td className={`py-1 pr-3 font-bold ${isCurrent ? 'text-brand-red' : 'text-navy-dark'}`}>${RATES.current.full_week}</td>
                        <td className={`py-1 font-bold ${form.currentStudent === 'No' ? 'text-brand-red' : 'text-navy-dark'}`}>${RATES.non.full_week}</td>
                      </tr>
                      <tr className="border-t border-[#c8ddf4]/60">
                        <td className="py-1 pr-3 font-bold">Half-day full week</td>
                        <td className={`py-1 pr-3 font-bold ${isCurrent ? 'text-brand-red' : 'text-navy-dark'}`}>${RATES.current.half_week}</td>
                        <td className={`py-1 font-bold ${form.currentStudent === 'No' ? 'text-brand-red' : 'text-navy-dark'}`}>${RATES.non.half_week}</td>
                      </tr>
                      <tr className="border-t border-[#c8ddf4]/60">
                        <td className="py-1 pr-3 font-bold">Single full day</td>
                        <td className={`py-1 pr-3 font-bold ${isCurrent ? 'text-brand-red' : 'text-navy-dark'}`}>${RATES.current.single_day}</td>
                        <td className={`py-1 font-bold ${form.currentStudent === 'No' ? 'text-brand-red' : 'text-navy-dark'}`}>${RATES.non.single_day}</td>
                      </tr>
                      <tr className="border-t border-[#c8ddf4]/60">
                        <td className="py-1 pr-3 font-bold">Single half day</td>
                        <td className={`py-1 pr-3 font-bold ${isCurrent ? 'text-brand-red' : 'text-navy-dark'}`}>${RATES.current.single_half_day}</td>
                        <td className={`py-1 font-bold ${form.currentStudent === 'No' ? 'text-brand-red' : 'text-navy-dark'}`}>${RATES.non.single_half_day}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-[#5a6a8a] mt-2">
                  {form.currentStudent
                    ? <>Highlighted column applies to your camper.</>
                    : <>Answer "current student" above to highlight your column.</>
                  }
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {CAMP_WEEKS.map((week) => {
                  const selection = form.weeks[week.key]
                  const enabled = !!selection
                  return (
                    <div
                      key={week.key}
                      className={`border rounded-lg px-4 py-3 transition-colors ${
                        enabled ? 'border-[#f4a8b4] bg-[#fff5f8]' : 'border-surface-border bg-white'
                      }`}
                    >
                      <label className="flex items-start gap-3 text-[#3a4a6a] text-sm cursor-pointer">
                        <input
                          type="checkbox"
                          checked={enabled}
                          onChange={(e) => toggleWeek(week.key, e.target.checked)}
                          className="mt-0.5 flex-shrink-0"
                        />
                        <span className="font-semibold text-navy-dark">{week.label}</span>
                      </label>

                      {enabled && (
                        <div className="mt-3 ml-7 flex flex-col gap-3">
                          <div className={fieldClass}>
                            <label className="text-[#3a4a6a] text-xs font-semibold uppercase tracking-wide" htmlFor={`type-${week.key}`}>
                              Attendance
                            </label>
                            <select
                              id={`type-${week.key}`}
                              value={selection.type}
                              onChange={(e) => setWeekType(week.key, e.target.value)}
                              className={inputClass}
                            >
                              {ATTENDANCE_TYPES.map((t) => (
                                <option key={t.value} value={t.value}>{t.label}</option>
                              ))}
                            </select>
                          </div>

                          {(selection.type === 'single_days' || selection.type === 'single_half_days') && (
                            <div className={fieldClass}>
                              <span className="text-[#3a4a6a] text-xs font-semibold uppercase tracking-wide">
                                Which day{selection.type === 'single_half_days' ? ' (half)' : ''}?
                              </span>
                              <div className="flex flex-wrap gap-x-4 gap-y-2">
                                {WEEKDAYS.map((day) => (
                                  <label key={day} className={radioClass}>
                                    <input
                                      type="checkbox"
                                      checked={selection.days?.includes(day) || false}
                                      onChange={(e) => toggleWeekDay(week.key, day, e.target.checked)}
                                    />
                                    {day}
                                  </label>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="text-right text-sm">
                            <span className="text-[#5a6a8a]">Subtotal: </span>
                            <span className="font-bold text-navy-dark">${calcWeekPrice(selection, form.currentStudent)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

            </div>

            <hr className="border-surface-border" />

            {/* ── Before & After Care ── */}
            <div className="flex flex-col gap-5">
              <div>
                <p className="text-brand-red text-xs font-bold tracking-[0.3em] uppercase mb-1">Step 4</p>
                <h2 className="text-navy-dark text-lg font-black">Before & After Care <span className="text-[#8a9aaa] text-sm font-normal">(optional)</span></h2>
                <p className="text-[#5a6a8a] text-sm mt-1">
                  $15 / hour. Before care 8:00–9:15 AM. After care 3:45–5:00 PM. Camp runs 9:30 AM – 3:30 PM.
                </p>
              </div>

              {/* Before care */}
              {[
                { kind: 'beforeCare', label: 'Before Care', accent: 'Drop-off time', times: BEFORE_CARE_TIMES, hint: 'Care ends at 9:15 AM (camp begins 9:30).' },
                { kind: 'afterCare', label: 'After Care', accent: 'Pickup time', times: AFTER_CARE_TIMES, hint: 'Care starts at 3:45 PM (camp ends 3:30).' },
              ].map(({ kind, label, accent, times, hint }) => {
                const care = form[kind]
                return (
                  <div
                    key={kind}
                    className={`border rounded-lg px-4 py-3 ${care.enabled ? 'border-[#f4a8b4] bg-[#fff5f8]' : 'border-surface-border bg-white'}`}
                  >
                    <label className="flex items-start gap-3 text-[#3a4a6a] text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={care.enabled}
                        onChange={(e) => setCareEnabled(kind, e.target.checked)}
                        className="mt-0.5 flex-shrink-0"
                      />
                      <span className="font-semibold text-navy-dark">I need {label.toLowerCase()}</span>
                    </label>

                    {care.enabled && (
                      <div className="mt-3 ml-7 flex flex-col gap-3">
                        <div className={fieldClass}>
                          <label className="text-[#3a4a6a] text-xs font-semibold uppercase tracking-wide" htmlFor={`${kind}-time`}>
                            {accent}
                          </label>
                          <select
                            id={`${kind}-time`}
                            value={care.time}
                            onChange={(e) => setCareTime(kind, e.target.value)}
                            className={`${inputClass} max-w-xs`}
                          >
                            {times.map((t) => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                          </select>
                          <span className="text-[#8a9aaa] text-xs">{hint}</span>
                        </div>

                        <div className={fieldClass}>
                          <span className="text-[#3a4a6a] text-xs font-semibold uppercase tracking-wide">Days needed</span>
                          <div className="flex flex-wrap gap-x-4 gap-y-2">
                            {WEEKDAYS.map((day) => (
                              <label key={day} className={radioClass}>
                                <input
                                  type="checkbox"
                                  checked={care.days.includes(day)}
                                  onChange={(e) => toggleCareDay(kind, day, e.target.checked)}
                                />
                                {day}
                              </label>
                            ))}
                          </div>
                          <span className="text-[#8a9aaa] text-xs">
                            Charged only on days your camper is actually attending. Applies across all selected weeks.
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}

              {/* Promo code */}
              <div className="flex flex-col gap-2">
                <p className="text-navy-dark text-sm font-semibold">Promo Code <span className="text-[#8a9aaa] font-normal">(optional)</span></p>
                {promo ? (
                  <div className="bg-green-50 border border-green-300 rounded-lg px-4 py-3 flex justify-between items-center gap-3">
                    <div>
                      <p className="text-green-800 font-bold text-sm">Code applied: {promo.code}</p>
                      <p className="text-green-700 text-xs">{promo.label}</p>
                      {totals.promoQualifyingWeeks === 0 && (
                        <p className="text-green-700 text-xs italic mt-1">
                          Discount applies to full-week or half-day-full-week selections — single-day picks don't qualify.
                        </p>
                      )}
                    </div>
                    <button type="button" onClick={removePromo} className="text-green-800 hover:text-green-900 text-xs font-bold underline whitespace-nowrap">Remove</button>
                  </div>
                ) : (
                  <>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), applyPromo())}
                        placeholder="Promo code"
                        className={`${inputClass} flex-1`}
                      />
                      <button
                        type="button"
                        onClick={applyPromo}
                        disabled={!promoInput.trim()}
                        className="bg-navy-dark text-white text-sm font-bold px-5 rounded-md hover:bg-navy-mid disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                    {promoError && <p className="text-brand-red text-xs">{promoError}</p>}
                  </>
                )}
              </div>

              {/* Running total */}
              {(totals.items.length > 0 || totals.careItems.length > 0) && (
                <div className="bg-white border-2 border-navy-dark rounded-lg px-5 py-4">
                  <p className="text-navy-dark font-bold mb-2 text-sm uppercase tracking-wide">Estimated Total</p>
                  <ul className="text-[#3a4a6a] text-xs flex flex-col gap-1 mb-3">
                    {totals.items.map((item) => (
                      <li key={item.weekKey} className="flex justify-between gap-3">
                        <span className="truncate">{item.weekLabel.split(':')[0]} — {item.description}</span>
                        <span className="font-semibold text-navy-dark whitespace-nowrap">${item.price}</span>
                      </li>
                    ))}
                    {totals.careItems.map((item) => (
                      <li key={item.type} className="flex justify-between gap-3">
                        <span className="truncate">{item.description}</span>
                        <span className="font-semibold text-navy-dark whitespace-nowrap">${item.price.toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                  {promo && totals.discount > 0 && (
                    <div className="flex justify-between text-xs text-green-700 mb-2">
                      <span>
                        {promo.code} · {totals.promoQualifyingWeeks} week{totals.promoQualifyingWeeks !== 1 ? 's' : ''} ×
                        ${isCurrent ? promo.currentRate : promo.nonRate} off
                      </span>
                      <span className="font-semibold">−${totals.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-3 border-t border-surface-border">
                    <span className="text-navy-dark font-bold">Total</span>
                    <span className="text-navy-dark font-black text-2xl">${totals.subtotal.toFixed(2)}</span>
                  </div>
                  <p className="text-[#8a9aaa] text-xs mt-2">
                    A $50 deposit on the next page holds your camper's spot. The remaining balance is due before camp begins.
                  </p>
                </div>
              )}
            </div>

            <hr className="border-surface-border" />

            {/* ── Notes ── */}
            <div className="flex flex-col gap-5">
              <div>
                <p className="text-brand-red text-xs font-bold tracking-[0.3em] uppercase mb-1">Step 5</p>
                <h2 className="text-navy-dark text-lg font-black">Anything Else?</h2>
              </div>

              <div className={fieldClass}>
                <label className={labelClass} htmlFor="notes">Allergies, medical info, or notes <span className="text-[#8a9aaa] font-normal">(optional)</span></label>
                <textarea id="notes" rows={4} placeholder="Anything we should know about your camper?" value={form.notes} onChange={handleChange} className={`${inputClass} resize-none`} />
              </div>
            </div>

            <hr className="border-surface-border" />

            {/* ── Policies ── */}
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-brand-red text-xs font-bold tracking-[0.3em] uppercase mb-1">Step 6</p>
                <h2 className="text-navy-dark text-lg font-black">Policies & Acknowledgements</h2>
              </div>

              <div className="bg-[#fff5f8] border border-[#f4c8d4] rounded-lg px-5 py-4 flex flex-col gap-3">
                {[
                  { id: 'policyDeposit', label: 'I understand that a $50 non-refundable deposit is required to secure my camper\'s spot.' },
                  { id: 'policyConfirm', label: 'I understand that registration is not confirmed until the deposit is received, and the remaining balance is due before camp begins.' },
                ].map(({ id, label }) => (
                  <label key={id} className="flex items-start gap-3 text-[#3a4a6a] text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      id={id}
                      checked={form[id]}
                      onChange={handleChange}
                      required
                      className="mt-0.5 flex-shrink-0"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            {status === 'error' && (
              <p className="text-brand-red text-sm">{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="bg-brand-red text-white font-bold py-3 rounded-md hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === 'submitting' ? 'Submitting…' : 'Continue to Deposit →'}
            </button>

            <p className="text-[#8a9aaa] text-xs text-center">
              Questions? Call us at <a href="tel:8042344014" className="underline hover:text-navy-dark">(804) 234-4014</a>.
            </p>

          </form>
        </div>
      </section>

      <Footer />
    </div>
  )
}
