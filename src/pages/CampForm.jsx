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

const CARE_RATE = 15
const DEPOSIT_PER_CAMPER = 50

const BEFORE_CARE_TIMES = ['8:00', '8:15', '8:30', '8:45', '9:00', '9:15']
const AFTER_CARE_TIMES = ['3:45', '4:00', '4:15', '4:30', '4:45', '5:00']
const BEFORE_CARE_END = '9:15'
const AFTER_CARE_START = '3:45'

function timeStrToMinutes(t) {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}
function beforeCareHours(dropOff) {
  return Math.max(0, (timeStrToMinutes(BEFORE_CARE_END) - timeStrToMinutes(dropOff)) / 60)
}
function afterCareHours(pickup) {
  return Math.max(0, (timeStrToMinutes(pickup) - timeStrToMinutes(AFTER_CARE_START)) / 60)
}

const GENDER_OPTIONS = ['Female', 'Male', 'Non-binary', 'Prefer not to say']

const PROMO_CODES = {
  CKSummer26: {
    label: 'CertifiKid · $40 off per week (current dancer) or $60 off per week (non-studio)',
    type: 'per_full_week',
    currentRate: 40,
    nonRate: 60,
  },
  CGADMIN100: {
    label: 'Admin · 100% off entire order (testing only)',
    type: 'percent_off_all',
    rate: 1.00,
  },
}

function validatePromo(code) {
  const trimmed = (code || '').trim()
  if (!trimmed) return null
  const upper = trimmed.toUpperCase()
  const match = Object.entries(PROMO_CODES).find(([key]) => key.toUpperCase() === upper)
  if (!match) return null
  const [key, value] = match
  return { code: key, ...value }
}

function newCamper() {
  return {
    id: Math.random().toString(36).slice(2, 10),
    isReturning: '',         // 'Yes' | 'No' (Yes = current studio rate)
    name: '',
    age: '',
    birthdate: '',
    gender: '',
    weeks: {},               // { wk1: { type, days } }
    beforeCare: { enabled: false, time: '8:30', days: [] },
    afterCare: { enabled: false, time: '4:30', days: [] },
  }
}

const INITIAL_FORM = {
  parentName: '',
  email: '',
  phone: '',
  campers: [newCamper()],
  notes: '',
  policyDeposit: false,
  policyConfirm: false,
}

