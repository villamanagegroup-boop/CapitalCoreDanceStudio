import { useState, useEffect, useMemo } from 'react'
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
    <div className="min-h-screen flex items-center justify-center bg-[#0B1F3A] px-6">
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

  // Toggle a fulfillment category for one order, persisted to Supabase.
  // Optimistic: update local state first, revert if the write fails.
  async function toggleFulfillment(order, cat, checked) {
    if (!order.id) { setSaveError('This order has no id, so it can’t be updated.'); return }
    const next = { ...(order.fulfillment || {}), [cat]: checked }
    setSaveError('')
    setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, fulfillment: next } : o)))
    const { error } = await supabase.from('recital_orders').update({ fulfillment: next }).eq('id', order.id)
    if (error) {
      setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, fulfillment: order.fulfillment || {} } : o)))
      setSaveError(error.message || 'Could not save that change.')
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
    if (!q) return orders
    return orders.filter((o) =>
      (o.contact_name || '').toLowerCase().includes(q) ||
      (o.email || '').toLowerCase().includes(q) ||
      (o.promo_code || '').toLowerCase().includes(q) ||
      (o.paypal_order_id || '').toLowerCase().includes(q)
    )
  }, [orders, query])

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
      <header className="bg-[#0B1F3A] text-white">
        <div className="max-w-6xl mx-auto px-5 py-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[#C9A84C] text-[10px] font-black tracking-[0.3em] uppercase">Capital Core · Internal</p>
            <h1 className="ord-serif text-2xl font-black">Recital Orders</h1>
          </div>
          <button
            onClick={() => { sessionStorage.removeItem(SESSION_KEY); setUnlocked(false) }}
            className="text-white/50 hover:text-white text-xs underline"
          >
            Lock
          </button>
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

        {/* Search */}
        <div className="mb-4 flex items-center gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email, promo, or PayPal ID…"
            className="flex-1 bg-white border border-gray-300 text-gray-900 rounded-lg px-4 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]/30"
          />
          <span className="text-gray-400 text-xs whitespace-nowrap">{filtered.length} shown</span>
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
        {!loading && !error && filtered.length === 0 && (
          <p className="text-gray-500 text-sm py-12 text-center">
            {orders.length === 0 ? 'No orders yet.' : 'No orders match your search.'}
          </p>
        )}

        {/* Order list */}
        <div className="space-y-4">
          {filtered.map((o, i) => <OrderCard key={o.id || o.paypal_order_id || i} o={o} onToggle={toggleFulfillment} />)}
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

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      {/* Card header */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 bg-gray-50 border-b border-gray-200">
        <div className="min-w-0">
          <p className="text-[#0B1F3A] font-bold text-sm truncate">{o.contact_name || 'No name'}</p>
          <a href={`mailto:${o.email}`} className="text-gray-500 text-xs hover:text-[#C9A84C] truncate block">{o.email || '—'}</a>
        </div>
        <div className="flex items-center gap-3 text-right">
          <p className="text-gray-400 text-[11px]">{fmtDate(o.created_at)}</p>
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
          return (
            <label key={cat} className="flex items-center gap-2 cursor-pointer select-none" title={o.id ? '' : 'No record id — cannot save'}>
              <input
                type="checkbox"
                checked={checked}
                disabled={!o.id}
                onChange={(e) => onToggle(o, cat, e.target.checked)}
                className="w-4 h-4 accent-[#0B1F3A] cursor-pointer disabled:cursor-not-allowed"
              />
              <span className={`text-xs ${checked ? 'text-green-700 font-semibold line-through' : 'text-gray-600'}`}>
                {CAT_LABELS[cat]}
              </span>
            </label>
          )
        })}
        {fully && <span className="ml-auto text-green-700 text-xs font-bold">✓ Complete</span>}
      </div>
    </div>
  )
}
