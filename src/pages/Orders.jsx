import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

// ── Internal recital orders viewer ───────────────────────────────
// Not linked anywhere in the site nav. Reach it by typing /orders
// directly in the browser. A light passcode gate keeps casual
// visitors out (the data is owner-only, not public-facing).
//
// To change the passcode: set VITE_ORDERS_PASSCODE in .env (and in
// Vercel env vars), or edit the fallback below.
const ORDERS_PASSCODE = import.meta.env.VITE_ORDERS_PASSCODE || 'capcore2026'
const SESSION_KEY = 'cc_orders_unlocked'

const YOUTH_SIZES = ['YS', 'YM', 'YL', 'YXL', 'YXXL']
const ADULT_SIZES = ['S', 'M', 'L', 'XL', '2XL']

const CAT_LABELS = { tickets: 'Tickets', programs: 'Programs', shirts: 'Shirts' }

// Which item categories an order actually contains (for check-offs).
function presentCategories(o) {
  const cats = []
  if ((o.ticket_adult_qty || 0) + (o.ticket_kid_qty || 0) + (o.ticket_child_qty || 0) > 0) cats.push('tickets')
  if ((o.program_qty || 0) > 0) cats.push('programs')
  if (sizeEntries(o.youth_shirt_sizes, YOUTH_SIZES).length || sizeEntries(o.adult_shirt_sizes, ADULT_SIZES).length) cats.push('shirts')
  return cats
}

function isFullyFulfilled(o) {
  const cats = presentCategories(o)
  if (!cats.length) return false
  const f = o.fulfillment || {}
  return cats.every((c) => f[c] === true)
}

function fmtDate(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (isNaN(d)) return '—'
  return d.toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit',
  })
}

// youth_shirt_sizes / adult_shirt_sizes are stored as { YS: 0, YM: 2, ... }
function sizeEntries(obj, order) {
  if (!obj || typeof obj !== 'object') return []
  return order
    .filter((s) => Number(obj[s]) > 0)
    .map((s) => ({ size: s, qty: Number(obj[s]) }))
}

// ── Sort/filter helpers ──────────────────────────────────────────
// contact_name is a single free-text field, so split it for name sorts.
// First name = first token; last name = last token (handles middle names).
function nameParts(o) {
  const n = (o.contact_name || '').trim()
  if (!n) return { first: '', last: '' }
  const parts = n.split(/\s+/)
  return { first: parts[0] || '', last: parts.length > 1 ? parts[parts.length - 1] : '' }
}
function ticketTotal(o) {
  return Number(o.ticket_adult_qty || 0) + Number(o.ticket_kid_qty || 0) + Number(o.ticket_child_qty || 0)
}
function programTotal(o) {
  return Number(o.program_qty || 0)
}
function shirtTotal(o) {
  const y = YOUTH_SIZES.reduce((a, s) => a + Number(o.youth_shirt_sizes?.[s] || 0), 0)
  const a = ADULT_SIZES.reduce((acc, s) => acc + Number(o.adult_shirt_sizes?.[s] || 0), 0)
  return y + a
}

const SORT_OPTIONS = [
  { value: 'first', label: 'First name' },
  { value: 'last', label: 'Last name' },
  { value: 'date', label: 'Date' },
  { value: 'tickets', label: 'Tickets' },
  { value: 'programs', label: 'Programs' },
  { value: 'shirts', label: 'Shirts' },
]

const FILTER_OPTIONS = [
  { value: 'all', label: 'All orders' },
  { value: 'tickets', label: 'Has tickets' },
  { value: 'programs', label: 'Has programs' },
  { value: 'shirts', label: 'Has shirts' },
  { value: 'unfulfilled', label: 'Unfulfilled' },
  { value: 'fulfilled', label: 'Fulfilled' },
]

function matchesFilter(o, filter) {
  switch (filter) {
    case 'tickets': return ticketTotal(o) > 0
    case 'programs': return programTotal(o) > 0
    case 'shirts': return shirtTotal(o) > 0
    case 'fulfilled': return isFullyFulfilled(o)
    case 'unfulfilled': return !isFullyFulfilled(o)
    default: return true
  }
}

