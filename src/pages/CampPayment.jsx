import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import { supabase } from '../lib/supabase'

const DEPOSIT_PER_CAMPER = 50

export default function CampPayment() {
  const navigate = useNavigate()
  const { state } = useLocation()

  const registrationId = state?.registrationId || null
  const parentName = state?.parentName || ''
  const parentEmail = state?.email || ''
  const campers = state?.campers || []
  const camperCount = Number(state?.camperCount || campers.length || 1)
  const promoCode = state?.promoCode || null
  const promoDiscount = Number(state?.promoDiscount || 0)
  const estimatedTotal = Number(state?.estimatedTotal || 0)
  const depositTotal = Number(state?.depositTotal || DEPOSIT_PER_CAMPER * camperCount)
  const paymentChoice = state?.paymentChoice === 'full' ? 'full' : 'deposit'
  const payInFull = paymentChoice === 'full'

  const isFullyComped = estimatedTotal <= 0
  const payAmount = isFullyComped
    ? 0
    : payInFull
      ? estimatedTotal
      : depositTotal
  const balanceDue = Math.max(0, estimatedTotal - payAmount)

  const firstName = parentName ? parentName.split(' ')[0] : ''
  const camperListLabel = campers.length
    ? campers.map((c) => c.name || 'Camper').join(' & ')
    : ''

  const [paypalReady, setPaypalReady] = useState(false)
  const [paypalRendered, setPaypalRendered] = useState(false)
  const [status, setStatus] = useState('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const dataRef = useRef({})
  useEffect(() => {
    dataRef.current = { registrationId, parentName, parentEmail, campers, camperCount, estimatedTotal, payAmount, paymentChoice, payInFull }
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
    if (!paypalReady || paypalRendered || isFullyComped) return
    const container = document.getElementById('pp-camp-deposit')
    if (!container) return
    window.paypal.Buttons({
      style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'pay', height: 50 },
      createOrder: (_d, actions) => actions.order.create({
        purchase_units: [{
          description: payInFull
            ? `Capital Core Dance Studio – Summer Camp Full Payment (${camperCount} camper${camperCount !== 1 ? 's' : ''})`
            : `Capital Core Dance Studio – Summer Camp Deposit (${camperCount} camper${camperCount !== 1 ? 's' : ''})`,
          amount: { value: payAmount.toFixed(2), currency_code: 'USD' },
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
    }).render('#pp-camp-deposit')
    setPaypalRendered(true)
  }, [paypalReady, paypalRendered, isFullyComped, payAmount, payInFull, camperCount])

  async function confirmFreeRegistration() {
    await onPaymentSuccess(null)
  }

  async function onPaymentSuccess(order) {
    setStatus('submitting')
    const d = dataRef.current

    if (d.registrationId) {
      try {
        const { error } = await supabase
          .from('camp_registrations')
          .update({
            paypal_order_id: order?.id || null,
            deposit_paid: true,
            deposit_amount: d.payAmount,
            deposit_paid_at: new Date().toISOString(),
            paid_in_full: d.payInFull,
            payment_choice: d.paymentChoice,
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
          formType: 'camp_deposit',
          parentName: d.parentName,
          email: d.parentEmail,
          campers: d.campers,
          camperCount: d.camperCount,
          estimatedTotal: d.estimatedTotal,
          amount: d.payAmount,
          paymentChoice: d.paymentChoice,
          paidInFull: d.payInFull,
          paypalOrderId: order?.id || null,
          registrationId: d.registrationId,
        }),
      })
    } catch (e) {
      console.error('Notify error (non-fatal):', e)
    }

    navigate('/camp-thankyou', {
      state: { name: d.parentName, campers: d.campers, camperCount: d.camperCount, paymentChoice: d.paymentChoice, paidInFull: d.payInFull },
    })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Pay Your Camp Deposit | Capital Core Dance Studio"
        description="Pay your summer camp deposit to hold your camper(s)' spots."
        canonical="/camp-payment"
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
              {isFullyComped
                ? `Confirm below to lock in ${camperListLabel ? `${camperListLabel}'s` : 'your camper\'s'} spot${camperCount > 1 ? 's' : ''}.`
                : `Pay $${payAmount.toFixed(2)} below to ${payInFull ? 'pay in full and lock in' : 'lock in'} ${camperListLabel ? `${camperListLabel}'s` : 'your camper\'s'} spot${camperCount > 1 ? 's' : ''}.`}
            </p>
          </div>

          <div className="bg-[#fff5f8] border border-[#f4c8d4] rounded-lg px-6 py-6">
            <p className="text-brand-red text-xs font-bold tracking-[0.3em] uppercase mb-2">{payInFull ? 'Pay In Full' : `Hold Your Spot${camperCount > 1 ? 's' : ''}`}</p>
            <h2 className="text-navy-dark text-xl font-black mb-2">
              {isFullyComped
                ? 'Confirm your free registration'
                : payInFull
                  ? `Pay your $${payAmount.toFixed(2)} camp balance`
                  : `Pay your $${payAmount.toFixed(2)} deposit`}
            </h2>
            <p className="text-[#5a6a8a] text-sm leading-relaxed mb-5">
              {isFullyComped
                ? `Your promo code covers the entire registration — no payment required. Click below to confirm and lock in the spot${camperCount > 1 ? 's' : ''}.`
                : payInFull
                  ? `Pay the full camp balance now — no follow-up payment required. The $${DEPOSIT_PER_CAMPER}-per-camper deposit portion is non-refundable.`
                  : `$${DEPOSIT_PER_CAMPER} per camper, non-refundable. The remaining balance is due before camp begins.`}
            </p>

            <div className="bg-white rounded-lg border border-[#f4c8d4] px-4 py-3 mb-4">
              {campers.length > 0 && (
                <ul className="text-[#5a6a8a] text-xs flex flex-col gap-2 mb-3 pb-3 border-b border-[#f4c8d4]">
                  {campers.map((c, idx) => (
                    <li key={`${c.name || 'c'}-${idx}`} className="flex flex-col gap-0.5">
                      <div className="flex justify-between font-bold text-navy-dark text-sm">
                        <span>{c.name || `Camper ${idx + 1}`}{c.isReturning === 'Yes' ? ' · returning' : ' · new'}</span>
                        <span>${Number(c.subtotal || 0).toFixed(2)}</span>
                      </div>
                      {(c.weekItems || []).map((w) => (
                        <div key={w.weekKey} className="flex justify-between pl-2">
                          <span>{w.weekLabel.split(':')[0]} — {w.description}</span>
                          <span>${w.price}</span>
                        </div>
                      ))}
                      {(c.careItems || []).map((ci) => (
                        <div key={`${c.name}-${ci.type}`} className="flex justify-between pl-2">
                          <span>{ci.description}</span>
                          <span>${Number(ci.price).toFixed(2)}</span>
                        </div>
                      ))}
                    </li>
                  ))}
                  {promoCode && promoDiscount > 0 && (
                    <li className="flex justify-between gap-3 text-green-700 pt-2 border-t border-[#f4c8d4]">
                      <span>{promoCode} promo discount</span>
                      <span className="font-semibold whitespace-nowrap">−${promoDiscount.toFixed(2)}</span>
                    </li>
                  )}
                </ul>
              )}
              {estimatedTotal > 0 && (
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[#5a6a8a]">Camp total</span>
                  <span className="font-semibold text-navy-dark">${estimatedTotal.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-navy-dark font-bold text-sm">{payInFull ? 'Full payment due today' : 'Deposit due today'}</p>
                  <p className="text-[#8a9aaa] text-xs">
                    {payInFull
                      ? `Paying ${camperListLabel ? `${camperListLabel}'s` : 'the'} camp balance in full`
                      : camperListLabel
                        ? `For ${camperListLabel}`
                        : `${DEPOSIT_PER_CAMPER} × ${camperCount} camper${camperCount !== 1 ? 's' : ''} · holds the spot${camperCount !== 1 ? 's' : ''}`}
                  </p>
                </div>
                <span className="text-navy-dark font-black text-2xl">${payAmount.toFixed(2)}</span>
              </div>
              {balanceDue > 0 && !payInFull && (
                <p className="text-[#8a9aaa] text-xs mt-2 pt-2 border-t border-[#f4c8d4]">
                  Remaining balance of <span className="font-semibold text-navy-dark">${balanceDue.toFixed(2)}</span> is due before camp begins.
                </p>
              )}
              {payInFull && !isFullyComped && (
                <p className="text-green-700 text-xs mt-2 pt-2 border-t border-[#f4c8d4]">
                  ✓ Paying in full — no further payment will be required.
                </p>
              )}
            </div>

            {status === 'submitting' && (
              <div className="text-center py-3 text-navy-dark text-sm">Processing your payment…</div>
            )}
            {status === 'error' && (
              <div className="bg-red-50 border border-red-300 rounded-lg p-3 mb-3 text-red-700 text-sm">{errorMsg}</div>
            )}
            {!import.meta.env.VITE_PAYPAL_CLIENT_ID && (
              <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3 mb-3 text-yellow-800 text-sm text-center">
                PayPal is not configured yet. Please contact the studio to pay your deposit.
              </div>
            )}

            {isFullyComped ? (
              <button
                type="button"
                onClick={confirmFreeRegistration}
                disabled={status === 'submitting'}
                className="w-full bg-brand-red text-white font-bold py-3.5 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-4"
              >
                Confirm Free Registration
              </button>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
                <div id="pp-camp-deposit" className="min-h-[50px]" />
              </div>
            )}

            <Link
              to="/camps"
              className="block w-full text-center text-[#5a6a8a] text-sm hover:text-navy-dark underline"
            >
              I'll pay later — back to Summer Camps
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
