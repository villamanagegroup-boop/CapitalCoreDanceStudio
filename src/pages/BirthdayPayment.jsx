import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEO from '../components/SEO'

export default function BirthdayPayment() {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Booking Received | Capital Core Dance Studio"
        description="Your birthday party booking request has been received. Pay your deposit to secure your date."
        canonical="/birthday-payment"
      />
      <Navbar />

      <section className="bg-white flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-md w-full flex flex-col gap-4">

          <div className="bg-[#f0faf5] border border-[#b5e0c8] rounded-lg px-5 py-5 text-center">
            <p className="text-navy-dark font-black text-base mb-1">Booking request received!</p>
            <p className="text-[#3a4a6a] text-sm leading-relaxed">
              Thank you! We'll be in touch within 1–2 business days to confirm your date and details.
            </p>
          </div>

          <div className="bg-[#fff5f8] border border-[#f4c8d4] rounded-lg px-5 py-5 flex flex-col gap-3">
            <p className="text-navy-dark font-bold text-sm">Ready to pay your deposit now?</p>
            <p className="text-[#5a6a8a] text-xs leading-relaxed">
              Your $50 non-refundable deposit secures your party date. You're welcome to wait until you hear from us first — totally up to you!
            </p>
            <a
              href="https://www.paypal.com/ncp/payment/8FZUU5DU73H5S"
              className="block w-full bg-[#0070ba] text-white text-center font-bold py-3 rounded-md hover:bg-[#005ea6] transition-colors"
            >
              Pay $50 Deposit via PayPal
            </a>
            <Link
              to="/birthdays"
              className="block w-full text-center text-[#5a6a8a] text-sm hover:text-navy-dark underline"
            >
              I'll pay later — back to Birthday Parties
            </Link>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  )
}