// ── Combining duplicate orders ───────────────────────────────────
// Rows combine when they share an email (case-insensitive) — even if
// the names differ, e.g. two family members ordering under one email.
// With no email, fall back to matching on name; with neither, stay solo.
function groupKey(o, index) {
  const email = (o.email || '').trim().toLowerCase()
  if (email) return `email:${email}`
  const name = (o.contact_name || '').trim().toLowerCase()
  if (name) return `name:${name}`
  return `__solo_${index}`
}

function sumSizes(group, field, sizes) {
  const out = {}
  for (const s of sizes) out[s] = group.reduce((a, o) => a + Number(o[field]?.[s] || 0), 0)
  return out
}

// Build one synthetic order from a group of rows. Carries the
// underlying rows on `_orders` so fulfillment writes hit every row.
function mergeGroup(group) {
  if (group.length === 1) return { ...group[0], _orders: group, _count: 1 }
  const base = group[0]
  const statuses = [...new Set(group.map((o) => o.status).filter(Boolean))]
  // Distinct names sharing this email — show them all, keep one email.
  const names = [...new Set(group.map((o) => (o.contact_name || '').trim()).filter(Boolean))]

  // A merged category counts as "given out" only when every row that
  // contains that category has it checked.
  const fulfillment = {}
  for (const cat of ['tickets', 'programs', 'shirts']) {
    const relevant = group.filter((o) => presentCategories(o).includes(cat))
    fulfillment[cat] = relevant.length > 0 && relevant.every((o) => o.fulfillment?.[cat] === true)
  }

  const latest = group.reduce(
    (acc, o) => {
      const t = new Date(o.created_at || 0).getTime()
      return t > acc.t ? { t, iso: o.created_at } : acc
    },
    { t: -Infinity, iso: base.created_at },
  )

  return {
    ...base,
    _orders: group,
    _count: group.length,
    _names: names,
    contact_name: names.join(' & ') || base.contact_name,
    id: undefined, // synthetic — no single row id
    ticket_adult_qty: group.reduce((a, o) => a + Number(o.ticket_adult_qty || 0), 0),
    ticket_kid_qty: group.reduce((a, o) => a + Number(o.ticket_kid_qty || 0), 0),
    ticket_child_qty: group.reduce((a, o) => a + Number(o.ticket_child_qty || 0), 0),
    program_qty: group.reduce((a, o) => a + Number(o.program_qty || 0), 0),
    youth_shirt_sizes: sumSizes(group, 'youth_shirt_sizes', YOUTH_SIZES),
    adult_shirt_sizes: sumSizes(group, 'adult_shirt_sizes', ADULT_SIZES),
    created_at: latest.iso,
    status: statuses.length <= 1 ? statuses[0] || base.status : 'mixed',
    fulfillment,
  }
}

function buildDisplayItems(orders, combine) {
  if (!combine) return orders.map((o) => ({ ...o, _orders: [o], _count: 1 }))
  const map = new Map()
  orders.forEach((o, i) => {
    const k = groupKey(o, i)
    if (!map.has(k)) map.set(k, [])
    map.get(k).push(o)
  })
  return Array.from(map.values()).map(mergeGroup)
}

function compareOrders(a, b, sortBy) {
  switch (sortBy) {
    case 'last': {
      const c = nameParts(a).last.localeCompare(nameParts(b).last, undefined, { sensitivity: 'base' })
      return c !== 0 ? c : nameParts(a).first.localeCompare(nameParts(b).first, undefined, { sensitivity: 'base' })
    }
    case 'date': {
      // Newest first within the ascending/descending toggle (asc = oldest first).
      return new Date(a.created_at || 0) - new Date(b.created_at || 0)
    }
    case 'tickets': return ticketTotal(a) - ticketTotal(b)
    case 'programs': return programTotal(a) - programTotal(b)
    case 'shirts': return shirtTotal(a) - shirtTotal(b)
    case 'first':
    default:
      return nameParts(a).first.localeCompare(nameParts(b).first, undefined, { sensitivity: 'base' })
  }
}

