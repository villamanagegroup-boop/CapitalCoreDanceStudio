import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import { supabase } from '../lib/supabase'

const DEPOSIT_AMOUNT = 50

export default function BirthdayPayment() {
  const navigate = useNavigate()
  const { state } = useLocation()

  const bookingId = state?.bookingId || null
  const parentName = state?.parentName || ''
  const parentEmail = state?.email || ''
  const birthdayName = state?.birthdayName || ''
  const dateFirst = state?.dateFirst || ''

  const firstName = parentName ? parentName.split(' ')[0] : ''

  const [paypalReady, setPaypalReady] = useState(false)
  const [paypalRendered, setPaypalRendered] = useState(false)
  const [status, setStatus] = useState('idle') // idle | submitting | error
  const [errorMsg, setErrorMsg] = useState('')

  const dataRef = useRef({})
  useEffect(() => {
    dataRef.current = { bookingId, parentName, parentEmail, birthdayName, dateFirst }
  })

  // Load PayPal SDK once
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

  // Render PayPal Buttons
  useEffect(() => {
    if (!paypalReady || paypalRendered) return
    const container = document.getElementById('pp-deposit')
    if (!container) return
    window.paypal.Buttons({
      style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'pay', height: 50 },
      createOrder: (_d, actions) => actions.order.create({
        purchase_units: [{
          description: 'Capital Core Dance Studio – Birthday Party Deposit',
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
    }).render('#pp-deposit')
    setPaypalRendered(true)
  }, [paypalReady, paypalRendered])

  async function onPaymentSuccess(order) {
    setStatus('submitting')
    const d = dataRef.current

    // Best-effort update of the booking record. If the schema doesn't yet have
    // these columns, the update will fail silently and we still notify admin.
    if (d.bookingId) {
      try {
        const { error } = await supabase
          .from('birthday_bookings')
          .update({
            paypal_order_id: order.id,
            deposit_paid: true,
            deposit_amount: DEPOSIT_AMOUNT,
            deposit_paid_at: new Date().toISOString(),
          })
          .eq('id', d.bookingId)
        if (error) console.error('DB update (non-fatal):', error)
      } catch (e) {
        console.error('DB update exception (non-fatal):', e)
      }
    }

    // Notify admin
    try {
      await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formType: 'birthday_deposit',
          parentName: d.parentName,
          email: d.parentEmail,
          birthdayName: d.birthdayName,
          dateFirst: d.dateFirst,
          amount: DEPOSIT_AMOUNT,
          paypalOrderId: order.id,
          bookingId: d.bookingId,
        }),
      })
    } catch (e) {
      console.error('Notify error (non-fatal):', e)
    }

    navigate('/birthday-thankyou', {
      state: { name: d.parentName, birthdayName: d.birthdayName },
    })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Pay Your Deposit | Capital Core Dance Studio"
        description="Pay your $50 birthday party deposit to secure your date."
        canonical="/birthday-payment"
        noindex
      />
      <Navbar />

      <section className="bg-white flex-1 px-6 py-12">
        <div className="max-w-md mx-auto flex flex-col gap-5">

          {/* Booking confirmation */}
          <div className="bg-[#f0faf5] border border-[#b5e0c8] rounded-lg px-5 py-5 text-center">
            <p className="text-navy-dark font-black text-base mb-1">
              {firstName ? `Booking received, ${firstName}!` : 'Booking request received!'}
            </p>
            <p className="text-[#3a4a6a] text-sm leading-relaxed">
              We'll be in touch within 1–2 business days to confirm your date and details.
            </p>
          </div>

          {/* Deposit section */}
          <div className="bg-[#fff5f8] border border-[#f4c8d4] rounded-lg px-6 py-6">
            <p className="text-brand-red text-xs font-bold tracking-[0.3em] uppercase mb-2">Secure Your Date</p>
            <h2 className="text-navy-dark text-xl font-black mb-2">Pay your $50 deposit</h2>
            <p className="text-[#5a6a8a] text-sm leading-relaxed mb-5">
              Your $50 non-refundable deposit secures your party date. You're welcome to wait until you hear from us first — totally up to you!
            </p>

            {/* Order summary */}
            <div className="bg-white rounded-lg border border-[#f4c8d4] px-4 py-3 mb-4 flex justify-between items-center">
              <div>
                <p className="text-navy-dark font-bold text-sm">Birthday Party Deposit</p>
                <p className="text-[#8a9aaa] text-xs">
                  {birthdayName ? `For ${birthdayName}'s party` : 'Non-refundable · Secures your date'}
                </p>
              </div>
              <span className="text-navy-dark font-black text-2xl">${DEPOSIT_AMOUNT}</span>
            </div>

            {/* Status messages */}
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

            {/* Embedded PayPal */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
              <div id="pp-deposit" className="min-h-[50px]" />
            </div>

            <Link
              to="/birthdays"
              className="block w-full text-center text-[#5a6a8a] text-sm hover:text-navy-dark underline"
            >
              I'll pay later — back to Birthday Parties
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
