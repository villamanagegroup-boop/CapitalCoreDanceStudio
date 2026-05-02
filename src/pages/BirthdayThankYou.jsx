import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEO from '../components/SEO'

export default function BirthdayThankYou() {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Thank You | Capital Core Dance Studio"
        description="Thank you for booking a birthday party at Capital Core Dance Studio!"
        canonical="/birthday-thankyou"
        noindex
      />
      <Navbar />

      <section className="bg-white flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-md w-full text-center flex flex-col items-center gap-6">

          <img
            src="/birthday-thankyou.png"
            alt="Thank you for supporting our studio!"
            className="w-72 sm:w-80"
          />

          <div className="flex flex-col gap-2">
            <p className="text-navy-dark text-lg font-black">Your deposit has been received!</p>
            <p className="text-[#5a6a8a] text-sm leading-relaxed">
              We'll be in touch within 1–2 business days to confirm your party date and all the details. We can't wait to celebrate with you!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Link
              to="/birthdays"
              className="flex-1 bg-brand-red text-white text-center font-bold py-3 rounded-md hover:bg-red-700 transition-colors"
            >
              Back to Birthday Parties
            </Link>
            <Link
              to="/"
              className="flex-1 bg-[#f0f6ff] text-navy-dark text-center font-bold py-3 rounded-md hover:bg-[#ddeeff] transition-colors"
            >
              Go to Home
            </Link>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  )
}
