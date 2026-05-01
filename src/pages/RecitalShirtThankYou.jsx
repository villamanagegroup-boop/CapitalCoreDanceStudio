import { useLocation, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEO from '../components/SEO'

export default function RecitalShirtThankYou() {
  const { state } = useLocation()
  const firstName = state?.name?.split(' ')[0] || null

  return (
    <div className="min-h-screen flex flex-col bg-[#0B1F3A]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap');
        .ty-playfair { font-family: 'Playfair Display', Georgia, serif; }
      `}</style>
      <SEO
        title="Order Confirmed – Capital Core Dance Studio"
        description="Thank you for ordering your recital shirt!"
        canonical="/recital/shirts/thankyou"
      />
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-lg text-center">

          {/* Thank you image */}
          <div className="flex justify-center mb-8">
            <img
              src="/shirt-thankyou.png"
              alt="Thank you for your purchase!"
              className="w-64 h-64 object-contain drop-shadow-xl"
            />
          </div>

          {/* Heading */}
          <h1 className="ty-playfair text-3xl md:text-4xl font-black text-white mb-2 leading-tight">
            {firstName ? `You're all set, ${firstName}!` : "You're all set!"}
          </h1>
          <p className="text-[#C9A84C] text-sm font-semibold tracking-widest uppercase mb-8 italic">
            ✦ A Night at the Cinema ✦
          </p>

          {/* Confirmation card */}
          <div className="bg-white rounded-2xl px-8 py-7 mb-8 text-left shadow-lg">
            <h2 className="ty-playfair text-xl font-bold text-[#0B1F3A] mb-4">What happens next?</h2>
            <ul className="space-y-4">
              <li className="flex gap-3 items-start">
                <span className="mt-0.5 w-6 h-6 rounded-full bg-[#C9A84C] flex-shrink-0 flex items-center justify-center text-[#0B1F3A] text-xs font-black">1</span>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Your payment has been confirmed. A receipt has been sent to your email from PayPal.
                </p>
              </li>
              <li className="flex gap-3 items-start">
                <span className="mt-0.5 w-6 h-6 rounded-full bg-[#C9A84C] flex-shrink-0 flex items-center justify-center text-[#0B1F3A] text-xs font-black">2</span>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Your shirt is being made to order with the official <strong>"A Night at the Cinema"</strong> design on the front and the full cast list on the back.
                </p>
              </li>
              <li className="flex gap-3 items-start">
                <span className="mt-0.5 w-6 h-6 rounded-full bg-[#C9A84C] flex-shrink-0 flex items-center justify-center text-[#0B1F3A] text-xs font-black">3</span>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Shirts will be available for <strong>pickup at the studio</strong>. A pickup date will be announced soon — keep an eye on your email and our studio page!
                </p>
              </li>
            </ul>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/recital"
              className="bg-[#C9A84C] text-[#0B1F3A] font-bold px-8 py-3 rounded-lg hover:bg-[#d4b85a] transition-colors text-sm tracking-wide"
            >
              ← Back to Recital Info
            </Link>
            <button
              disabled
              className="border-2 border-[#C9A84C]/40 text-[#C9A84C]/50 font-bold px-8 py-3 rounded-lg text-sm tracking-wide cursor-not-allowed"
              title="Ticket sales coming soon"
            >
              🎟 Buy Tickets — Coming Soon
            </button>
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
