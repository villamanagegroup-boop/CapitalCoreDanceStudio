import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import { supabase } from '../lib/supabase'

const YOUTH_SIZES = ['YS', 'YM', 'YL', 'YXL', 'YXXL']
const ADULT_SIZES = ['S', 'M', 'L', 'XL', '2XL']
const SHOW_DATE = new Date('2026-06-12T00:00:00')
const isAfterShow = new Date() >= SHOW_DATE
const YOUTH_PRICE = isAfterShow ? Math.round(20 * 1.05 * 100) / 100 : 20
const ADULT_PRICE = isAfterShow ? Math.round(25 * 1.05 * 100) / 100 : 25

function fmtPrice(n) {
  return n % 1 === 0 ? `$${n}` : `$${n.toFixed(2)}`
}

const initQty = (sizes) => Object.fromEntries(sizes.map((s) => [s, 0]))

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
        >
          −
        </button>
        <span className="text-[#0B1F3A] font-bold w-5 text-center text-sm tabular-nums">{qty}</span>
        <button
          type="button"
          onClick={onInc}
          className="w-7 h-7 rounded-md bg-[#0B1F3A] text-white flex items-center justify-center hover:bg-[#1a3055] transition-colors text-base leading-none"
        >
          +
        </button>
      </div>
    </div>
  )
}

