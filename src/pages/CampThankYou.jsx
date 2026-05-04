import { Link, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEO from '../components/SEO'

export default function CampThankYou() {
  const { state } = useLocation()
  const camperName = state?.camperName || ''

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Thank You | Capital Core Dance Studio"
        description="Thank you for registering for summer camp at Capital Core Dance Studio!"
        canonical="/camp-thankyou"
        noindex
      />
      <Navbar />

      <section className="bg-white flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-md w-full text-center flex flex-col items-center gap-6">

          <div className="w-20 h-20 rounded-full bg-[#f0faf5] border-4 border-[#b5e0c8] flex items-center justify-center text-4xl">
            🎉
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-navy-dark text-lg font-black">
              {camperName ? `${camperName}'s spot is secured!` : 'Your spot is secured!'}
            </p>
            <p className="text-[#5a6a8a] text-sm leading-relaxed">
              Your deposit has been received. We'll be in touch within 1–2 business days with next steps,
              including the remaining balance and what to bring on the first day.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Link
              to="/camps"
              className="flex-1 bg-brand-red text-white text-center font-bold py-3 rounded-md hover:bg-red-700 transition-colors"
            >
              Back to Summer Camps
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