// ── CSV export ───────────────────────────────────────────────────
// Exports the rows exactly as shown (search/filter/sort/combine all
// applied). Per-size shirt columns make it usable as a printer sheet.
// Leading BOM so Excel reads UTF-8 (accented names) correctly.
function ordersToCsv(items) {
  const cols = [
    'Name', 'Email', 'Orders', 'Latest Date', 'Status',
    'Adult Tickets', 'Kid Tickets', 'Child Tickets', 'Total Tickets',
    'Programs',
    ...YOUTH_SIZES.map((s) => `Youth ${s}`),
    ...ADULT_SIZES.map((s) => `Adult ${s}`),
    'Total Shirts',
    'Tickets Given', 'Programs Given', 'Shirts Given', 'Fully Fulfilled',
  ]
  const esc = (v) => {
    const s = v == null ? '' : String(v)
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  const rows = items.map((o) => {
    const f = o.fulfillment || {}
    const cats = presentCategories(o)
    const given = (cat) => (cats.includes(cat) ? (f[cat] ? 'Yes' : 'No') : '—')
    return [
      o.contact_name || '',
      o.email || '',
      o._count || 1,
      o.created_at ? fmtDate(o.created_at) : '',
      o.status || '',
      o.ticket_adult_qty || 0,
      o.ticket_kid_qty || 0,
      o.ticket_child_qty || 0,
      ticketTotal(o),
      o.program_qty || 0,
      ...YOUTH_SIZES.map((s) => o.youth_shirt_sizes?.[s] || 0),
      ...ADULT_SIZES.map((s) => o.adult_shirt_sizes?.[s] || 0),
      shirtTotal(o),
      given('tickets'),
      given('programs'),
      given('shirts'),
      isFullyFulfilled(o) ? 'Yes' : 'No',
    ].map(esc).join(',')
  })
  return '﻿' + [cols.join(','), ...rows].join('\r\n')
}

function downloadCsv(items) {
  const csv = ordersToCsv(items)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const d = new Date()
  const stamp = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  const a = document.createElement('a')
  a.href = url
  a.download = `recital-orders-${stamp}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// ── PDF export (via the browser print dialog → "Save as PDF") ─────
// No external library: open a branded, print-styled page and trigger
// print. Same rows as the CSV (search/filter/sort/combine applied).
function escapeHtml(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ))
}

function shirtCellText(o) {
  const parts = [
    ...sizeEntries(o.youth_shirt_sizes, YOUTH_SIZES).map((e) => `${e.size}×${e.qty}`),
    ...sizeEntries(o.adult_shirt_sizes, ADULT_SIZES).map((e) => `${e.size}×${e.qty}`),
  ]
  return parts.length ? parts.join(', ') : '—'
}

function buildPrintHtml(items) {
  const d = new Date()
  const stamp = d.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
  let tA = 0, tK = 0, tC = 0, prog = 0, shirts = 0
  for (const o of items) {
    tA += Number(o.ticket_adult_qty || 0); tK += Number(o.ticket_kid_qty || 0); tC += Number(o.ticket_child_qty || 0)
    prog += Number(o.program_qty || 0); shirts += shirtTotal(o)
  }
  const rows = items.map((o, i) => {
    const f = o.fulfillment || {}
    const cats = presentCategories(o)
    const given = (cat) => (cats.includes(cat) ? (f[cat] ? '✓' : '○') : '—')
    return `<tr>
      <td class="c">${i + 1}</td>
      <td class="name">${escapeHtml(o.contact_name || '—')}${(o._count || 1) > 1 ? ` <span class="badge">${o._count}</span>` : ''}</td>
      <td>${escapeHtml(o.email || '—')}</td>
      <td>${o.created_at ? escapeHtml(fmtDate(o.created_at)) : '—'}</td>
      <td class="c">${o.ticket_adult_qty || 0}</td>
      <td class="c">${o.ticket_kid_qty || 0}</td>
      <td class="c">${o.ticket_child_qty || 0}</td>
      <td class="c">${o.program_qty || 0}</td>
      <td>${escapeHtml(shirtCellText(o))}</td>
      <td class="c">${given('tickets')}</td>
      <td class="c">${given('programs')}</td>
      <td class="c">${given('shirts')}</td>
    </tr>`
  }).join('')
  return `<!doctype html><html><head><meta charset="utf-8"><title>Recital Orders</title>
  <style>
    @page { size: landscape; margin: 14mm; }
    * { box-sizing: border-box; }
    body { font-family: Georgia, 'Times New Roman', serif; color:#1a2233; margin:0; padding:24px; }
    .head { display:flex; justify-content:space-between; align-items:flex-end; border-bottom:3px solid #C9A84C; padding-bottom:10px; margin-bottom:14px; }
    .brand { font-size:11px; letter-spacing:3px; text-transform:uppercase; color:#9a7f2e; font-weight:bold; }
    h1 { font-size:22px; margin:2px 0 0; color:#0d1b36; }
    .meta { text-align:right; font-size:11px; color:#555; font-family:Arial,sans-serif; }
    .summary { font-family:Arial,sans-serif; font-size:12px; margin-bottom:14px; color:#333; }
    .summary strong { color:#0d1b36; }
    table { width:100%; border-collapse:collapse; font-family:Arial,sans-serif; font-size:11px; }
    th { background:#0d1b36; color:#fff; text-align:left; padding:6px 7px; font-size:10px; text-transform:uppercase; letter-spacing:.5px; }
    th.c { text-align:center; }
    td { padding:5px 7px; border-bottom:1px solid #e3e7ef; vertical-align:top; }
    tr:nth-child(even) td { background:#f7f8fb; }
    td.c { text-align:center; }
    td.name { font-weight:bold; color:#0d1b36; }
    .badge { font-size:9px; background:#C9A84C; color:#0d1b36; border-radius:3px; padding:0 4px; font-family:Arial,sans-serif; }
    @media print { body { padding:0; } }
  </style></head>
  <body>
    <div class="head">
      <div><div class="brand">Capital Core · Internal</div><h1>Recital Orders</h1></div>
      <div class="meta">Generated ${escapeHtml(stamp)}<br>${items.length} ${items.length === 1 ? 'row' : 'rows'}</div>
    </div>
    <div class="summary">
      Tickets — Adult <strong>${tA}</strong>, Kid <strong>${tK}</strong>, Child <strong>${tC}</strong>
      &nbsp;·&nbsp; Programs <strong>${prog}</strong>
      &nbsp;·&nbsp; Shirts <strong>${shirts}</strong>
    </div>
    <table>
      <thead><tr>
        <th class="c">#</th><th>Name</th><th>Email</th><th>Date</th>
        <th class="c">Adult</th><th class="c">Kid</th><th class="c">Child</th>
        <th class="c">Prog</th><th>Shirts</th>
        <th class="c">Tix&nbsp;Given</th><th class="c">Prog&nbsp;Given</th><th class="c">Shirt&nbsp;Given</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <script>window.onload=function(){window.focus();window.print();};window.onafterprint=function(){window.close();};</script>
  </body></html>`
}

function exportPdf(items) {
  // Load via a same-origin Blob URL (no document.write). The embedded
  // onload script triggers the print dialog; user picks "Save as PDF".
  const blob = new Blob([buildPrintHtml(items)], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const w = window.open(url, '_blank')
  if (!w) { URL.revokeObjectURL(url); alert('Pop-up blocked — allow pop-ups for this site to export a PDF.'); return }
  setTimeout(() => URL.revokeObjectURL(url), 60000)
}

function StatusPill({ status }) {
  const map = {
    paid: 'bg-green-100 text-green-800 border-green-300',
    free: 'bg-blue-100 text-blue-800 border-blue-300',
  }
  const cls = map[status] || 'bg-gray-100 text-gray-700 border-gray-300'
  return (
    <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${cls}`}>
      {status || 'unknown'}
    </span>
  )
}

function Gate({ onUnlock }) {
  const [val, setVal] = useState('')
  const [error, setError] = useState(false)

  function submit(e) {
    e.preventDefault()
    if (val === ORDERS_PASSCODE) {
      sessionStorage.setItem(SESSION_KEY, '1')
      onUnlock()
    } else {
      setError(true)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0d1b36] via-[#1a1040] to-[#5a1020] px-6">
      <form onSubmit={submit} className="w-full max-w-xs text-center">
        <p className="text-[#C9A84C] text-xs font-black tracking-[0.3em] uppercase mb-2">Capital Core</p>
        <h1 className="text-white text-2xl font-bold mb-6" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          Orders
        </h1>
        <input
          type="password"
          autoFocus
          value={val}
          onChange={(e) => { setVal(e.target.value); setError(false) }}
          placeholder="Passcode"
          className="w-full bg-white/5 border border-white/20 text-white rounded-lg px-4 py-2.5 text-sm text-center placeholder:text-white/30 focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]/30"
        />
        {error && <p className="text-red-400 text-xs mt-2">Incorrect passcode</p>}
        <button
          type="submit"
          className="mt-4 w-full bg-[#C9A84C] text-[#0B1F3A] font-black py-2.5 rounded-lg hover:bg-[#d4b85a] transition-colors text-sm tracking-widest uppercase"
        >
          Unlock
        </button>
      </form>
    </div>
  )
}

export default function Orders() {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(SESSION_KEY) === '1')
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saveError, setSaveError] = useState('')
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState('first')
  const [sortDir, setSortDir] = useState('asc')
  const [filter, setFilter] = useState('all')
  const [combine, setCombine] = useState(true)
  const [exportOpen, setExportOpen] = useState(false)

  // Toggle a fulfillment category, persisted to Supabase. Works for a
  // single order or a combined group — `item._orders` holds the rows
  // to update (just the one order when not combined). Optimistic:
  // update local state first, revert every touched row if any write fails.
  async function toggleFulfillment(item, cat, checked) {
    const targets = (item._orders || [item]).filter((o) => o.id && presentCategories(o).includes(cat))
    if (!targets.length) { setSaveError('This order has no id, so it can’t be updated.'); return }
    setSaveError('')

    const originals = new Map(targets.map((o) => [o.id, o.fulfillment || {}]))
    const ids = new Set(targets.map((o) => o.id))
    setOrders((prev) => prev.map((o) => (ids.has(o.id) ? { ...o, fulfillment: { ...(o.fulfillment || {}), [cat]: checked } } : o)))

    const results = await Promise.all(
      targets.map((o) =>
        supabase.from('recital_orders').update({ fulfillment: { ...originals.get(o.id), [cat]: checked } }).eq('id', o.id),
      ),
    )
    if (results.some((r) => r.error)) {
      setOrders((prev) => prev.map((o) => (originals.has(o.id) ? { ...o, fulfillment: originals.get(o.id) } : o)))
      setSaveError(results.find((r) => r.error)?.error?.message || 'Could not save that change.')
    }
  }

  // Keep this page out of search results.
  useEffect(() => {
    document.title = 'Recital Orders · Capital Core'
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex, nofollow'
    document.head.appendChild(meta)
    return () => { document.head.removeChild(meta) }
  }, [])

  useEffect(() => {
    if (!unlocked) return
    let active = true
    ;(async () => {
      setLoading(true)
      // Newest first. Fall back to unordered if created_at is absent.
      let { data, error } = await supabase
        .from('recital_orders')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) {
        const retry = await supabase.from('recital_orders').select('*')
        data = retry.data
        error = retry.error
      }
      if (!active) return
      if (error) {
        setError(error.message || 'Could not load orders.')
        setOrders([])
      } else {
        setOrders(data || [])
      }
      setLoading(false)
    })()
    return () => { active = false }
  }, [unlocked])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return orders.filter((o) => {
      if (!matchesFilter(o, filter)) return false
      if (!q) return true
      return (
        (o.contact_name || '').toLowerCase().includes(q) ||
        (o.email || '').toLowerCase().includes(q) ||
        (o.promo_code || '').toLowerCase().includes(q) ||
        (o.paypal_order_id || '').toLowerCase().includes(q)
      )
    })
  }, [orders, query, filter])

  const sorted = useMemo(() => {
    const items = buildDisplayItems(filtered, combine)
    items.sort((a, b) => compareOrders(a, b, sortBy))
    if (sortDir === 'desc') items.reverse()
    return items
  }, [filtered, combine, sortBy, sortDir])

  // ── Aggregates across the (filtered) order set, for fulfillment ──
  const totals = useMemo(() => {
    const t = {
      orders: filtered.length,
      fulfilled: 0,
      adult: 0, kid: 0, child: 0,
      programs: 0,
      youth: Object.fromEntries(YOUTH_SIZES.map((s) => [s, 0])),
      adultShirt: Object.fromEntries(ADULT_SIZES.map((s) => [s, 0])),
    }
    for (const o of filtered) {
      if (isFullyFulfilled(o)) t.fulfilled += 1
      t.adult += Number(o.ticket_adult_qty || 0)
      t.kid += Number(o.ticket_kid_qty || 0)
      t.child += Number(o.ticket_child_qty || 0)
      t.programs += Number(o.program_qty || 0)
      for (const s of YOUTH_SIZES) t.youth[s] += Number(o.youth_shirt_sizes?.[s] || 0)
      for (const s of ADULT_SIZES) t.adultShirt[s] += Number(o.adult_shirt_sizes?.[s] || 0)
    }
    t.youthTotal = YOUTH_SIZES.reduce((a, s) => a + t.youth[s], 0)
    t.adultShirtTotal = ADULT_SIZES.reduce((a, s) => a + t.adultShirt[s], 0)
    return t
  }, [filtered])

  if (!unlocked) return <Gate onUnlock={() => setUnlocked(true)} />

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`.ord-serif { font-family: 'Playfair Display', Georgia, serif; }`}</style>

      {/* Header */}
      <header className="bg-gradient-to-br from-[#0d1b36] via-[#1a1040] to-[#5a1020] text-white">
        <div className="max-w-6xl mx-auto px-5 py-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[#C9A84C] text-[10px] font-black tracking-[0.3em] uppercase">Capital Core · Internal</p>
            <h1 className="ord-serif text-2xl font-black">Recital Orders</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setExportOpen((o) => !o)}
                disabled={sorted.length === 0}
                className="flex items-center gap-1.5 bg-[#C9A84C] text-[#0d1b36] hover:bg-[#d4b85a] disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold rounded-md px-3 py-1.5 transition-colors"
                title="Export the orders shown"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3v12" /><path d="m7 11 5 5 5-5" /><path d="M5 21h14" />
                </svg>
                Export
                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
              {exportOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setExportOpen(false)} />
                  <div className="absolute right-0 mt-1 z-20 bg-white rounded-md shadow-lg border border-gray-200 overflow-hidden min-w-[180px] text-left">
                    <button
                      onClick={() => { downloadCsv(sorted); setExportOpen(false) }}
                      className="flex w-full items-center gap-2 px-3 py-2.5 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-bold text-[#0d1b36]">CSV</span>
                      <span className="text-gray-400">Excel / Google Sheets</span>
                    </button>
                    <button
                      onClick={() => { exportPdf(sorted); setExportOpen(false) }}
                      className="flex w-full items-center gap-2 px-3 py-2.5 text-xs text-gray-700 hover:bg-gray-50 border-t border-gray-100 transition-colors"
                    >
                      <span className="font-bold text-[#0d1b36]">PDF</span>
                      <span className="text-gray-400">Print / Save as PDF</span>
                    </button>
                  </div>
                </>
              )}
            </div>
            <Link
              to="/"
              className="flex items-center gap-1.5 text-white/70 hover:text-white text-xs font-semibold border border-white/20 hover:border-white/40 rounded-md px-3 py-1.5 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9.5 12 3l9 6.5" /><path d="M5 9v11h14V9" />
              </svg>
              Home
            </Link>
            <button
              onClick={() => { sessionStorage.removeItem(SESSION_KEY); setUnlocked(false) }}
              className="text-white/50 hover:text-white text-xs underline"
            >
              Lock
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 py-6">
        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          <SummaryCard label="Orders" value={totals.orders} />
          <SummaryCard label="Fulfilled" value={`${totals.fulfilled} / ${totals.orders}`} accent />
          <SummaryCard label="Tickets (adult/kid/child)" value={`${totals.adult} / ${totals.kid} / ${totals.child}`} />
          <SummaryCard label="Programs" value={totals.programs} />
          <SummaryCard label="Shirts (youth/adult)" value={`${totals.youthTotal} / ${totals.adultShirtTotal}`} />
        </div>

        {/* Shirt size breakdown — the thing you order from the printer */}
        {(totals.youthTotal > 0 || totals.adultShirtTotal > 0) && (
          <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
            <p className="text-[#0B1F3A] font-bold text-sm mb-3">Shirt totals by size</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <SizeRow title="Youth" sizes={YOUTH_SIZES} counts={totals.youth} total={totals.youthTotal} />
              <SizeRow title="Adult" sizes={ADULT_SIZES} counts={totals.adultShirt} total={totals.adultShirtTotal} />
            </div>
          </div>
        )}

        {/* Search + sort + filter */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email, promo, or PayPal ID…"
            className="w-full sm:w-auto sm:flex-1 sm:min-w-[200px] bg-white border border-gray-300 text-gray-900 rounded-lg px-4 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]/30"
          />

          {/* Filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="flex-1 sm:flex-none min-w-0 bg-white border border-gray-300 text-gray-900 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]/30"
            title="Filter orders"
          >
            {FILTER_OPTIONS.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>

          {/* Sort */}
          <div className="flex-1 sm:flex-none min-w-0 flex items-center gap-1.5">
            <label className="text-gray-400 text-xs uppercase tracking-wide hidden sm:block">Sort</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 sm:flex-none min-w-0 bg-white border border-gray-300 text-gray-900 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]/30"
              title="Sort orders by"
            >
              {SORT_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            <button
              onClick={() => setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))}
              className="bg-white border border-gray-300 text-[#0B1F3A] rounded-lg px-3 py-2.5 text-sm font-bold hover:border-[#C9A84C] transition-colors"
              title={sortDir === 'asc' ? 'Ascending (A→Z, oldest, fewest)' : 'Descending (Z→A, newest, most)'}
            >
              {sortDir === 'asc' ? '↑' : '↓'}
            </button>
          </div>

          {/* Combine duplicate orders by same name + email */}
          <label className="flex-1 sm:flex-none flex items-center gap-2 cursor-pointer select-none bg-white border border-gray-300 rounded-lg px-3 py-2.5" title="Group orders that share an email (names may differ) into one row">
            <input
              type="checkbox"
              checked={combine}
              onChange={(e) => setCombine(e.target.checked)}
              className="w-4 h-4 accent-[#0B1F3A] cursor-pointer"
            />
            <span className="text-gray-700 text-sm whitespace-nowrap">Combine duplicates</span>
          </label>

          <span className="text-gray-400 text-xs whitespace-nowrap">{sorted.length} {combine ? 'people' : 'orders'} shown</span>
        </div>

        {/* Save error */}
        {saveError && (
          <div className="mb-4 bg-amber-50 border border-amber-300 text-amber-800 rounded-lg px-4 py-2.5 text-sm flex items-center justify-between gap-3">
            <span>Couldn’t save check-off: {saveError}</span>
            <button onClick={() => setSaveError('')} className="text-amber-700 hover:text-amber-900 font-bold">×</button>
          </div>
        )}

        {/* States */}
        {loading && <p className="text-gray-500 text-sm py-12 text-center">Loading orders…</p>}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">{error}</div>
        )}
        {!loading && !error && sorted.length === 0 && (
          <p className="text-gray-500 text-sm py-12 text-center">
            {orders.length === 0 ? 'No orders yet.' : 'No orders match your search or filter.'}
          </p>
        )}

        {/* Order list */}
        <div className="space-y-4">
          {sorted.map((o, i) => <OrderCard key={o.id || o.paypal_order_id || i} o={o} onToggle={toggleFulfillment} />)}
        </div>
      </main>
    </div>
  )
}

