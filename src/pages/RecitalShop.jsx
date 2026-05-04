import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import { supabase } from '../lib/supabase'
import { breadcrumbSchema, productSchema } from '../lib/schema'

const SHOP_JSON_LD = [
  breadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Recital', path: '/recital' },
    { name: 'Recital Shop', path: '/recitalshop' },
  ]),
  productSchema({
    name: 'A Night at the Cinema — Recital General Admission Ticket',
    description: 'General admission ticket for the Capital Core Dance Studio annual recital, A Night at the Cinema, on June 13, 2026 at Richmond Christian School.',
    image: '/ticket-banner.png',
    price: '25.00',
    url: '/recitalshop',
  }),
  productSchema({
    name: 'Capital Core Dance Studio — Adult Recital T-Shirt',
    description: 'Official "A Night at the Cinema" adult t-shirt with full cast list on the back.',
    image: '/kids-shirt.png',
    price: '25.00',
    url: '/recitalshop',
  }),
  productSchema({
    name: 'Capital Core Dance Studio — Youth Recital T-Shirt',
    description: 'Official "A Night at the Cinema" youth t-shirt with full cast list on the back.',
    image: '/womens-shirt.png',
    price: '20.00',
    url: '/recitalshop',
  }),
  productSchema({
    name: 'Capital Core Dance Studio — Recital Show Program',
    description: 'Official printed program for A Night at the Cinema. Pre-order $10, day-of $15.',
    price: '10.00',
    url: '/recitalshop',
  }),
]

// ── Pricing ──────────────────────────────────────────────────
const SHOW_DATE = new Date('2026-06-12T00:00:00')
const isAfterShow = new Date() >= SHOW_DATE

const TICKET_ADULT_PRICE = 25
// Children 3 & under are free

const PROGRAM_PRICE = isAfterShow ? 15 : 10

const YOUTH_PRICE = isAfterShow ? Math.round(20 * 1.05 * 100) / 100 : 20
const ADULT_PRICE = isAfterShow ? Math.round(25 * 1.05 * 100) / 100 : 25
const YOUTH_SIZES = ['YS', 'YM', 'YL', 'YXL', 'YXXL']
const ADULT_SIZES = ['S', 'M', 'L', 'XL', '2XL']

const SHOW_INFO = {
  label: 'Recital',
  date: 'Saturday, June 13, 2026',
  time: '2:00 PM',
  venue: 'Richmond Christian School',
  address: '6511 Belmont Rd, Chesterfield, VA 23832',
}

// ── Promo codes (case-insensitive) ──────────────────────────
// appliesTo: 'tickets' (rate × min(adultQty, maxQty)) or 'all' (rate × subtotal)
const PROMO_CODES = {
  VOLUNTEER:  { label: 'Volunteer · 20% off adult tickets (up to 6)', appliesTo: 'tickets', rate: 0.20, maxQty: 6 },
  CGADMIN100: { label: 'Admin · 100% off entire order (testing)',     appliesTo: 'all',     rate: 1.00 },
}

function validatePromo(code) {
  const upper = (code || '').trim().toUpperCase()
  if (!upper) return null
  return PROMO_CODES[upper] ? { code: upper, ...PROMO_CODES[upper] } : null
}

function fmtPrice(n) {
  return n % 1 === 0 ? `$${n}` : `$${n.toFixed(2)}`
}

const initSizeQty = (sizes) => Object.fromEntries(sizes.map((s) => [s, 0]))
const sumQty = (obj) => Object.values(obj).reduce((a, b) => a + b, 0)

const TABS = [
  { id: 'tickets', label: 'Tickets' },
  { id: 'programs', label: 'Show Programs' },
  { id: 'shirts', label: 'T-Shirts' },
]

// ── Reusable bits ───────────────────────────────────────────
function Stepper({ qty, onInc, onDec, min = 0, max = 50 }) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={onDec}
        disabled={qty <= min}
        className="w-9 h-9 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-lg leading-none"
      >−</button>
      <span className="text-[#0B1F3A] font-bold text-lg w-7 text-center tabular-nums">{qty}</span>
      <button
        type="button"
        onClick={onInc}
        disabled={qty >= max}
        className="w-9 h-9 rounded-full bg-[#0B1F3A] text-white flex items-center justify-center hover:bg-[#1a3055] disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-lg leading-none"
      >+</button>
    </div>
  )
}