export default function RecitalShirts() {
  const navigate = useNavigate()
  const [youthQty, setYouthQty] = useState(initQty(YOUTH_SIZES))
  const [adultQty, setAdultQty] = useState(initQty(ADULT_SIZES))
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [ack, setAck] = useState(false)
  const [paypalReady, setPaypalReady] = useState(false)
  const [paypalRendered, setPaypalRendered] = useState(false)
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState('')
  const [sizeChart, setSizeChart] = useState(null) // null | 'youth' | 'adult'

  const totalRef = useRef(0)
  const formDataRef = useRef({})

  const youthSubtotal = YOUTH_SIZES.reduce((sum, s) => sum + youthQty[s] * YOUTH_PRICE, 0)
  const adultSubtotal = ADULT_SIZES.reduce((sum, s) => sum + adultQty[s] * ADULT_PRICE, 0)
  const total = youthSubtotal + adultSubtotal
  const hasItems = total > 0
  const formValid = hasItems && name.trim().length > 0 && email.trim().includes('@') && ack

  // Keep refs in sync with latest values for PayPal callbacks
  useEffect(() => {
    totalRef.current = total
    formDataRef.current = { name, email, youthQty, adultQty, total }
  })

  // Load PayPal JS SDK once
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

  // Render PayPal buttons when SDK is ready and form is valid
  useEffect(() => {
    if (!paypalReady || !formValid || paypalRendered) return
    const container = document.getElementById('paypal-btn')
    if (!container) return

    window.paypal
      .Buttons({
        style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'pay', height: 50 },
        createOrder: (_data, actions) =>
          actions.order.create({
            purchase_units: [
              {
                description: 'Capital Core Dance Studio – Recital T-Shirt Order',
                amount: { value: totalRef.current.toFixed(2), currency_code: 'USD' },
              },
            ],
          }),
        onApprove: async (_data, actions) => {
          const order = await actions.order.capture()
          await onPaymentSuccess(order)
        },
        onError: (err) => {
          console.error('PayPal error:', err)
          setErrorMsg(
            'Payment could not be completed. Please try again or contact the studio at (804) 234-4014.',
          )
          setStatus('error')
        },
      })
      .render('#paypal-btn')

    setPaypalRendered(true)
  }, [paypalReady, formValid, paypalRendered])

  function clearPaypal() {
    if (paypalRendered) {
      setPaypalRendered(false)
      const el = document.getElementById('paypal-btn')
      if (el) el.innerHTML = ''
    }
  }

  function updateYouth(size, delta) {
    setYouthQty((prev) => ({ ...prev, [size]: Math.max(0, prev[size] + delta) }))
    clearPaypal()
  }

  function updateAdult(size, delta) {
    setAdultQty((prev) => ({ ...prev, [size]: Math.max(0, prev[size] + delta) }))
    clearPaypal()
  }

  async function onPaymentSuccess(order) {
    setStatus('submitting')
    const fd = formDataRef.current

    const youthItems = YOUTH_SIZES.filter((s) => fd.youthQty[s] > 0).map(
      (s) => `Youth ${s} ×${fd.youthQty[s]}`,
    )
    const adultItems = ADULT_SIZES.filter((s) => fd.adultQty[s] > 0).map(
      (s) => `Adult ${s} ×${fd.adultQty[s]}`,
    )
    const lineItems = [...youthItems, ...adultItems].join(', ')

    const { error } = await supabase.from('recital_shirt_orders').insert([
      {
        contact_name: fd.name,
        email: fd.email,
        youth_sizes: fd.youthQty,
        adult_sizes: fd.adultQty,
        total_amount: fd.total,
        paypal_order_id: order.id,
        line_items: lineItems,
        status: 'paid',
      },
    ])
    if (error) console.error('DB error:', error)

    try {
      await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formType: 'recital_order',
          name: fd.name,
          email: fd.email,
          lineItems,
          total: fd.total,
          paypalOrderId: order.id,
        }),
      })
    } catch (e) {
      console.error('Email notify error:', e)
    }

    navigate('/recital/shirts/thankyou', { state: { name: fd.name } })
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0B1F3A]">
      <style>{`
        .shirt-playfair { font-family: 'Playfair Display', Georgia, serif; }
      `}</style>
      <SEO
        title="Recital T-Shirt Order – Capital Core Dance Studio"
        description="Order your official 'A Night at the Cinema' recital t-shirt. Youth $20, Adult $25. Made to order for Capital Core Dance Studio's 2026 recital."
        canonical="/recitalshop"
        noindex
      />
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative py-16 px-6 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#080f1c] via-[#0d1828] to-[#0B1F3A]" />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, transparent, transparent 28px, rgba(201,168,76,1) 28px, rgba(201,168,76,1) 30px)',
            }}
          />
          <div className="relative z-10 max-w-2xl mx-auto">
            <p className="text-[#C9A84C] text-xs font-bold tracking-[0.25em] uppercase mb-4">
              Annual Recital 2026
            </p>
            <h1 className="shirt-playfair text-4xl md:text-5xl font-black text-white mb-3 leading-tight">
              Official Recital
              <br />
              <span className="text-[#C9A84C]">T-Shirt Order</span>
            </h1>
            <p className="text-white/50 italic text-sm tracking-widest">✦ A Night at the Cinema ✦</p>
          </div>
        </section>

        <div className="bg-white">
        <section className="max-w-4xl mx-auto px-6 py-12 space-y-6">
          {/* Two shirt product cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Youth shirt */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-white overflow-hidden">
                <img
                  src="/womens-shirt.png"
                  alt="Youth Recital T-Shirt"
                  className="w-full object-cover object-top"
                  style={{ maxHeight: '320px' }}
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="shirt-playfair text-lg font-bold text-[#0B1F3A]">Youth T-Shirt</h3>
                  <span className="text-[#C9A84C] font-black text-xl">{fmtPrice(YOUTH_PRICE)}</span>
                </div>
                <p className="text-gray-400 text-xs mb-4">Sizes: YS · YM · YL · YXL · YXXL</p>
                <button
                  onClick={() => setSizeChart('youth')}
                  className="inline-flex items-center gap-1.5 text-[#C9A84C] text-sm font-medium hover:text-[#d4b85a] transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  View Size Chart
                </button>
              </div>
            </div>

            {/* Adult shirt */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-white overflow-hidden">
                <img
                  src="/kids-shirt.png"
                  alt="Adult Recital T-Shirt"
                  className="w-full object-cover object-top"
                  style={{ maxHeight: '320px' }}
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="shirt-playfair text-lg font-bold text-[#0B1F3A]">Adult T-Shirt</h3>
                  <span className="text-[#C9A84C] font-black text-xl">{fmtPrice(ADULT_PRICE)}</span>
                </div>
                <p className="text-gray-400 text-xs mb-4">Sizes: S · M · L · XL · 2XL</p>
                <button
                  onClick={() => setSizeChart('adult')}
                  className="inline-flex items-center gap-1.5 text-[#C9A84C] text-sm font-medium hover:text-[#d4b85a] transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  View Size Chart
                </button>
              </div>
            </div>
          </div>

          {/* Description + policy */}
          <div className="bg-[#fdf8f0] border border-[#C9A84C]/25 rounded-2xl p-6">
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Celebrate this year's recital with our official shirt! Each shirt features our
              beautiful "A Night at the Cinema" design on the front and a full cast list on the
              back — a special keepsake for dancers and families.
            </p>
            <div className="bg-[#C9A84C]/10 border border-[#C9A84C]/30 rounded-lg p-4 text-xs text-gray-600 leading-relaxed">
              All shirts are made to order. Shirts purchased on or after the show date
              (June 12, 2026) will reflect a 5% late-order price adjustment.
            </div>
          </div>

          {/* Order form */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <h3 className="shirt-playfair text-xl font-bold text-[#0B1F3A] mb-5">Place Your Order</h3>

            {isAfterShow && (
              <div className="bg-amber-50 border border-amber-300 rounded-lg px-4 py-3 mb-6 text-amber-800 text-sm">
                A 5% late-order adjustment has been applied to all prices (show date has passed).
              </div>
            )}

            {/* Youth sizes */}
            <div className="mb-8">
              <div className="flex items-baseline gap-2 mb-4">
                <h4 className="text-[#0B1F3A] font-bold text-sm uppercase tracking-wider">
                  Youth Sizes
                </h4>
                <span className="text-gray-400 text-xs">{fmtPrice(YOUTH_PRICE)} each</span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {YOUTH_SIZES.map((size) => (
                  <SizeControl
                    key={size}
                    size={size}
                    qty={youthQty[size]}
                    onInc={() => updateYouth(size, 1)}
                    onDec={() => updateYouth(size, -1)}
                  />
                ))}
              </div>
            </div>

            {/* Adult sizes */}
            <div className="mb-8">
              <div className="flex items-baseline gap-2 mb-4">
                <h4 className="text-[#0B1F3A] font-bold text-sm uppercase tracking-wider">
                  Adult Sizes
                </h4>
                <span className="text-gray-400 text-xs">{fmtPrice(ADULT_PRICE)} each</span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {ADULT_SIZES.map((size) => (
                  <SizeControl
                    key={size}
                    size={size}
                    qty={adultQty[size]}
                    onInc={() => updateAdult(size, 1)}
                    onDec={() => updateAdult(size, -1)}
                  />
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              <div className="flex flex-col gap-1.5">
                <label className="text-gray-600 text-sm font-medium" htmlFor="shirt-name">
                  Contact Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="shirt-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                  className="bg-white border border-gray-300 text-gray-900 rounded-lg px-4 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]/30 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-gray-600 text-sm font-medium" htmlFor="shirt-email">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="shirt-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="bg-white border border-gray-300 text-gray-900 rounded-lg px-4 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]/30 transition-colors"
                />
              </div>
            </div>

            {/* Acknowledgement */}
            <label className="flex gap-3 cursor-pointer group">
              <div className="relative mt-0.5 flex-shrink-0">
                <input
                  type="checkbox"
                  checked={ack}
                  onChange={(e) => {
                    setAck(e.target.checked)
                    clearPaypal()
                  }}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                    ack
                      ? 'bg-[#C9A84C] border-[#C9A84C]'
                      : 'border-gray-300 bg-transparent group-hover:border-gray-500'
                  }`}
                >
                  {ack && (
                    <svg viewBox="0 0 12 10" className="w-3 h-3" fill="none">
                      <path
                        d="M1 5l3.5 3.5L11 1"
                        stroke="#0B1F3A"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-gray-500 text-sm leading-relaxed">
                By submitting this order, I confirm that I have reviewed my order for accuracy,
                including sizes and quantities. I understand that all shirts are custom-made and
                orders are final and non-refundable once payment is made. I acknowledge that shirts
                will be distributed prior to the recital once production is complete.
              </span>
            </label>
          </div>

          {/* Order summary + payment */}
          {hasItems && (
            <div className="bg-[#0B1F3A] border border-[#C9A84C]/25 rounded-2xl p-8">
              <h3 className="shirt-playfair text-xl font-bold text-white mb-6">Order Summary</h3>

              <div className="space-y-2 mb-6">
                {YOUTH_SIZES.filter((s) => youthQty[s] > 0).map((s) => (
                  <div key={s} className="flex justify-between text-sm">
                    <span className="text-white">
                      Youth {s} × {youthQty[s]}
                    </span>
                    <span className="text-white font-medium">{fmtPrice(youthQty[s] * YOUTH_PRICE)}</span>
                  </div>
                ))}
                {ADULT_SIZES.filter((s) => adultQty[s] > 0).map((s) => (
                  <div key={s} className="flex justify-between text-sm">
                    <span className="text-white">
                      Adult {s} × {adultQty[s]}
                    </span>
                    <span className="text-white font-medium">{fmtPrice(adultQty[s] * ADULT_PRICE)}</span>
                  </div>
                ))}
                <div className="border-t border-white/10 pt-3 mt-3 flex justify-between items-center">
                  <span className="text-white font-semibold">Total Due</span>
                  <span className="text-[#C9A84C] text-2xl font-black">{fmtPrice(total)}</span>
                </div>
              </div>

              {!formValid && (
                <p className="text-white/80 text-sm text-center py-3">
                  {!name.trim() || !email.trim().includes('@')
                    ? 'Please fill in your name and email above to continue.'
                    : 'Please check the acknowledgement above to continue.'}
                </p>
              )}

              {formValid && (
                <div>
                  {status === 'submitting' && (
                    <div className="text-center py-4 text-white text-sm">
                      Processing your order…
                    </div>
                  )}
                  {status === 'error' && (
                    <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4 mb-4 text-red-300 text-sm">
                      {errorMsg}
                    </div>
                  )}
                  {!import.meta.env.VITE_PAYPAL_CLIENT_ID && (
                    <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-4 text-yellow-300 text-sm text-center">
                      PayPal is not configured yet. Add{' '}
                      <code className="font-mono">VITE_PAYPAL_CLIENT_ID</code> to your .env file.
                    </div>
                  )}
                  <div className="bg-white rounded-xl p-4 mt-2">
                    <div id="paypal-btn" className="min-h-[50px]" />
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
        </div>
      </main>

      <Footer />

      {/* Size chart modal */}
      {sizeChart && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setSizeChart(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 sticky top-0 bg-white">
              <h3 className="font-bold text-gray-900 text-lg">
                {sizeChart === 'youth' ? 'Youth Size Chart' : 'Adult Size Chart'}
              </h3>
              <button
                onClick={() => setSizeChart(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors text-xl leading-none"
              >
                ×
              </button>
            </div>
            <div className="p-4">
              <img
                src={sizeChart === 'youth' ? '/kids-size-chart.png' : '/adult-size-chart.png'}
                alt={sizeChart === 'youth' ? 'Youth Size Chart' : 'Adult Size Chart'}
                className="w-full rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