function calcWeekPrice(selection, isCurrent) {
  if (!selection || !selection.type) return 0
  const tier = isCurrent ? RATES.current : RATES.non
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

function computeCamperTotals(camper) {
  const isCurrent = camper.isReturning === 'Yes'
  const weekItems = Object.entries(camper.weeks).map(([weekKey, selection]) => {
    const week = CAMP_WEEKS.find((w) => w.key === weekKey)
    return {
      weekKey,
      weekLabel: week?.label || weekKey,
      description: describeSelection(selection),
      price: calcWeekPrice(selection, isCurrent),
      type: selection.type,
      days: selection.days || [],
    }
  })
  const campSubtotal = weekItems.reduce((s, i) => s + i.price, 0)

  const careItems = []
  const before = camper.beforeCare || {}
  if (before.enabled && (before.days?.length || 0) > 0) {
    const hours = beforeCareHours(before.time)
    let dayCount = 0
    for (const sel of Object.values(camper.weeks)) {
      const attended = new Set(attendedDays(sel))
      dayCount += (before.days || []).filter((d) => attended.has(d)).length
    }
    if (dayCount > 0 && hours > 0) {
      careItems.push({
        type: 'before',
        description: `Before care · drop-off ${before.time} (${hours.toFixed(2).replace(/\.?0+$/, '')} hr × ${dayCount} day${dayCount > 1 ? 's' : ''})`,
        price: Math.round(hours * CARE_RATE * dayCount * 100) / 100,
        dayCount,
        hours,
        time: before.time,
      })
    }
  }
  const after = camper.afterCare || {}
  if (after.enabled && (after.days?.length || 0) > 0) {
    const hours = afterCareHours(after.time)
    let dayCount = 0
    for (const sel of Object.values(camper.weeks)) {
      const attended = new Set(attendedDays(sel))
      dayCount += (after.days || []).filter((d) => attended.has(d)).length
    }
    if (dayCount > 0 && hours > 0) {
      careItems.push({
        type: 'after',
        description: `After care · pickup ${after.time} (${hours.toFixed(2).replace(/\.?0+$/, '')} hr × ${dayCount} day${dayCount > 1 ? 's' : ''})`,
        price: Math.round(hours * CARE_RATE * dayCount * 100) / 100,
        dayCount,
        hours,
        time: after.time,
      })
    }
  }
  const careSubtotal = careItems.reduce((s, i) => s + i.price, 0)
  const subtotal = Math.round((campSubtotal + careSubtotal) * 100) / 100
  return { weekItems, careItems, campSubtotal, careSubtotal, subtotal, isCurrent }
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

  const totals = useMemo(() => {
    const perCamper = form.campers.map((c) => ({
      id: c.id,
      name: c.name,
      isReturning: c.isReturning,
      ...computeCamperTotals(c),
    }))

    const grossSubtotal = Math.round(perCamper.reduce((s, c) => s + c.subtotal, 0) * 100) / 100

    let discount = 0
    let promoQualifyingWeeks = 0
    if (promo && promo.type === 'per_full_week') {
      for (const c of perCamper) {
        const rate = c.isCurrent ? promo.currentRate : promo.nonRate
        const qualifying = c.weekItems.filter((w) => w.type === 'full_week' || w.type === 'half_week').length
        promoQualifyingWeeks += qualifying
        discount += rate * qualifying
      }
      discount = Math.min(grossSubtotal, discount)
    } else if (promo && promo.type === 'percent_off_all') {
      discount = Math.round(grossSubtotal * promo.rate * 100) / 100
    }
    discount = Math.round(discount * 100) / 100

    const total = Math.max(0, Math.round((grossSubtotal - discount) * 100) / 100)
    const camperCount = form.campers.length
    const depositTotal = DEPOSIT_PER_CAMPER * camperCount

    return { perCamper, grossSubtotal, discount, promoQualifyingWeeks, total, camperCount, depositTotal }
  }, [form.campers, promo])

  function updateParent(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function updateCamper(camperId, patch) {
    setForm((prev) => ({
      ...prev,
      campers: prev.campers.map((c) => c.id === camperId ? { ...c, ...patch } : c),
    }))
  }

  function addCamper() {
    setForm((prev) => ({ ...prev, campers: [...prev.campers, newCamper()] }))
  }

  function removeCamper(camperId) {
    setForm((prev) => ({
      ...prev,
      campers: prev.campers.length > 1 ? prev.campers.filter((c) => c.id !== camperId) : prev.campers,
    }))
  }

  function toggleCamperWeek(camperId, weekKey, enabled) {
    updateCamper(camperId, {
      weeks: ((prevWeeks) => {
        const next = { ...prevWeeks }
        if (enabled) next[weekKey] = { type: 'full_week', days: [] }
        else delete next[weekKey]
        return next
      })(form.campers.find((c) => c.id === camperId)?.weeks || {}),
    })
  }

  function setCamperWeekType(camperId, weekKey, type) {
    const camper = form.campers.find((c) => c.id === camperId)
    if (!camper) return
    updateCamper(camperId, {
      weeks: { ...camper.weeks, [weekKey]: { type, days: [] } },
    })
  }

  function toggleCamperWeekDay(camperId, weekKey, day, checked) {
    const camper = form.campers.find((c) => c.id === camperId)
    if (!camper) return
    const current = camper.weeks[weekKey] || { type: 'single_days', days: [] }
    const days = checked ? [...current.days, day] : current.days.filter((d) => d !== day)
    updateCamper(camperId, { weeks: { ...camper.weeks, [weekKey]: { ...current, days } } })
  }

  function setCamperCare(camperId, kind, patch) {
    const camper = form.campers.find((c) => c.id === camperId)
    if (!camper) return
    updateCamper(camperId, { [kind]: { ...camper[kind], ...patch } })
  }

  function toggleCamperCareDay(camperId, kind, day, checked) {
    const camper = form.campers.find((c) => c.id === camperId)
    if (!camper) return
    const current = camper[kind]
    const days = checked ? [...current.days, day] : current.days.filter((d) => d !== day)
    updateCamper(camperId, { [kind]: { ...current, days } })
  }

  function applyPromo() {
    const result = validatePromo(promoInput)
    if (result) { setPromo(result); setPromoError('') }
    else { setPromo(null); setPromoError('Invalid code') }
  }

  function removePromo() {
    setPromo(null); setPromoInput(''); setPromoError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('submitting')
    setErrorMsg('')

    // Validate each camper
    for (const c of form.campers) {
      if (!c.isReturning) { setStatus('error'); setErrorMsg('Tell us whether each camper is returning or new.'); return }
      if (!c.name.trim()) { setStatus('error'); setErrorMsg('Each camper needs a name.'); return }
      if (c.isReturning === 'No' && (!c.age || !c.birthdate || !c.gender)) {
        setStatus('error'); setErrorMsg(`We need age, birthdate, and gender for new camper ${c.name || ''}.`); return
      }
      const weekKeys = Object.keys(c.weeks)
      if (weekKeys.length === 0) {
        setStatus('error'); setErrorMsg(`Please pick at least one camp week for ${c.name || 'each camper'}.`); return
      }
      for (const wk of weekKeys) {
        const sel = c.weeks[wk]
        if ((sel.type === 'single_days' || sel.type === 'single_half_days') && (!sel.days || sel.days.length === 0)) {
          setStatus('error'); setErrorMsg(`Pick at least one day for each "Single day(s)" week (${c.name || 'camper'}).`); return
        }
      }
    }

    const summaryText = totals.perCamper.flatMap((c) =>
      c.weekItems.map((i) => `${c.name || 'Camper'} · ${i.weekLabel} — ${i.description} — $${i.price}`)
    ).join(' | ')

    const primary = form.campers[0]
    const allCurrent = form.campers.every((c) => c.isReturning === 'Yes')

    const campersForDb = form.campers.map((c) => {
      const t = computeCamperTotals(c)
      return {
        name: c.name,
        isReturning: c.isReturning,
        age: c.isReturning === 'No' ? c.age : null,
        birthdate: c.isReturning === 'No' ? (c.birthdate || null) : null,
        gender: c.isReturning === 'No' ? c.gender : null,
        weeks: c.weeks,
        beforeCare: c.beforeCare.enabled ? c.beforeCare : null,
        afterCare: c.afterCare.enabled ? c.afterCare : null,
        weekItems: t.weekItems,
        careItems: t.careItems,
        subtotal: t.subtotal,
      }
    })

    const { data, error } = await supabase
      .from('camp_registrations')
      .insert([{
        parent_name: form.parentName,
        email: form.email,
        phone: form.phone,
        // Legacy single-camper columns kept for backwards-compat — populated
        // from the first camper so existing admin queries still see something.
        camper_name: primary?.name || '',
        camper_age: primary?.age || null,
        camper_birthdate: primary?.birthdate || null,
        camper_gender: primary?.gender || null,
        current_student: allCurrent ? 'Yes' : (form.campers.some((c) => c.isReturning === 'Yes') ? 'Mixed' : 'No'),
        camp_weeks: summaryText,
        camp_selection: form.campers.length === 1 ? primary.weeks : null,
        before_care: form.campers.length === 1 && primary.beforeCare.enabled ? primary.beforeCare : null,
        after_care: form.campers.length === 1 && primary.afterCare.enabled ? primary.afterCare : null,
        campers: campersForDb,
        camper_count: form.campers.length,
        promo_code: promo?.code || null,
        promo_discount: totals.discount || 0,
        estimated_total: totals.total,
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
        campers: campersForDb,
        camperCount: form.campers.length,
        promoCode: promo?.code || null,
        promoDiscount: totals.discount || 0,
        grossSubtotal: totals.grossSubtotal,
        estimatedTotal: totals.total,
        depositTotal: totals.depositTotal,
        notes: form.notes,
      }),
    }).catch(() => {})

    navigate('/camp-payment', {
      state: {
        registrationId: data?.id || null,
        parentName: form.parentName,
        email: form.email,
        campers: campersForDb,
        camperCount: form.campers.length,
        promoCode: promo?.code || null,
        promoLabel: promo?.label || null,
        promoDiscount: totals.discount || 0,
        grossSubtotal: totals.grossSubtotal,
        estimatedTotal: totals.total,
        depositTotal: totals.depositTotal,
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
        description="Register your camper(s) for Capital Core Dance Studio's 2026 summer dance camps. Pick full weeks, half-day weeks, single days, or single half days. A $50 deposit per camper holds the spot."
        canonical="/camp-registration"
        noindex
      />
      <Navbar />
      <PageHeader
        eyebrow="Summer Camps 2026"
        title="Camp Registration"
        subtitle="Add one or more campers. Returning campers only need a name — we'll match them in our records. $50 deposit per camper holds the spot."
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
                  Mark each camper as returning (current dancer) or new below — savings differ for current vs. non-studio rates.
                </p>
              </div>
            </div>
          )}

          <form className="flex flex-col gap-8" onSubmit={handleSubmit} aria-label="Summer camp registration form">

            {/* ── Step 1: Parent + Campers ── */}
            <div className="flex flex-col gap-5">
              <div>
                <p className="text-brand-red text-xs font-bold tracking-[0.3em] uppercase mb-1">Step 1</p>
                <h2 className="text-navy-dark text-lg font-black">Parent &amp; Campers</h2>
                <p className="text-[#5a6a8a] text-sm mt-1">
                  Add as many campers as you'd like. Each camper picks their own weeks and care.
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

              {/* Rate card */}
              <div className="bg-[#f0f6ff] border border-[#c8ddf4] rounded-lg px-5 py-4 text-sm">
                <p className="font-bold text-navy-dark mb-2">Camp Rates (per week)</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-left text-[#5a6a8a]">
                        <th className="py-1 pr-3 font-semibold"></th>
                        <th className="py-1 pr-3 font-semibold">Current dancer (Returning)</th>
                        <th className="py-1 font-semibold">Non-studio (New)</th>
                      </tr>
                    </thead>
                    <tbody className="text-[#3a4a6a]">
                      <tr className="border-t border-[#c8ddf4]/60"><td className="py-1 pr-3 font-bold">Full week (M–F)</td><td className="py-1 pr-3 font-bold text-navy-dark">${RATES.current.full_week}</td><td className="py-1 font-bold text-navy-dark">${RATES.non.full_week}</td></tr>
                      <tr className="border-t border-[#c8ddf4]/60"><td className="py-1 pr-3 font-bold">Half-day full week</td><td className="py-1 pr-3 font-bold text-navy-dark">${RATES.current.half_week}</td><td className="py-1 font-bold text-navy-dark">${RATES.non.half_week}</td></tr>
                      <tr className="border-t border-[#c8ddf4]/60"><td className="py-1 pr-3 font-bold">Single full day</td><td className="py-1 pr-3 font-bold text-navy-dark">${RATES.current.single_day}</td><td className="py-1 font-bold text-navy-dark">${RATES.non.single_day}</td></tr>
                      <tr className="border-t border-[#c8ddf4]/60"><td className="py-1 pr-3 font-bold">Single half day</td><td className="py-1 pr-3 font-bold text-navy-dark">${RATES.current.single_half_day}</td><td className="py-1 font-bold text-navy-dark">${RATES.non.single_half_day}</td></tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-[#5a6a8a] mt-2">
                  Returning campers automatically get the current-dancer rate.
                </p>
              </div>

              {/* Campers */}
              <div className="flex flex-col gap-6 mt-2">
                {form.campers.map((camper, idx) => {
                  const camperTotals = computeCamperTotals(camper)
                  return (
                    <div
                      key={camper.id}
                      className="border border-surface-border rounded-lg px-5 py-4 bg-surface-light/40 flex flex-col gap-5"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-navy-dark font-bold text-sm uppercase tracking-wide">
                          Camper {idx + 1}{camper.name ? ` · ${camper.name}` : ''}
                        </p>
                        {form.campers.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeCamper(camper.id)}
                            className="text-brand-red text-xs font-bold underline hover:text-red-700"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      {/* Returning / New */}
                      <div className={fieldClass}>
                        <span className={labelClass}>Returning Capital Core camper? <span className="text-brand-red text-xs font-normal">required</span></span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                          {[
                            { value: 'Yes', title: 'Returning camper', desc: 'Info on file — name only. Current-dancer rates.' },
                            { value: 'No',  title: 'New camper',        desc: 'First time — we need details. Non-studio rates.' },
                          ].map((opt) => {
                            const active = camper.isReturning === opt.value
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
                                    name={`isReturning-${camper.id}`}
                                    value={opt.value}
                                    checked={active}
                                    onChange={() => updateCamper(camper.id, { isReturning: opt.value })}
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

                      {camper.isReturning === 'Yes' && (
                        <div className={fieldClass}>
                          <label className={labelClass}>Camper's Full Name <span className="text-brand-red text-xs font-normal">required</span></label>
                          <input
                            type="text"
                            required
                            placeholder="Camper's name (so we can match the file)"
                            value={camper.name}
                            onChange={(e) => updateCamper(camper.id, { name: e.target.value })}
                            className={inputClass}
                          />
                          <p className="text-[#8a9aaa] text-xs">We'll pull age, DOB, and other details from our records.</p>
                        </div>
                      )}

                      {camper.isReturning === 'No' && (
                        <>
                          <div className={fieldClass}>
                            <label className={labelClass}>Camper's Full Name <span className="text-brand-red text-xs font-normal">required</span></label>
                            <input
                              type="text"
                              required
                              placeholder="Camper's name"
                              value={camper.name}
                              onChange={(e) => updateCamper(camper.id, { name: e.target.value })}
                              className={inputClass}
                            />
                          </div>
                          <div className="flex flex-col sm:flex-row gap-4">
                            <div className={`${fieldClass} flex-1`}>
                              <label className={labelClass}>Age <span className="text-brand-red text-xs font-normal">required</span></label>
                              <input
                                type="number"
                                min="3"
                                max="18"
                                required
                                placeholder="e.g. 8"
                                value={camper.age}
                                onChange={(e) => updateCamper(camper.id, { age: e.target.value })}
                                className={inputClass}
                              />
                            </div>
                            <div className={`${fieldClass} flex-1`}>
                              <label className={labelClass}>Date of Birth <span className="text-brand-red text-xs font-normal">required</span></label>
                              <input
                                type="date"
                                required
                                value={camper.birthdate}
                                onChange={(e) => updateCamper(camper.id, { birthdate: e.target.value })}
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
                                    name={`gender-${camper.id}`}
                                    value={opt}
                                    checked={camper.gender === opt}
                                    onChange={() => updateCamper(camper.id, { gender: opt })}
                                    required
                                  />
                                  {opt}
                                </label>
                              ))}
                            </div>
                          </div>
                        </>
                      )}

                      {camper.isReturning && (
                        <>
                          {/* Weeks */}
                          <div className={fieldClass}>
                            <span className={labelClass}>Weeks &amp; attendance <span className="text-brand-red text-xs font-normal">at least one</span></span>
                            <div className="flex flex-col gap-2 mt-1">
                              {CAMP_WEEKS.map((week) => {
                                const selection = camper.weeks[week.key]
                                const enabled = !!selection
                                return (
                                  <div
                                    key={week.key}
                                    className={`border rounded-md px-3 py-2.5 transition-colors ${
                                      enabled ? 'border-[#f4a8b4] bg-[#fff5f8]' : 'border-surface-border bg-white'
                                    }`}
                                  >
                                    <label className="flex items-start gap-2.5 text-[#3a4a6a] text-sm cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={enabled}
                                        onChange={(e) => toggleCamperWeek(camper.id, week.key, e.target.checked)}
                                        className="mt-0.5 flex-shrink-0"
                                      />
                                      <span className="font-semibold text-navy-dark text-sm">{week.label}</span>
                                    </label>

                                    {enabled && (
                                      <div className="mt-2 ml-7 flex flex-col gap-2">
                                        <div className={fieldClass}>
                                          <label className="text-[#3a4a6a] text-xs font-semibold uppercase tracking-wide">Attendance</label>
                                          <select
                                            value={selection.type}
                                            onChange={(e) => setCamperWeekType(camper.id, week.key, e.target.value)}
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
                                                    onChange={(e) => toggleCamperWeekDay(camper.id, week.key, day, e.target.checked)}
                                                  />
                                                  {day}
                                                </label>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                        <div className="text-right text-xs">
                                          <span className="text-[#5a6a8a]">Subtotal: </span>
                                          <span className="font-bold text-navy-dark">${calcWeekPrice(selection, camper.isReturning === 'Yes')}</span>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )
                              })}
                            </div>
                          </div>

                          {/* Care */}
                          <div className={fieldClass}>
                            <span className={labelClass}>Before &amp; after care <span className="text-[#8a9aaa] text-sm font-normal">(optional · $15/hr)</span></span>
                            {[
                              { kind: 'beforeCare', label: 'Before Care', accent: 'Drop-off time', times: BEFORE_CARE_TIMES, hint: 'Care ends 9:15 AM.' },
                              { kind: 'afterCare', label: 'After Care', accent: 'Pickup time', times: AFTER_CARE_TIMES, hint: 'Care starts 3:45 PM.' },
                            ].map(({ kind, label, accent, times, hint }) => {
                              const care = camper[kind]
                              return (
                                <div
                                  key={kind}
                                  className={`border rounded-md px-3 py-2.5 mt-1 ${care.enabled ? 'border-[#f4a8b4] bg-[#fff5f8]' : 'border-surface-border bg-white'}`}
                                >
                                  <label className="flex items-start gap-2.5 text-[#3a4a6a] text-sm cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={care.enabled}
                                      onChange={(e) => setCamperCare(camper.id, kind, { enabled: e.target.checked })}
                                      className="mt-0.5 flex-shrink-0"
                                    />
                                    <span className="font-semibold text-navy-dark text-sm">I need {label.toLowerCase()}</span>
                                  </label>
                                  {care.enabled && (
                                    <div className="mt-2 ml-7 flex flex-col gap-2">
                                      <div className={fieldClass}>
                                        <label className="text-[#3a4a6a] text-xs font-semibold uppercase tracking-wide">{accent}</label>
                                        <select
                                          value={care.time}
                                          onChange={(e) => setCamperCare(camper.id, kind, { time: e.target.value })}
                                          className={`${inputClass} max-w-xs`}
                                        >
                                          {times.map((t) => <option key={t} value={t}>{t}</option>)}
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
                                                onChange={(e) => toggleCamperCareDay(camper.id, kind, day, e.target.checked)}
                                              />
                                              {day}
                                            </label>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                          </div>

                          {/* Per-camper subtotal */}
                          <div className="flex justify-between items-center bg-white border border-surface-border rounded-md px-3 py-2 text-sm">
                            <span className="text-[#5a6a8a]">
                              {camper.name || 'This camper'} subtotal{camperTotals.isCurrent ? ' (current-dancer rates)' : ' (non-studio rates)'}
                            </span>
                            <span className="font-bold text-navy-dark">${camperTotals.subtotal.toFixed(2)}</span>
                          </div>
                        </>
                      )}
                    </div>
                  )
                })}

                <button
                  type="button"
                  onClick={addCamper}
                  className="border-2 border-dashed border-surface-border rounded-lg px-4 py-3 text-navy-dark font-bold text-sm hover:border-[#f4a8b4] hover:text-brand-red transition-colors"
                >
                  + Add another camper
                </button>
              </div>
            </div>

            <hr className="border-surface-border" />

            {/* Promo */}
            <div className="flex flex-col gap-2">
              <p className="text-navy-dark text-sm font-semibold">Promo Code <span className="text-[#8a9aaa] font-normal">(optional)</span></p>
              {promo ? (
                <div className="bg-green-50 border border-green-300 rounded-lg px-4 py-3 flex justify-between items-center gap-3">
                  <div>
                    <p className="text-green-800 font-bold text-sm">Code applied: {promo.code}</p>
                    <p className="text-green-700 text-xs">{promo.label}</p>
                    {promo.type === 'per_full_week' && totals.promoQualifyingWeeks === 0 && (
                      <p className="text-green-700 text-xs italic mt-1">
                        Applies to full-week or half-day-full-week selections — single-day picks don't qualify.
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
            {totals.grossSubtotal > 0 && (
              <div className="bg-white border-2 border-navy-dark rounded-lg px-5 py-4">
                <p className="text-navy-dark font-bold mb-2 text-sm uppercase tracking-wide">
                  Estimated Total · {totals.camperCount} camper{totals.camperCount !== 1 ? 's' : ''}
                </p>
                <ul className="text-[#3a4a6a] text-xs flex flex-col gap-1 mb-3">
                  {totals.perCamper.map((c) => (
                    <li key={c.id} className="flex flex-col gap-0.5 border-b border-surface-border/60 pb-1.5 mb-1.5 last:border-0 last:mb-0 last:pb-0">
                      <div className="flex justify-between">
                        <span className="font-bold text-navy-dark">{c.name || 'Camper'}{c.isCurrent ? ' (current)' : ' (non-studio)'}</span>
                        <span className="font-bold text-navy-dark">${c.subtotal.toFixed(2)}</span>
                      </div>
                      {c.weekItems.map((w) => (
                        <div key={w.weekKey} className="flex justify-between pl-2">
                          <span className="truncate">{w.weekLabel.split(':')[0]} — {w.description}</span>
                          <span>${w.price}</span>
                        </div>
                      ))}
                      {c.careItems.map((ci) => (
                        <div key={`${c.id}-${ci.type}`} className="flex justify-between pl-2">
                          <span className="truncate">{ci.description}</span>
                          <span>${ci.price.toFixed(2)}</span>
                        </div>
                      ))}
                    </li>
                  ))}
                </ul>
                {promo && totals.discount > 0 && (
                  <div className="flex justify-between text-xs text-green-700 mb-2">
                    <span>
                      {promo.code}
                      {promo.type === 'per_full_week' && (
                        <> · {totals.promoQualifyingWeeks} qualifying week{totals.promoQualifyingWeeks !== 1 ? 's' : ''}</>
                      )}
                      {promo.type === 'percent_off_all' && (
                        <> · {Math.round(promo.rate * 100)}% off entire order</>
                      )}
                    </span>
                    <span className="font-semibold">−${totals.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-3 border-t border-surface-border">
                  <span className="text-navy-dark font-bold">Total</span>
                  <span className="text-navy-dark font-black text-2xl">${totals.total.toFixed(2)}</span>
                </div>
                <p className="text-[#8a9aaa] text-xs mt-2">
                  A <span className="font-semibold text-navy-dark">${totals.depositTotal} deposit</span> (${DEPOSIT_PER_CAMPER} × {totals.camperCount} camper{totals.camperCount !== 1 ? 's' : ''}) on the next page holds the spot. Balance due before camp begins.
                </p>
              </div>
            )}

            <hr className="border-surface-border" />

            {/* Notes */}
            <div className="flex flex-col gap-5">
              <div>
                <p className="text-brand-red text-xs font-bold tracking-[0.3em] uppercase mb-1">Step 2</p>
                <h2 className="text-navy-dark text-lg font-black">Anything Else?</h2>
              </div>
              <div className={fieldClass}>
                <label className={labelClass} htmlFor="notes">Allergies, medical info, or notes <span className="text-[#8a9aaa] font-normal">(optional)</span></label>
                <textarea
                  id="notes"
                  rows={4}
                  placeholder="Anything we should know about your camper(s)?"
                  value={form.notes}
                  onChange={(e) => updateParent('notes', e.target.value)}
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>

            <hr className="border-surface-border" />

            {/* Policies */}
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-brand-red text-xs font-bold tracking-[0.3em] uppercase mb-1">Step 3</p>
                <h2 className="text-navy-dark text-lg font-black">Policies &amp; Acknowledgements</h2>
              </div>
              <div className="bg-[#fff5f8] border border-[#f4c8d4] rounded-lg px-5 py-4 flex flex-col gap-3">
                {[
                  { id: 'policyDeposit', label: `I understand a $${DEPOSIT_PER_CAMPER} non-refundable deposit per camper is required to secure each spot.` },
                  { id: 'policyConfirm', label: 'I understand registration is not confirmed until the deposit is received, and the remaining balance is due before camp begins.' },
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
            </div>

            {status === 'error' && (
              <p className="text-brand-red text-sm">{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="bg-brand-red text-white font-bold py-3 rounded-md hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === 'submitting' ? 'Submitting…' : `Continue to Deposit · $${totals.depositTotal} →`}
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
