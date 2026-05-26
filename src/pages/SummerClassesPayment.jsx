import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import { supabase } from '../lib/supabase'

export default function SummerClassesPayment() {
  const navigate = useNavigate()
  const { state } = useLocation()

  const registrationId = state?.registrationId || null
  const parentName = state?.parentName || ''
  const parentEmail = state?.email || ''
  const dancers = state?.dancers || []
  const dancerCount = Number(state?.dancerCount || dancers.length || 1)
  const items = state?.items || []
  const tuitionTotal = Number(state?.tuitionTotal || 0)
  const paymentChoice = state?.paymentChoice || 'deposit'
  const amountDueToday = Number(state?.amountDueToday || 0)
  const balanceDue = Number(state?.balanceDue || 0)
  const promoCode = state?.promoCode || null
  const promoLabel = state?.promoLabel || null
  const discountAmount = Number(state?.discountAmount || 0)
  const isFreeTrial = amountDueToday <= 0 && promoCode

  const firstName = parentName ? parentName.split(' ')[0] : ''
  const dancerListLabel = dancers.length
    ? dancers.map((d) => d.name || 'Dancer').join(' & ')
    : ''

  const allDropIn = dancers.length > 0 && dancers.every((d) => d.signupType === 'drop_in')
  const isFullPayment = paymentChoice === 'full' || allDropIn

  const productDescription = (() => {
    if (allDropIn) return 'Capital Core Dance Studio – Summer Class Drop-In'
    if (isFullPayment) return `Capital Core Dance Studio – Summer Classes (Full · ${dancerCount} dancer${dancerCount !== 1 ? 's' : ''})`
    return `Capital Core Dance Studio – Summer Class Deposit (${dancerCount} dancer${dancerCount !== 1 ? 's' : ''})`
  })()

  const headlinePrimary = (() => {
    if (allDropIn) return `Pay your $${amountDueToday} drop-in fee${dancerCount > 1 ? `s` : ''}`
    if (isFullPayment) return `Pay $${amountDueToday} for the summer`
    return `Pay your $${amountDueToday} deposit`
  })()

  const [paypalReady, setPaypalReady] = useState(false)
  const [paypalRendered, setPaypalRendered] = useState(false)
  const [status, setStatus] = useState('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const dataRef = useRef({})
  useEffect(() => {
    dataRef.current = {
      registrationId, parentName, parentEmail, dancers, dancerCount,
      items, tuitionTotal, paymentChoice, amountDueToday, balanceDue,
      promoCode, promoLabel, discountAmount,
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
    const container = document.getElementById('pp-summer-classes')
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
    }).render('#pp-summer-classes')
    setPaypalRendered(true)
  }, [paypalReady, paypalRendered, amountDueToday, productDescription])

  async function onPaymentSuccess(order) {
    setStatus('submitting')
    const d = dataRef.current

    if (d.registrationId) {
      try {
        const { error } = await supabase
          .from('summer_class_registrations')
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
          formType: 'summer_class_deposit',
          parentName: d.parentName,
          email: d.parentEmail,
          dancers: d.dancers,
          dancerCount: d.dancerCount,
          items: d.items,
          tuitionTotal: d.tuitionTotal,
          paymentChoice: d.paymentChoice,
          amountPaid: d.amountDueToday,
          balanceDue: d.balanceDue,
          paypalOrderId: order?.id || null,
          registrationId: d.registrationId,
          promoCode: d.promoCode || null,
          promoLabel: d.promoLabel || null,
          discountAmount: d.discountAmount || 0,
        }),
      })
    } catch (e) {
      console.error('Notify error (non-fatal):', e)
    }

    navigate('/summer-classes/thankyou', {
      state: {
        name: d.parentName,
        email: d.parentEmail,
        dancers: d.dancers,
        dancerCount: d.dancerCount,
        allDropIn,
        tuitionTotal: d.tuitionTotal,
        amountPaid: d.amountDueToday,
        balanceDue: d.balanceDue,
        promoCode: d.promoCode,
        isFreeTrial,
      },
    })
  }

  async function confirmFreeTrial() {
    setStatus('submitting')
    await onPaymentSuccess({ id: null })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Summer Class Payment | Capital Core Dance Studio"
        description="Complete your summer dance class registration."
        canonical="/summer-classes/payment"
        noindex
      />
      <Navbar />

      <section className="bg-white flex-1 px-6 py-12">
        <div className="max-w-md mx-auto flex flex-col gap-5">

          <div className="bg-[#f0faf5] border border-[#b5e0c8] rounded-lg px-5 py-5 text-center">
            <p className="text-navy-dark font-black text-base mb-1">
              {firstName ? `Registration received, ${firstName}!` : 'Registration received!'}
            </p>
            <p className="text-[#3a4a6a] text-sm leading-relaxed">
              {isFreeTrial
                ? `Confirm ${dancerListLabel ? `${dancerListLabel}'s` : 'your'} free trial below — no payment needed.`
                : allDropIn
                  ? `Confirm ${dancerCount > 1 ? 'these drop-ins' : 'this drop-in'} by paying the $${amountDueToday} fee below.`
                  : `Pay below to lock in ${dancerListLabel ? `${dancerListLabel}'s` : 'your'} summer class spot${dancerCount > 1 ? 's' : ''}.`}
            </p>
          </div>

          <div className={`rounded-lg px-6 py-6 ${isFreeTrial ? 'bg-[#fdf8ec] border border-[#e8d8a8]' : 'bg-[#fff5f8] border border-[#f4c8d4]'}`}>
            <p className={`text-xs font-bold tracking-[0.3em] uppercase mb-2 ${isFreeTrial ? 'text-[#b88820]' : 'text-brand-red'}`}>
              {isFreeTrial
                ? 'Free Trial'
                : allDropIn ? 'Confirm Drop-In' : isFullPayment ? 'Pay In Full' : `Reserve Your Spot${dancerCount > 1 ? 's' : ''}`}
            </p>
            <h2 className="text-navy-dark text-xl font-black mb-2">
              {isFreeTrial ? 'Confirm your free trial' : headlinePrimary}
            </h2>
            <p className="text-[#5a6a8a] text-sm leading-relaxed mb-5">
              {isFreeTrial
                ? `Promo code ${promoCode} applied — your trial class is on us. The studio will reach out within 1–2 business days to confirm your class and time.`
                : allDropIn
                  ? 'Drop-in fees are non-refundable and subject to availability.'
                  : isFullPayment
                    ? 'Pay the full tuition now and you\'re all set — nothing else due.'
                    : `$50 deposit per dancer applies toward tuition. The remaining balance is due before the first class of the summer session.`}
            </p>

            {/* Order summary */}
            <div className={`bg-white rounded-lg border px-4 py-3 mb-4 ${isFreeTrial ? 'border-[#e8d8a8]' : 'border-[#f4c8d4]'}`}>
              {items.length > 0 && (
                <ul className={`text-[#5a6a8a] text-xs flex flex-col gap-1 mb-3 pb-3 border-b ${isFreeTrial ? 'border-[#e8d8a8]' : 'border-[#f4c8d4]'}`}>
                  {items.map((item) => (
                    <li key={item.key} className="flex justify-between gap-3">
                      <span>{item.label}</span>
                      <span className="font-semibold text-navy-dark whitespace-nowrap">${item.price}</span>
                    </li>
                  ))}
                </ul>
              )}
              {tuitionTotal > 0 && !allDropIn && (
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[#5a6a8a]">Tuition total</span>
                  <span className="font-semibold text-navy-dark">${tuitionTotal}</span>
                </div>
              )}
              {discountAmount > 0 && (
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[#0a7c3e]">Promo discount{promoCode ? ` (${promoCode})` : ''}</span>
                  <span className="font-semibold text-[#0a7c3e]">−${discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-navy-dark font-bold text-sm">Due today</p>
                  <p className="text-[#8a9aaa] text-xs">
                    {dancerListLabel ? `For ${dancerListLabel}` : 'Non-refundable'}
                  </p>
                </div>
                <span className="text-navy-dark font-black text-2xl">${amountDueToday}</span>
              </div>
              {balanceDue > 0 && (
                <p className={`text-[#8a9aaa] text-xs mt-2 pt-2 border-t ${isFreeTrial ? 'border-[#e8d8a8]' : 'border-[#f4c8d4]'}`}>
                  Remaining balance of <span className="font-semibold text-navy-dark">${balanceDue}</span> due before the first class.
                </p>
              )}
            </div>

            {status === 'submitting' && (
              <div className="text-center py-3 text-navy-dark text-sm">{isFreeTrial ? 'Confirming your trial…' : 'Processing your payment…'}</div>
            )}
            {status === 'error' && (
              <div className="bg-red-50 border border-red-300 rounded-lg p-3 mb-3 text-red-700 text-sm">{errorMsg}</div>
            )}

            {isFreeTrial ? (
              <button
                type="button"
                onClick={confirmFreeTrial}
                disabled={status === 'submitting'}
                className="w-full bg-[#b88820] text-white font-black py-3 rounded-md hover:bg-[#8a6a1a] transition-colors disabled:opacity-60 disabled:cursor-not-allowed tracking-wide"
              >
                Confirm Free Trial →
              </button>
            ) : (
              <>
                {!import.meta.env.VITE_PAYPAL_CLIENT_ID && (
                  <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3 mb-3 text-yellow-800 text-sm text-center">
                    PayPal is not configured yet. Please contact the studio to complete payment.
                  </div>
                )}
                <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
                  <div id="pp-summer-classes" className="min-h-[50px]" />
                </div>
              </>
            )}

            <Link
              to="/summer-classes"
              className="block w-full text-center text-[#5a6a8a] text-sm hover:text-navy-dark underline"
            >
              {isFreeTrial ? 'Back to Summer Classes' : 'I\'ll pay later — back to Summer Classes'}
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