function SummaryCard({ label, value, accent }) {
  return (
    <div className={`rounded-xl p-4 border ${accent ? 'bg-[#fdf8f0] border-[#C9A84C]/40' : 'bg-white border-gray-200'}`}>
      <p className="text-gray-500 text-[11px] font-semibold uppercase tracking-wide leading-tight">{label}</p>
      <p className={`mt-1 font-black text-xl ${accent ? 'text-[#C9A84C]' : 'text-[#0B1F3A]'}`}>{value}</p>
    </div>
  )
}

function SizeRow({ title, sizes, counts, total }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-[#0B1F3A] font-bold text-xs uppercase tracking-wider">{title}</span>
        <span className="text-gray-400 text-xs">{total} total</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {sizes.map((s) => (
          <span
            key={s}
            className={`text-xs px-2.5 py-1 rounded-md border ${counts[s] > 0 ? 'bg-[#0B1F3A] text-white border-[#0B1F3A]' : 'bg-gray-50 text-gray-400 border-gray-200'}`}
          >
            {s}: <strong>{counts[s]}</strong>
          </span>
        ))}
      </div>
    </div>
  )
}

function OrderCard({ o, onToggle }) {
  const youth = sizeEntries(o.youth_shirt_sizes, YOUTH_SIZES)
  const adult = sizeEntries(o.adult_shirt_sizes, ADULT_SIZES)
  const hasTickets = (o.ticket_adult_qty || 0) + (o.ticket_kid_qty || 0) + (o.ticket_child_qty || 0) > 0
  const hasShirts = youth.length > 0 || adult.length > 0
  const cats = presentCategories(o)
  const fully = isFullyFulfilled(o)
  const rows = o._orders || [o]
  const saveable = rows.some((x) => x.id)
  const combined = (o._count || 1) > 1

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      {/* Card header */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 bg-gray-50 border-b border-gray-200">
        <div className="min-w-0">
          <p className={`text-[#0B1F3A] font-bold text-sm flex items-center flex-wrap gap-2 ${combined ? '' : 'truncate'}`}>
            {o.contact_name || 'No name'}
            {combined && (
              <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#C9A84C]/20 text-[#9a7f2e] border border-[#C9A84C]/40">
                {o._count} orders{o._names && o._names.length > 1 ? ` · ${o._names.length} names` : ''}
              </span>
            )}
          </p>
          <a href={`mailto:${o.email}`} className="text-gray-500 text-xs hover:text-[#C9A84C] truncate block">{o.email || '—'}</a>
        </div>
        <div className="flex items-center gap-3 text-right">
          <p className="text-gray-400 text-[11px]">{combined ? `latest ${fmtDate(o.created_at)}` : fmtDate(o.created_at)}</p>
          <StatusPill status={o.status} />
        </div>
      </div>

      {/* Card body */}
      <div className="px-5 py-4 grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
        {/* Tickets */}
        {hasTickets && (
          <div>
            <p className="text-[#C9A84C] text-[10px] font-black tracking-widest uppercase mb-1">Tickets</p>
            <ul className="text-gray-700 space-y-0.5">
              {o.ticket_adult_qty > 0 && <li>{o.ticket_adult_qty} × Adult</li>}
              {o.ticket_kid_qty > 0 && <li>{o.ticket_kid_qty} × Kid (4–11)</li>}
              {o.ticket_child_qty > 0 && <li>{o.ticket_child_qty} × Child (3 &amp; under, free)</li>}
            </ul>
          </div>
        )}

        {/* Programs */}
        {o.program_qty > 0 && (
          <div>
            <p className="text-[#C9A84C] text-[10px] font-black tracking-widest uppercase mb-1">Programs</p>
            <p className="text-gray-700">{o.program_qty} × Show Program</p>
          </div>
        )}

        {/* Shirts */}
        {hasShirts && (
          <div className="sm:col-span-2">
            <p className="text-[#C9A84C] text-[10px] font-black tracking-widest uppercase mb-1">T-Shirts</p>
            <div className="flex flex-wrap gap-1.5">
              {youth.map(({ size, qty }) => (
                <span key={`y-${size}`} className="text-xs bg-gray-100 border border-gray-200 rounded px-2 py-0.5 text-gray-700">
                  Youth {size} × {qty}
                </span>
              ))}
              {adult.map(({ size, qty }) => (
                <span key={`a-${size}`} className="text-xs bg-gray-100 border border-gray-200 rounded px-2 py-0.5 text-gray-700">
                  Adult {size} × {qty}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Card footer — fulfillment check-offs */}
      <div className={`px-5 py-3 border-t flex flex-wrap items-center gap-x-5 gap-y-2 ${fully ? 'bg-green-50 border-green-100' : 'bg-gray-50 border-gray-100'}`}>
        <span className="text-[10px] font-black tracking-widest uppercase text-gray-400">Given out</span>
        {cats.map((cat) => {
          const checked = !!o.fulfillment?.[cat]
          // In a combined card, flag when some (but not all) rows are done.
          const relevant = rows.filter((x) => presentCategories(x).includes(cat))
          const partial = !checked && relevant.length > 1 && relevant.some((x) => x.fulfillment?.[cat] === true)
          return (
            <label key={cat} className="flex items-center gap-2 cursor-pointer select-none" title={saveable ? '' : 'No record id — cannot save'}>
              <input
                type="checkbox"
                checked={checked}
                disabled={!saveable}
                onChange={(e) => onToggle(o, cat, e.target.checked)}
                className="w-4 h-4 accent-[#0B1F3A] cursor-pointer disabled:cursor-not-allowed"
              />
              <span className={`text-xs ${checked ? 'text-green-700 font-semibold line-through' : 'text-gray-600'}`}>
                {CAT_LABELS[cat]}
                {partial && <span className="text-amber-600 font-semibold"> · partial</span>}
              </span>
            </label>
          )
        })}
        {fully && <span className="ml-auto text-green-700 text-xs font-bold">✓ Complete</span>}
      </div>
    </div>
  )
}
