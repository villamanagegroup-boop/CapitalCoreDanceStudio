import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import { supabase } from '../lib/supabase'
import { dateLabel } from '../lib/adultSeries'

export default function AdultSeriesPayment() {
  const navigate = useNavigate()
  const { state } = useLocation()

  const registrationId = state?.registrationId || null
  const name = state?.name || ''
  const email = state?.email || ''
  const registrationType = state?.registrationType || 'pass'
  const typeLabel = state?.typeLabel || (registrationType === 'pass' ? 'Summer Series Pass' : 'Drop-In')
  const dropInDate = state?.dropInDate || null
  const amountDueToday = Number(state?.amountDueToday || 0)
  const promoCode = state?.promoCode || null
  const discountAmount = Number(state?.discountAmount || 0)
  const isFree = amountDueToday <= 0 && promoCode

  const firstName = name ? name.split(' ')[0] : ''
  const isPass = registrationType === 'pass'

  const productDescription = isPass
    ? 'Capital Core Dance Studio – Adult Summer Series Pass'
    : `Capital Core Dance Studio – Adult Summer Series Drop-In${dropInDate ? ` (${dateLabel(dropInDate)})` : ''}`

  const [paypalReady, setPaypalReady] = useState(false)
  const [paypalRendered, setPaypalRendered] = useState(false)
  const [status, setStatus] = useState('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const dataRef = useRef({})
  useEffect(() => {
    dataRef.current = {
      registrationId, name, email, registrationType, typeLabel,
      dropInDate, amountDueToday, promoCode, discountAmount,
    }
  })

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

  useEffect(() => {
    if (!paypalReady || paypalRendered || amountDueToday <= 0) return
    const container = document.getElementById('pp-adult-series')
    if (!container) return
    window.paypal.Buttons({
      style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'pay', height: 50 },
      createOrder: (_d, actions) => actions.order.create({
        purchase_units: [{
          description: productDescription,
          amount: { value: amountDueToday.toFixed(2), currency_code: 'USD' },
        }],
      }),
      onApprove: async (_d, actions) => {
        const order = await actions.order.capture()
        await onPaymentSuccess(order)
      },
      onError: (err) => {
        console.error('PayPal error:', err)
        setErrorMsg('Payment could not be completed. Please try again or contact the studio at (804) 234-4014.')
        setStatus('error')
      },
    }).render('#pp-adult-series')
    setPaypalRendered(true)
  }, [paypalReady, paypalRendered, amountDueToday, productDescription])

  async function onPaymentSuccess(order) {
    setStatus('submitting')
    const d = dataRef.current

    if (d.registrationId) {
      try {
        const { error } = await supabase
          .from('adult_series_registrations')
          .update({
            paypal_order_id: order?.id || null,
            payment_received: true,
            amount_paid: d.amountDueToday,
            payment_received_at: new Date().toISOString(),
          })
          .eq('id', d.registrationId)
        if (error) console.error('DB update (non-fatal):', error)
      } catch (e) {
        console.error('DB update exception (non-fatal):', e)
      }
    }

    try {
      await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formType: 'adult_series_payment',
          name: d.name,
          email: d.email,
          registrationType: d.registrationType,
          typeLabel: d.typeLabel,
          dropInDate: d.dropInDate ? dateLabel(d.dropInDate) : null,
          amountPaid: d.amountDueToday,
          paypalOrderId: order?.id || null,
          registrationId: d.registrationId,
          promoCode: d.promoCode || null,
          discountAmount: d.discountAmount || 0,
        }),
      })
    } catch (e) {
      console.error('Notify error (non-fatal):', e)
    }

    navigate('/adult-summer-series/thankyou', {
      state: {
        name: d.name,
        email: d.email,
        registrationType: d.registrationType,
        typeLabel: d.typeLabel,
        dropInDate: d.dropInDate,
        amountPaid: d.amountDueToday,
        promoCode: d.promoCode,
        isFree,
      },
    })
  }

  async function confirmFree() {
    setStatus('submitting')
    await onPaymentSuccess({ id: null })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Adult Summer Series Payment | Capital Core Dance Studio"
        description="Complete your Adult Summer Series registration."
        canonical="/adult-summer-series/payment"
        noindex
      />
      <Navbar />

      <section className="bg-white flex-1 px-6 py-12">
        <div className="max-w-md mx-auto flex flex-col gap-5">

          <div className="bg-[#f0faf5] border border-[#b5e0c8] rounded-lg px-5 py-5 text-center">
            <p className="text-navy-dark font-black text-base mb-1">
              {firstName ? `Almost there, ${firstName}!` : 'Almost there!'}
            </p>
            <p className="text-[#3a4a6a] text-sm leading-relaxed">
              {isFree
                ? 'Confirm your spot below — no payment needed.'
                : `Pay below to lock in your ${isPass ? 'Summer Series Pass' : 'drop-in'}.`}
            </p>
          </div>

          <div className={`rounded-lg px-6 py-6 ${isFree ? 'bg-[#fdf8ec] border border-[#e8d8a8]' : 'bg-[#fff5f8] border border-[#f4c8d4]'}`}>
            <p className={`text-xs font-bold tracking-[0.3em] uppercase mb-2 ${isFree ? 'text-[#b88820]' : 'text-brand-red'}`}>
              {isFree ? 'Confirm' : isPass ? 'Summer Series Pass' : 'Reserve Your Spot'}
            </p>
            <h2 className="text-navy-dark text-xl font-black mb-2">
              {isFree ? 'Confirm your spot' : `Pay your $${amountDueToday}`}
            </h2>
            <p className="text-[#5a6a8a] text-sm leading-relaxed mb-5">
              {isFree
                ? `Promo code ${promoCode} applied. The studio will confirm your spot within 1–2 business days.`
                : isPass
                  ? 'Your pass covers all six Monday classes (June 29 – Aug 3). Non-refundable.'
                  : 'Drop-in fees are non-refundable and subject to availability.'}
            </p>

            {/* Order summary */}
            <div className={`bg-white rounded-lg border px-4 py-3 mb-4 ${isFree ? 'border-[#e8d8a8]' : 'border-[#f4c8d4]'}`}>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-[#5a6a8a]">{typeLabel}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[#0a7c3e]">Promo discount{promoCode ? ` (${promoCode})` : ''}</span>
                  <span className="font-semibold text-[#0a7c3e]">−${discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-2 border-t border-surface-border">
                <div>
                  <p className="text-navy-dark font-bold text-sm">Due today</p>
                  <p className="text-[#8a9aaa] text-xs">Non-refundable</p>
                </div>
                <span className="text-navy-dark font-black text-2xl">${amountDueToday}</span>
              </div>
            </div>

            {status === 'submitting' && (
              <div className="text-center py-3 text-navy-dark text-sm">{isFree ? 'Confirming your spot…' : 'Processing your payment…'}</div>
            )}
            {status === 'error' && (
              <div className="bg-red-50 border border-red-300 rounded-lg p-3 mb-3 text-red-700 text-sm">{errorMsg}</div>
            )}

            {isFree ? (
              <button
                type="button"
                onClick={confirmFree}
                disabled={status === 'submitting'}
                className="w-full bg-[#b88820] text-white font-black py-3 rounded-md hover:bg-[#8a6a1a] transition-colors disabled:opacity-60 disabled:cursor-not-allowed tracking-wide"
              >
                Confirm My Spot →
              </button>
            ) : (
              <>
                {!import.meta.env.VITE_PAYPAL_CLIENT_ID && (
                  <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3 mb-3 text-yellow-800 text-sm text-center">
                    PayPal is not configured yet. Please contact the studio to complete payment.
                  </div>
                )}
                <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
                  <div id="pp-adult-series" className="min-h-[50px]" />
                </div>
              </>
            )}

            <Link to="/adult-summer-series" className="block w-full text-center text-[#5a6a8a] text-sm hover:text-navy-dark underline">
              {isFree ? 'Back to Adult Summer Series' : 'I\'ll pay later — back to Adult Summer Series'}
            </Link>
          </div>

          <p className="text-[#8a9aaa] text-xs text-center">
            Questions? Call us at <a href="tel:8042344014" className="underline hover:text-navy-dark">(804) 234-4014</a>{' '}
            or email <a href="mailto:info@capitalcoredance.com" className="underline hover:text-navy-dark">info@capitalcoredance.com</a>.
          </p>

        </div>
      </section>

      <Footer />
    </div>
  )
}
