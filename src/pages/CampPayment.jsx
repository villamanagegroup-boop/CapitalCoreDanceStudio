import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import { supabase } from '../lib/supabase'

const DEPOSIT_AMOUNT = 50

export default function CampPayment() {
  const navigate = useNavigate()
  const { state } = useLocation()

  const registrationId = state?.registrationId || null
  const parentName = state?.parentName || ''
  const parentEmail = state?.email || ''
  const camperName = state?.camperName || ''
  const items = state?.items || []
  const careItems = state?.careItems || []
  const promoCode = state?.promoCode || null
  const promoDiscount = state?.promoDiscount || 0
  const estimatedTotal = state?.estimatedTotal || 0
  const balanceDue = Math.max(0, estimatedTotal - DEPOSIT_AMOUNT)

  const firstName = parentName ? parentName.split(' ')[0] : ''

  const [paypalReady, setPaypalReady] = useState(false)
  const [paypalRendered, setPaypalRendered] = useState(false)
  const [status, setStatus] = useState('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const dataRef = useRef({})
  useEffect(() => {
    dataRef.current = { registrationId, parentName, parentEmail, camperName, items, careItems, estimatedTotal }
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
    if (!paypalReady || paypalRendered) return
    const container = document.getElementById('pp-camp-deposit')
    if (!container) return
    window.paypal.Buttons({
      style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'pay', height: 50 },
      createOrder: (_d, actions) => actions.order.create({
        purchase_units: [{
          description: 'Capital Core Dance Studio – Summer Camp Deposit',
          amount: { value: DEPOSIT_AMOUNT.toFixed(2), currency_code: 'USD' },
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
  }, [paypalReady, paypalRendered])

  async function onPaymentSuccess(order) {
    setStatus('submitting')
    const d = dataRef.current

    if (d.registrationId) {
      try {
        const { error } = await supabase
          .from('camp_registrations')
          .update({
            paypal_order_id: order.id,
            deposit_paid: true,
            deposit_amount: DEPOSIT_AMOUNT,
            deposit_paid_at: new Date().toISOString(),
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
          camperName: d.camperName,
          items: d.items,
          careItems: d.careItems,
          estimatedTotal: d.estimatedTotal,
          amount: DEPOSIT_AMOUNT,
          paypalOrderId: order.id,
          registrationId: d.registrationId,
        }),
      })
    } catch (e) {
      console.error('Notify error (non-fatal):', e)
    }

    navigate('/camp-thankyou', {
      state: { name: d.parentName, camperName: d.camperName },
    })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Pay Your Camp Deposit | Capital Core Dance Studio"
        description="Pay your $50 summer camp deposit to hold your camper's spot."
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
              Pay your $50 deposit below to lock in {camperName ? `${camperName}'s` : 'your camper\'s'} spot.
            </p>
          </div>

          <div className="bg-[#fff5f8] border border-[#f4c8d4] rounded-lg px-6 py-6">
            <p className="text-brand-red text-xs font-bold tracking-[0.3em] uppercase mb-2">Hold Your Spot</p>
            <h2 className="text-navy-dark text-xl font-black mb-2">Pay your $50 deposit</h2>
            <p className="text-[#5a6a8a] text-sm leading-relaxed mb-5">
              Your $50 non-refundable deposit secures your camper's spot. The remaining balance is due before camp begins.
            </p>

            <div className="bg-white rounded-lg border border-[#f4c8d4] px-4 py-3 mb-4">
              {(items.length > 0 || careItems.length > 0) && (
                <ul className="text-[#5a6a8a] text-xs flex flex-col gap-1 mb-3 pb-3 border-b border-[#f4c8d4]">
                  {items.map((item) => (
                    <li key={item.weekKey} className="flex justify-between gap-3">
                      <span>{item.weekLabel.split(':')[0]} — {item.description}</span>
                      <span className="font-semibold text-navy-dark whitespace-nowrap">${item.price}</span>
                    </li>
                  ))}
                  {careItems.map((item) => (
                    <li key={item.type} className="flex justify-between gap-3">
                      <span>{item.description}</span>
                      <span className="font-semibold text-navy-dark whitespace-nowrap">${item.price.toFixed(2)}</span>
                    </li>
                  ))}
                  {promoCode && promoDiscount > 0 && (
                    <li className="flex justify-between gap-3 text-green-700">
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
                  <p className="text-navy-dark font-bold text-sm">Deposit due today</p>
                  <p className="text-[#8a9aaa] text-xs">
                    {camperName ? `For ${camperName}` : 'Non-refundable · Holds your spot'}
                  </p>
                </div>
                <span className="text-navy-dark font-black text-2xl">${DEPOSIT_AMOUNT}</span>
              </div>
              {balanceDue > 0 && (
                <p className="text-[#8a9aaa] text-xs mt-2 pt-2 border-t border-[#f4c8d4]">
                  Remaining balance of <span className="font-semibold text-navy-dark">${balanceDue.toFixed(2)}</span> is due before camp begins.
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

            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
              <div id="pp-camp-deposit" className="min-h-[50px]" />
            </div>

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