function SizeControl({ size, qty, onInc, onDec }) {
  return (
    <div className="flex flex-col items-center gap-2 bg-gray-50 rounded-lg p-3 border border-gray-200">
      <span className="text-[#0B1F3A] text-sm font-semibold">{size}</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onDec}
          disabled={qty === 0}
          className="w-7 h-7 rounded-md bg-gray-200 text-gray-500 flex items-center justify-center hover:bg-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-base leading-none"
        >−</button>
        <span className="text-[#0B1F3A] font-bold w-5 text-center text-sm tabular-nums">{qty}</span>
        <button
          type="button"
          onClick={onInc}
          className="w-7 h-7 rounded-md bg-[#0B1F3A] text-white flex items-center justify-center hover:bg-[#1a3055] transition-colors text-base leading-none"
        >+</button>
      </div>
    </div>
  )
}

export default function RecitalShop() {
  const navigate = useNavigate()
  const location = useLocation()

  // ── Tab state (initial from URL hash) ─────────────────────
  const [activeTab, setActiveTab] = useState(() => {
    const hash = (location.hash || '').replace('#', '')
    return TABS.some((t) => t.id === hash) ? hash : 'tickets'
  })

  useEffect(() => {
    const hash = (location.hash || '').replace('#', '')
    if (TABS.some((t) => t.id === hash)) setActiveTab(hash)
  }, [location.hash])

  // ── Cart state (one cart, all products) ───────────────────
  // Tickets
  const [adultQty, setAdultQty] = useState(0)
  const [childQty, setChildQty] = useState(0)
  // Programs
  const [programQty, setProgramQty] = useState(0)
  // Shirts
  const [youthQty, setYouthQty] = useState(initSizeQty(YOUTH_SIZES))
  const [adultSizeQty, setAdultSizeQty] = useState(initSizeQty(ADULT_SIZES))
  const [sizeChart, setSizeChart] = useState(null)

  // Combined contact + checkout
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [ack, setAck] = useState(false)
  const [promoCode, setPromoCode] = useState('')
  const [promo, setPromo] = useState(null)
  const [promoError, setPromoError] = useState('')

  // Status
  const [paypalReady, setPaypalReady] = useState(false)
  const [paypalRendered, setPaypalRendered] = useState(false)
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState('')

  const totalRef = useRef(0)
  const formRef = useRef({})

  // ── Derived ───────────────────────────────────────────────
  const ticketSubtotal = adultQty * TICKET_ADULT_PRICE
  const programSubtotal = programQty * PROGRAM_PRICE
  const youthShirtSubtotal = YOUTH_SIZES.reduce((sum, s) => sum + youthQty[s] * YOUTH_PRICE, 0)
  const adultShirtSubtotal = ADULT_SIZES.reduce((sum, s) => sum + adultSizeQty[s] * ADULT_PRICE, 0)
  const shirtSubtotal = youthShirtSubtotal + adultShirtSubtotal
  const subtotal = ticketSubtotal + programSubtotal + shirtSubtotal

  const ticketDiscountedQty = promo?.appliesTo === 'tickets' ? Math.min(adultQty, promo.maxQty) : 0
  let discount = 0
  if (promo?.appliesTo === 'tickets') {
    discount = +(ticketDiscountedQty * TICKET_ADULT_PRICE * promo.rate).toFixed(2)
  } else if (promo?.appliesTo === 'all') {
    discount = +(subtotal * promo.rate).toFixed(2)
  }

  const total = Math.max(0, +(subtotal - discount).toFixed(2))

  const ticketCount = adultQty + childQty
  const shirtCount = sumQty(youthQty) + sumQty(adultSizeQty)
  const totalItemCount = ticketCount + programQty + shirtCount
  const hasItems = totalItemCount > 0

  const formValid = hasItems && name.trim() && email.includes('@') && ack

  // ── Sync refs ─────────────────────────────────────────────
  useEffect(() => {
    totalRef.current = total
    const youthLines = YOUTH_SIZES.filter((s) => youthQty[s] > 0).map((s) => `Youth ${s} ×${youthQty[s]}`)
    const adultLines = ADULT_SIZES.filter((s) => adultSizeQty[s] > 0).map((s) => `Adult ${s} ×${adultSizeQty[s]}`)
    const shirtLineItems = [...youthLines, ...adultLines].join(', ')
    formRef.current = {
      name, email,
      adultQty, childQty,
      programQty,
      youthQty, adultSizeQty,
      shirtLineItems,
      ticketSubtotal, programSubtotal, shirtSubtotal,
      subtotal, discount, total,
      promo,
    }
  })

  // ── Reset PayPal when total/items change ──────────────────
  function clearPaypal() {
    if (paypalRendered) {
      setPaypalRendered(false)
      const el = document.getElementById('pp-checkout')
      if (el) el.innerHTML = ''
    }
  }

  // ── Load PayPal SDK ───────────────────────────────────────
  useEffect(() => {
    const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID
    if (!clientId) return
    if (window.paypal) { setPaypalReady(true); return }
    const script = document.createElement('script')
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&disable-funding=card`
    script.async = true
    script.onload = () => setPaypalReady(true)
    script.onerror = () => console.error('Failed to load PayPal SDK')
    document.head.appendChild(script)
  }, [])

  // ── Render PayPal buttons ─────────────────────────────────
  useEffect(() => {
    if (!paypalReady || !formValid || paypalRendered || total <= 0) return
    const container = document.getElementById('pp-checkout')
    if (!container) return
    window.paypal.Buttons({
      style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'pay', height: 50 },
      createOrder: (_d, actions) => actions.order.create({
        purchase_units: [{
          description: 'Capital Core Dance Studio – Recital Order',
          amount: { value: totalRef.current.toFixed(2), currency_code: 'USD' },
        }],
      }),
      onApprove: async (_d, actions) => {
        const order = await actions.order.capture()
        await onPaymentSuccess(order)
      },
      onError: (err) => {
        console.error('PayPal error:', err)
        setErrorMsg('Payment could not be completed. Please try again or contact the studio.')
        setStatus('error')
      },
    }).render('#pp-checkout')
    setPaypalRendered(true)
  }, [paypalReady, formValid, paypalRendered, total])

  // ── Item adjusters ────────────────────────────────────────
  function inc(set, val, max = 50) {
    set((q) => Math.min(max, q + 1))
    clearPaypal()
  }
  function dec(set, val) {
    set((q) => Math.max(0, q - 1))
    clearPaypal()
  }
  function updateYouth(size, delta) {
    setYouthQty((prev) => ({ ...prev, [size]: Math.max(0, prev[size] + delta) }))
    clearPaypal()
  }
  function updateAdultShirt(size, delta) {
    setAdultSizeQty((prev) => ({ ...prev, [size]: Math.max(0, prev[size] + delta) }))
    clearPaypal()
  }

  // ── Promo apply ───────────────────────────────────────────
  function applyPromo() {
    const result = validatePromo(promoCode)
    if (result) {
      setPromo(result)
      setPromoError('')
      clearPaypal()
    } else {
      setPromo(null)
      setPromoError('Invalid code')
    }
  }
  function removePromo() {
    setPromo(null)
    setPromoCode('')
    setPromoError('')
    clearPaypal()
  }

  // ── Payment success ───────────────────────────────────────
  async function onPaymentSuccess(order) {
    setStatus('submitting')
    const fd = formRef.current

    const { error } = await supabase.from('recital_orders').insert([{
      contact_name: fd.name,
      email: fd.email,
      ticket_adult_qty: fd.adultQty,
      ticket_child_qty: fd.childQty,
      ticket_subtotal: fd.ticketSubtotal,
      program_qty: fd.programQty,
      program_subtotal: fd.programSubtotal,
      youth_shirt_sizes: fd.youthQty,
      adult_shirt_sizes: fd.adultSizeQty,
      shirt_line_items: fd.shirtLineItems,
      shirt_subtotal: fd.shirtSubtotal,
      subtotal: fd.subtotal,
      discount: fd.discount,
      promo_code: fd.promo?.code || null,
      total_amount: fd.total,
      paypal_order_id: order?.id || null,
      status: order ? 'paid' : 'free',
    }])
    if (error) console.error('DB error:', error)

    try {
      await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formType: 'recital_combined',
          name: fd.name,
          email: fd.email,
          adultQty: fd.adultQty,
          childQty: fd.childQty,
          programQty: fd.programQty,
          shirtLineItems: fd.shirtLineItems,
          ticketSubtotal: fd.ticketSubtotal,
          programSubtotal: fd.programSubtotal,
          shirtSubtotal: fd.shirtSubtotal,
          subtotal: fd.subtotal,
          discount: fd.discount,
          total: fd.total,
          promoCode: fd.promo?.code || null,
          paypalOrderId: order?.id || null,
          showLabel: SHOW_INFO.label,
          showDate: SHOW_INFO.date,
          showTime: SHOW_INFO.time,
          showVenue: SHOW_INFO.venue,
          showAddress: SHOW_INFO.address,
        }),
      })
    } catch (e) {
      console.error('Email notify error:', e)
    }

    navigate('/recitalshop/thankyou', {
      state: {
        name: fd.name,
        adultQty: fd.adultQty,
        childQty: fd.childQty,
        programQty: fd.programQty,
        shirtLineItems: fd.shirtLineItems,
        total: fd.total,
        showLabel: SHOW_INFO.label,
        showDate: SHOW_INFO.date,
        showTime: SHOW_INFO.time,
      },
    })
  }

  async function confirmFreeOrder() {
    await onPaymentSuccess(null)
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0B1F3A]">
      <style>{`
        .shop-playfair { font-family: 'Playfair Display', Georgia, serif; }
        @keyframes shop-tab-shimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .shop-tabbar {
          background: linear-gradient(135deg, #C9A84C 0%, #f4d97a 45%, #ffe89c 50%, #f4d97a 55%, #C9A84C 100%);
          background-size: 250% 250%;
          animation: shop-tab-shimmer 4s ease-in-out infinite;
          box-shadow: 0 4px 18px rgba(201,168,76,0.35), 0 1px 0 rgba(255,255,255,0.4) inset;
        }
        .shop-tab-text {
          color: #0B1F3A;
          text-shadow: 0 1px 0 rgba(255,255,255,0.45);
        }
      `}</style>
      <SEO
        title="Recital Tickets, Programs &amp; Shirts | Capital Core Dance Studio – Midlothian, VA"
        description="Buy tickets ($25 adult, free for children 3 &amp; under), pre-order show programs, and order official t-shirts for Capital Core Dance Studio's 2026 recital, A Night at the Cinema. Saturday, June 13, 2026 at Richmond Christian School."
        canonical="/recitalshop"
        jsonLd={SHOP_JSON_LD}
      />
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative py-12 px-6 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#080f1c] via-[#0d1828] to-[#0B1F3A]" />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 28px, rgba(201,168,76,1) 28px, rgba(201,168,76,1) 30px)' }}
          />
          <div className="relative z-10 max-w-2xl mx-auto">
            <Link to="/recital" className="inline-flex items-center gap-1.5 text-white/40 text-xs hover:text-white/70 transition-colors mb-3">
              ← Back to Recital Info
            </Link>
            <p className="text-[#C9A84C] text-xs font-bold tracking-[0.25em] uppercase mb-2">Annual Recital 2026</p>
            <h1 className="shop-playfair text-4xl md:text-5xl font-black text-white mb-2 leading-tight">Recital Shop</h1>
            <p className="text-white/50 italic text-sm tracking-widest">A Night at the Cinema</p>
            <div className="mt-5 inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-white/60 text-xs">
              <span>{SHOW_INFO.venue}</span>
              <span className="text-white/20">·</span>
              <span>{SHOW_INFO.address.split(',')[0]}</span>
            </div>
          </div>
        </section>

        {/* Sticky tab bar — shimmering gold */}
        <nav className="sticky top-0 z-40 shop-tabbar border-y border-[#0B1F3A]/25">
          <div className="max-w-3xl mx-auto px-6 flex justify-center gap-1 overflow-x-auto">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`shop-playfair shop-tab-text text-sm tracking-wide py-4 px-5 whitespace-nowrap transition-all border-b-2 ${
                  activeTab === t.id
                    ? 'font-black border-[#0B1F3A]'
                    : 'font-bold opacity-70 border-transparent hover:opacity-100 hover:border-[#0B1F3A]/40'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </nav>

        <div className="bg-white">
          <div className="max-w-3xl mx-auto px-6 py-12">

            {/* ── TICKETS TAB ───────────────────────────────── */}
            <section className={activeTab === 'tickets' ? '' : 'hidden'}>
              {/* Promo banner */}
              <div className="mb-6 -mx-2 sm:mx-0 rounded-xl overflow-hidden shadow-lg border border-[#C9A84C]/30">
                <img
                  src="/ticket-banner.png"
                  alt="A Night at the Cinema — Spring Show General Admission Ticket. Saturday June 13, 2026, 2:00 PM. Richmond Christian School, 6511 Belmont Rd, Chesterfield, VA 23832."
                  className="w-full h-auto block"
                />
              </div>

              <div className="mb-8">
                <p className="text-[#C9A84C] text-xs font-black tracking-[0.3em] uppercase mb-1">Reserve Your Seats</p>
                <h2 className="shop-playfair text-[#0B1F3A] text-3xl font-black leading-tight">Tickets</h2>
                <p className="text-gray-500 text-sm mt-1">General admission · Children 3 &amp; under are free</p>
              </div>

              {/* Show info card */}
              <div className="bg-[#fdf8f0] border border-[#C9A84C]/30 rounded-xl p-5 mb-6">
                <p className="text-[#C9A84C] text-[10px] font-black tracking-[0.3em] uppercase mb-1">{SHOW_INFO.label}</p>
                <p className="text-[#0B1F3A] font-black text-base leading-tight">{SHOW_INFO.date}</p>
                <p className="text-gray-600 text-sm mt-0.5">{SHOW_INFO.time}</p>
                <div className="mt-3 pt-3 border-t border-[#C9A84C]/20 text-xs text-gray-500">
                  {SHOW_INFO.venue} · {SHOW_INFO.address}
                </div>
              </div>

              {/* Quantities */}
              <div className="bg-gray-50 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#0B1F3A] font-bold text-sm">Adult Tickets</p>
                    <p className="text-gray-400 text-xs">{fmtPrice(TICKET_ADULT_PRICE)} each</p>
                  </div>
                  <Stepper qty={adultQty} onInc={() => inc(setAdultQty)} onDec={() => dec(setAdultQty)} />
                </div>
                <div className="border-t border-gray-200" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#0B1F3A] font-bold text-sm">Children (3 &amp; under)</p>
                    <p className="text-gray-400 text-xs">Free admission</p>
                  </div>
                  <Stepper qty={childQty} onInc={() => inc(setChildQty)} onDec={() => dec(setChildQty)} />
                </div>
              </div>
            </section>

            {/* ── PROGRAMS TAB ──────────────────────────────── */}
            <section className={activeTab === 'programs' ? '' : 'hidden'}>
              <div className="mb-8">
                <p className="text-[#C9A84C] text-xs font-black tracking-[0.3em] uppercase mb-1">Keepsake</p>
                <h2 className="shop-playfair text-[#0B1F3A] text-3xl font-black leading-tight">Show Programs</h2>
                <p className="text-gray-500 text-sm mt-1">Pre-order $10 · Day of show $15 · Pickup at the show</p>
              </div>

              <div className="bg-[#fdf8f0] border border-[#C9A84C]/25 rounded-xl p-6 mb-6">
                <p className="text-gray-700 text-sm leading-relaxed mb-3">
                  The official "A Night at the Cinema" program — featuring the full cast list, dance order,
                  and venue information for {SHOW_INFO.venue}.
                </p>
                <div className="flex items-center justify-between bg-white border border-[#C9A84C]/30 rounded-lg px-4 py-3">
                  <span className="text-[#0B1F3A] text-sm font-bold">
                    {isAfterShow ? 'Day-of pricing' : 'Pre-order pricing'}
                  </span>
                  <span className="text-[#C9A84C] font-black text-xl">{fmtPrice(PROGRAM_PRICE)} each</span>
                </div>
                {!isAfterShow && (
                  <p className="text-gray-500 text-xs mt-2 italic">
                    Pre-order pricing ends June 12, 2026. Programs purchased on or after the show date will be $15.
                  </p>
                )}
              </div>

              <div className="bg-gray-50 rounded-xl p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#0B1F3A] font-bold text-sm">Number of Programs</p>
                    <p className="text-gray-400 text-xs">{fmtPrice(PROGRAM_PRICE)} each</p>
                  </div>
                  <Stepper qty={programQty} onInc={() => inc(setProgramQty)} onDec={() => dec(setProgramQty)} />
                </div>
              </div>
            </section>

            {/* ── SHIRTS TAB ────────────────────────────────── */}
            <section className={activeTab === 'shirts' ? '' : 'hidden'}>
              <div className="mb-8">
                <p className="text-[#C9A84C] text-xs font-black tracking-[0.3em] uppercase mb-1">Official Merchandise</p>
                <h2 className="shop-playfair text-[#0B1F3A] text-3xl font-black leading-tight">Recital T-Shirts</h2>
                <p className="text-gray-500 text-sm mt-1">Made to order · Front print &amp; full cast list on back · Pickup at studio</p>
              </div>

              {/* Product cards */}
              <div className="grid md:grid-cols-2 gap-5 mb-6">
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                  <img src="/womens-shirt.png" alt="Youth Recital T-Shirt" className="w-full object-cover object-top" style={{ maxHeight: '280px' }} />
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="shop-playfair text-base font-bold text-[#0B1F3A]">Youth T-Shirt</h3>
                      <span className="text-[#C9A84C] font-black text-lg">{fmtPrice(YOUTH_PRICE)}</span>
                    </div>
                    <p className="text-gray-400 text-xs mb-3">Sizes: YS · YM · YL · YXL · YXXL</p>
                    <button onClick={() => setSizeChart('youth')} className="text-[#C9A84C] text-xs font-medium hover:text-[#d4b85a] transition-colors underline">
                      View Size Chart
                    </button>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                  <img src="/kids-shirt.png" alt="Adult Recital T-Shirt" className="w-full object-cover object-top" style={{ maxHeight: '280px' }} />
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="shop-playfair text-base font-bold text-[#0B1F3A]">Adult T-Shirt</h3>
                      <span className="text-[#C9A84C] font-black text-lg">{fmtPrice(ADULT_PRICE)}</span>
                    </div>
                    <p className="text-gray-400 text-xs mb-3">Sizes: S · M · L · XL · 2XL</p>
                    <button onClick={() => setSizeChart('adult')} className="text-[#C9A84C] text-xs font-medium hover:text-[#d4b85a] transition-colors underline">
                      View Size Chart
                    </button>
                  </div>
                </div>
              </div>

              {isAfterShow && (
                <div className="bg-amber-50 border border-amber-300 rounded-lg px-4 py-3 mb-6 text-amber-800 text-sm">
                  A 5% late-order adjustment has been applied (show date has passed).
                </div>
              )}

              {/* Sizes */}
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-3">
                  <h4 className="text-[#0B1F3A] font-bold text-sm uppercase tracking-wider">Youth Sizes</h4>
                  <span className="text-gray-400 text-xs">{fmtPrice(YOUTH_PRICE)} each</span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                  {YOUTH_SIZES.map((size) => (
                    <SizeControl key={size} size={size} qty={youthQty[size]} onInc={() => updateYouth(size, 1)} onDec={() => updateYouth(size, -1)} />
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-baseline gap-2 mb-3">
                  <h4 className="text-[#0B1F3A] font-bold text-sm uppercase tracking-wider">Adult Sizes</h4>
                  <span className="text-gray-400 text-xs">{fmtPrice(ADULT_PRICE)} each</span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                  {ADULT_SIZES.map((size) => (
                    <SizeControl key={size} size={size} qty={adultSizeQty[size]} onInc={() => updateAdultShirt(size, 1)} onDec={() => updateAdultShirt(size, -1)} />
                  ))}
                </div>
              </div>
            </section>

            {/* ── CART / CHECKOUT (always visible at bottom) ── */}
            <div className="mt-12 pt-10 border-t-2 border-dashed border-gray-200">
              {!hasItems ? (
                <div className="text-center py-10 px-6 bg-gray-50 rounded-xl">
                  <p className="shop-playfair text-[#0B1F3A] text-xl font-bold mb-2">Your cart is empty</p>
                  <p className="text-gray-500 text-sm">
                    Pick items from the tabs above (Tickets, Show Programs, T-Shirts) to start your order.
                  </p>
                </div>
              ) : (
                <>
                  {/* Order summary */}
                  <div className="mb-6">
                    <p className="text-[#C9A84C] text-xs font-black tracking-[0.3em] uppercase mb-3">Your Order</p>
                    <div className="bg-[#0B1F3A] border border-[#C9A84C]/30 rounded-xl p-6">
                      <div className="space-y-3 mb-4">
                        {(adultQty > 0 || childQty > 0) && (
                          <div>
                            <p className="text-[#C9A84C] text-[10px] font-black tracking-widest uppercase mb-1.5">Tickets — {SHOW_INFO.label}</p>
                            {adultQty > 0 && (
                              <div className="flex justify-between text-white/85 text-sm">
                                <span>{adultQty} Adult{adultQty !== 1 ? 's' : ''} × {fmtPrice(TICKET_ADULT_PRICE)}</span>
                                <span>{fmtPrice(ticketSubtotal)}</span>
                              </div>
                            )}
                            {childQty > 0 && (
                              <div className="flex justify-between text-white/85 text-sm">
                                <span>{childQty} Child{childQty !== 1 ? 'ren' : ''} (3 &amp; under)</span>
                                <span className="text-[#C9A84C]">FREE</span>
                              </div>
                            )}
                          </div>
                        )}

                        {programQty > 0 && (
                          <div>
                            <p className="text-[#C9A84C] text-[10px] font-black tracking-widest uppercase mb-1.5">Show Programs</p>
                            <div className="flex justify-between text-white/85 text-sm">
                              <span>{programQty} Program{programQty !== 1 ? 's' : ''} × {fmtPrice(PROGRAM_PRICE)}</span>
                              <span>{fmtPrice(programSubtotal)}</span>
                            </div>
                          </div>
                        )}

                        {shirtCount > 0 && (
                          <div>
                            <p className="text-[#C9A84C] text-[10px] font-black tracking-widest uppercase mb-1.5">T-Shirts</p>
                            {YOUTH_SIZES.filter((s) => youthQty[s] > 0).map((s) => (
                              <div key={`y-${s}`} className="flex justify-between text-white/85 text-sm">
                                <span>Youth {s} × {youthQty[s]}</span>
                                <span>{fmtPrice(youthQty[s] * YOUTH_PRICE)}</span>
                              </div>
                            ))}
                            {ADULT_SIZES.filter((s) => adultSizeQty[s] > 0).map((s) => (
                              <div key={`a-${s}`} className="flex justify-between text-white/85 text-sm">
                                <span>Adult {s} × {adultSizeQty[s]}</span>
                                <span>{fmtPrice(adultSizeQty[s] * ADULT_PRICE)}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Subtotal + discount + total */}
                      <div className="border-t border-white/10 pt-3 space-y-1.5 text-sm">
                        <div className="flex justify-between text-white/70">
                          <span>Subtotal</span>
                          <span>{fmtPrice(subtotal)}</span>
                        </div>
                        {promo && discount > 0 && (
                          <div className="flex justify-between text-green-300">
                            <span>
                              {promo.code}
                              {promo.appliesTo === 'tickets' && ` (${Math.round(promo.rate * 100)}% off ${ticketDiscountedQty} of ${adultQty})`}
                              {promo.appliesTo === 'all' && ` (${Math.round(promo.rate * 100)}% off order)`}
                            </span>
                            <span>−{fmtPrice(discount)}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center pt-2 border-t border-white/10 mt-2">
                          <span className="text-white font-bold">Total</span>
                          <span className="text-[#C9A84C] text-2xl font-black">{fmtPrice(total)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Promo code */}
                  <div className="mb-6">
                    <p className="text-[#0B1F3A] text-sm font-bold mb-2">Promo Code</p>
                    {promo ? (
                      <div className="bg-green-50 border border-green-300 rounded-lg px-4 py-3 flex justify-between items-center">
                        <div>
                          <p className="text-green-800 font-bold text-sm">Code applied: {promo.code}</p>
                          <p className="text-green-700 text-xs">{promo.label}</p>
                        </div>
                        <button onClick={removePromo} className="text-green-800 hover:text-green-900 text-xs font-bold underline">Remove</button>
                      </div>
                    ) : (
                      <>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), applyPromo())}
                            placeholder="Promo code (optional)"
                            className="flex-1 bg-white border border-gray-300 text-gray-900 rounded-lg px-4 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]/30 uppercase"
                          />
                          <button
                            type="button"
                            onClick={applyPromo}
                            disabled={!promoCode.trim()}
                            className="bg-[#0B1F3A] text-white text-sm font-bold px-5 rounded-lg hover:bg-[#1a3055] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          >
                            Apply
                          </button>
                        </div>
                        {promoError && <p className="text-red-500 text-xs mt-1">{promoError}</p>}
                      </>
                    )}
                  </div>

                  {/* Contact */}
                  <div className="mb-6">
                    <p className="text-[#0B1F3A] text-sm font-bold mb-2">Contact Information</p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-gray-600 text-xs font-medium" htmlFor="contact-name">
                          Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Full name"
                          className="bg-white border border-gray-300 text-gray-900 rounded-lg px-4 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]/30"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-gray-600 text-xs font-medium" htmlFor="contact-email">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="bg-white border border-gray-300 text-gray-900 rounded-lg px-4 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]/30"
                        />
                      </div>
                    </div>
                    <p className="text-gray-400 text-xs mt-2 italic">Your confirmation will be emailed here. Save it — you'll show it at the door for tickets.</p>
                  </div>

                  {/* Ack */}
                  <div className="mb-6">
                    <label className="flex gap-3 cursor-pointer group">
                      <div className="relative mt-0.5 flex-shrink-0">
                        <input type="checkbox" checked={ack} onChange={(e) => { setAck(e.target.checked); clearPaypal() }} className="sr-only" />
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${ack ? 'bg-[#C9A84C] border-[#C9A84C]' : 'border-gray-300 bg-transparent group-hover:border-gray-500'}`}>
                          {ack && (
                            <svg viewBox="0 0 12 10" className="w-3 h-3" fill="none">
                              <path d="M1 5l3.5 3.5L11 1" stroke="#0B1F3A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <span className="text-gray-500 text-sm leading-relaxed">
                        I have reviewed my order. All purchases are final and non-refundable.
                        {shirtCount > 0 && ' Shirts are made to order and will be available for pickup at the studio.'}
                        {programQty > 0 && ' Programs will be available for pickup at the show.'}
                        {ticketCount > 0 && ' Tickets are general admission — show your confirmation email at the door.'}
                      </span>
                    </label>
                  </div>

                  {/* Checkout */}
                  <div className="bg-[#0B1F3A] border border-[#C9A84C]/25 rounded-xl p-6">
                    {!formValid && (
                      <p className="text-white/70 text-sm text-center py-3">
                        {!name.trim() || !email.includes('@')
                          ? 'Please fill in your name and email above.'
                          : 'Please check the acknowledgement above.'}
                      </p>
                    )}

                    {formValid && (
                      <div>
                        {status === 'submitting' && <div className="text-center py-3 text-white text-sm">Processing your order…</div>}
                        {status === 'error' && <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-3 mb-3 text-red-300 text-sm">{errorMsg}</div>}
                        {!import.meta.env.VITE_PAYPAL_CLIENT_ID && (
                          <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-4 mb-3 text-yellow-300 text-sm text-center">
                            PayPal is not configured yet. Add <code className="font-mono">VITE_PAYPAL_CLIENT_ID</code> to your .env file.
                          </div>
                        )}
                        {total > 0 ? (
                          <div className="bg-white rounded-lg p-4">
                            <div id="pp-checkout" className="min-h-[50px]" />
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={confirmFreeOrder}
                            disabled={status === 'submitting'}
                            className="w-full bg-[#C9A84C] text-[#0B1F3A] font-black py-3.5 rounded-lg hover:bg-[#d4b85a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm tracking-widest uppercase"
                          >
                            Confirm Free Order
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

          </div>
        </div>
      </main>

      <Footer />

      {/* Size chart modal */}
      {sizeChart && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setSizeChart(null)}>
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 sticky top-0 bg-white">
              <h3 className="font-bold text-gray-900 text-lg">{sizeChart === 'youth' ? 'Youth Size Chart' : 'Adult Size Chart'}</h3>
              <button onClick={() => setSizeChart(null)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors text-xl leading-none">×</button>
            </div>
            <div className="p-4">
              <img src={sizeChart === 'youth' ? '/kids-size-chart.png' : '/adult-size-chart.png'} alt={sizeChart === 'youth' ? 'Youth Size Chart' : 'Adult Size Chart'} className="w-full rounded-lg" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
