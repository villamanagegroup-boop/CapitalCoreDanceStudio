import { useLocation, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEO from '../components/SEO'

export default function RecitalShopThankYou() {
  const { state } = useLocation()
  const firstName = state?.name?.split(' ')[0] || null

  const adultQty = state?.adultQty || 0
  const childQty = state?.childQty || 0
  const programQty = state?.programQty || 0
  const shirtLineItems = state?.shirtLineItems || ''
  const hasTickets = adultQty + childQty > 0
  const hasPrograms = programQty > 0
  const hasShirts = !!shirtLineItems
  const showDate = state?.showDate || 'Saturday, June 13, 2026'
  const showTime = state?.showTime || '2:00 PM'

  return (
    <div className="min-h-screen flex flex-col bg-[#0B1F3A]">
      <style>{`
        .ty-playfair { font-family: 'Playfair Display', Georgia, serif; }
      `}</style>
      <SEO
        title="Order Confirmed – Capital Core Dance Studio"
        description="Thank you for your recital order!"
        canonical="/recitalshop/thankyou"
        noindex
      />
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-lg text-center">

          <div className="flex justify-center mb-8">
            {hasTickets ? (
              <img
                src="/ticket-banner.png"
                alt="A Night at the Cinema — Spring Show General Admission Ticket"
                className="w-full max-w-lg rounded-xl shadow-2xl border border-[#C9A84C]/30"
              />
            ) : (
              <img
                src="/shirt-thankyou.png"
                alt="Thank you for your purchase!"
                className="w-56 h-56 object-contain drop-shadow-xl"
              />
            )}
          </div>

          <p className="text-[#C9A84C] text-xs font-black tracking-[0.35em] uppercase mb-3">
            Order Confirmed
          </p>
          <h1 className="ty-playfair text-3xl md:text-4xl font-black text-white mb-3 leading-tight">
            {firstName ? `Thank you, ${firstName}!` : 'Thank you!'}
          </h1>
          <p className="text-white/50 text-sm tracking-widest italic mb-8">A Night at the Cinema</p>

          {/* Order summary */}
          <div className="bg-white rounded-2xl px-8 py-7 mb-6 text-left shadow-lg">
            <h2 className="ty-playfair text-xl font-bold text-[#0B1F3A] mb-4">Your Order</h2>
            <ul className="space-y-3">
              {hasTickets && (
                <li className="flex gap-3 items-start">
                  <span className="mt-0.5 w-6 h-6 rounded-full bg-[#C9A84C] flex-shrink-0 flex items-center justify-center text-[#0B1F3A] text-xs font-black">T</span>
                  <div className="flex-1">
                    <p className="text-[#0B1F3A] font-bold text-sm">
                      {adultQty} adult ticket{adultQty === 1 ? '' : 's'}{childQty > 0 && ` + ${childQty} child${childQty === 1 ? '' : 'ren'} (free)`}
                    </p>
                    <p className="text-gray-500 text-xs">{showDate} · {showTime}</p>
                  </div>
                </li>
              )}
              {hasPrograms && (
                <li className="flex gap-3 items-start">
                  <span className="mt-0.5 w-6 h-6 rounded-full bg-[#C9A84C] flex-shrink-0 flex items-center justify-center text-[#0B1F3A] text-xs font-black">P</span>
                  <div className="flex-1">
                    <p className="text-[#0B1F3A] font-bold text-sm">
                      {programQty} show program{programQty === 1 ? '' : 's'}
                    </p>
                    <p className="text-gray-500 text-xs">Pickup at the show</p>
                  </div>
                </li>
              )}
              {hasShirts && (
                <li className="flex gap-3 items-start">
                  <span className="mt-0.5 w-6 h-6 rounded-full bg-[#C9A84C] flex-shrink-0 flex items-center justify-center text-[#0B1F3A] text-xs font-black">S</span>
                  <div className="flex-1">
                    <p className="text-[#0B1F3A] font-bold text-sm">T-shirts</p>
                    <p className="text-gray-500 text-xs">{shirtLineItems}</p>
                    <p className="text-gray-400 text-xs mt-0.5 italic">Pickup at the studio (date TBA)</p>
                  </div>
                </li>
              )}
            </ul>
            {state?.total != null && (
              <div className="border-t border-gray-200 pt-3 mt-4 flex justify-between items-center">
                <span className="text-[#0B1F3A] font-bold text-sm">Total Paid</span>
                <span className="text-[#C9A84C] font-black text-xl">${state.total}</span>
              </div>
            )}
          </div>

          {/* Tickets reminder */}
          {hasTickets && (
            <div className="bg-[#fdf8f0] border-2 border-[#C9A84C] rounded-2xl px-6 py-5 mb-6 text-left shadow-lg">
              <p className="text-[#C9A84C] text-[10px] font-black tracking-widest uppercase mb-2">Important — Show Day</p>
              <p className="text-[#0B1F3A] font-bold text-base mb-1">📱 Show your confirmation email at the door</p>
              <p className="text-gray-600 text-sm leading-relaxed">
                A confirmation has been sent to your email. Save it and bring it with you on show day for entry.
                Children 3 &amp; under don't need a ticket.
              </p>
            </div>
          )}

          {/* What's next */}
          <div className="bg-white rounded-2xl px-8 py-7 mb-8 text-left shadow-lg">
            <h2 className="ty-playfair text-lg font-bold text-[#0B1F3A] mb-3">What happens next?</h2>
            <ol className="space-y-3 list-decimal pl-5">
              <li className="text-gray-600 text-sm leading-relaxed">
                A receipt has been sent to your email from PayPal, plus a confirmation from Capital Core Dance Studio.
              </li>
              {hasTickets && (
                <li className="text-gray-600 text-sm leading-relaxed">
                  Save your confirmation email — show it at the door on {showDate} at {showTime}.
                  Venue: Richmond Christian School, 6511 Belmont Rd, Chesterfield, VA 23832.
                </li>
              )}
              {hasPrograms && (
                <li className="text-gray-600 text-sm leading-relaxed">
                  Pick up your program{programQty === 1 ? '' : 's'} at the show.
                </li>
              )}
              {hasShirts && (
                <li className="text-gray-600 text-sm leading-relaxed">
                  Your shirt{shirtLineItems.match(/×(\d+)/) && parseInt(shirtLineItems.match(/×(\d+)/)[1]) > 1 ? 's are' : ' is'} being made to order. We'll email you when{shirtLineItems.match(/×(\d+)/) && parseInt(shirtLineItems.match(/×(\d+)/)[1]) > 1 ? ' they\'re' : ' it\'s'} ready for pickup at the studio.
                </li>
              )}
            </ol>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/recital"
              className="bg-[#C9A84C] text-[#0B1F3A] font-bold px-7 py-3 rounded-lg hover:bg-[#d4b85a] transition-colors text-sm tracking-wide"
            >
              ← Back to Recital Info
            </Link>
            <Link
              to="/recitalshop"
              className="border-2 border-[#C9A84C]/40 text-[#C9A84C] font-bold px-7 py-3 rounded-lg hover:border-[#C9A84C] transition-colors text-sm tracking-wide"
            >
              Continue Shopping
            </Link>
          </div>

          <p className="text-white/35 text-xs mt-8">
            Questions? Contact us at{' '}
            <a href="mailto:info@capitalcoredance.com" className="underline hover:text-white/60 transition-colors">
              info@capitalcoredance.com
            </a>
          </p>

        </div>
      </main>

      <Footer />
    </div>
  )
}
