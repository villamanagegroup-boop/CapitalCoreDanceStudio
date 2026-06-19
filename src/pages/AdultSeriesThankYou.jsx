import { Link, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import { dateLabel } from '../lib/adultSeries'

export default function AdultSeriesThankYou() {
  const { state } = useLocation()
  const name = state?.name || ''
  const email = state?.email || ''
  const registrationType = state?.registrationType || 'pass'
  const typeLabel = state?.typeLabel || (registrationType === 'pass' ? 'Summer Series Pass' : 'Drop-In')
  const dropInDate = state?.dropInDate || null
  const amountPaid = Number(state?.amountPaid || 0)
  const isPass = registrationType === 'pass'

  const firstName = name ? name.split(' ')[0] : ''
  const headline = isPass ? "You're in for the full series!" : 'Your drop-in is confirmed!'

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Thank You · Adult Summer Series | Capital Core Dance Studio"
        description="Thank you for registering for the Adult Summer Series at Capital Core Dance Studio!"
        canonical="/adult-summer-series/thankyou"
        noindex
      />
      <Navbar />

      <section className="flex-1 px-6 py-12" style={{ backgroundColor: '#faf3eb' }}>
        <div className="max-w-2xl mx-auto flex flex-col gap-6">

          {/* Hero confirmation card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="px-8 py-10 text-center text-white" style={{ background: 'linear-gradient(135deg, #7a3e42 0%, #a83a4c 55%, #c9a868 100%)' }}>
              <div className="w-20 h-20 mx-auto rounded-full bg-white/95 flex items-center justify-center text-4xl mb-4 shadow-lg">
                💃
              </div>
              <p className="text-white/90 text-xs font-bold tracking-[0.4em] uppercase mb-2">Confirmation</p>
              <h1 className="text-white text-2xl sm:text-3xl font-black leading-tight">{headline}</h1>
              {firstName && (
                <p className="text-white/90 text-sm mt-3">Thank you, {firstName} — we can't wait to move with you this summer.</p>
              )}
            </div>

            {/* Body */}
            <div className="px-6 sm:px-8 py-7 flex flex-col gap-5">

              {/* Registration summary */}
              <div className="bg-[#fff5f8] border border-[#f4c8d4] rounded-lg px-5 py-4 flex flex-col gap-1.5 text-sm">
                <div className="flex justify-between text-navy-dark font-bold">
                  <span>{typeLabel}</span>
                  {amountPaid > 0 && <span>${amountPaid} paid</span>}
                </div>
                {!isPass && dropInDate && (
                  <p className="text-[#5a6a8a] text-xs">Class date: {dateLabel(dropInDate)}</p>
                )}
              </div>

              {/* Email confirmation note */}
              <div className="flex items-start gap-3 bg-[#f0faf5] border border-[#b5e0c8] rounded-lg px-4 py-3">
                <span className="text-2xl flex-shrink-0">📧</span>
                <div>
                  <p className="text-navy-dark font-bold text-sm">Confirmation email sent</p>
                  <p className="text-[#3a4a6a] text-xs leading-relaxed mt-0.5">
                    {email
                      ? <>We sent a copy of your registration to <span className="font-semibold text-navy-dark">{email}</span>. Check your spam folder if you don't see it.</>
                      : 'We sent a copy of your registration to your email. Check your spam folder if you don\'t see it.'}
                  </p>
                </div>
              </div>

              {/* Key dates */}
              <div className="bg-[#faf3eb] border border-[#e8d8c4] rounded-lg px-5 py-4">
                <p className="text-warm-burgundy text-xs font-bold tracking-[0.3em] uppercase mb-2" style={{ color: '#7a3e42' }}>Mark Your Calendar</p>
                <div className="flex flex-col gap-1.5 text-sm text-[#3a4a6a]">
                  <div className="flex justify-between">
                    <span>{isPass ? 'First class' : 'Your class'}</span>
                    <span className="font-semibold text-navy-dark">{isPass ? 'Monday, June 29, 2026' : dateLabel(dropInDate)}</span>
                  </div>
                  {isPass && (
                    <div className="flex justify-between">
                      <span>Last class</span>
                      <span className="font-semibold text-navy-dark">Monday, August 3, 2026</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Time</span>
                    <span className="font-semibold text-navy-dark">6:00 – 7:30 PM</span>
                  </div>
                </div>
              </div>

              {/* What's next */}
              <div>
                <p className="text-navy-dark text-xs font-bold tracking-[0.3em] uppercase mb-2">What's Next?</p>
                <ul className="flex flex-col gap-2 text-sm text-[#3a4a6a]">
                  <li className="flex gap-2"><span className="text-brand-red">•</span><span>We'll reach out within 1–2 business days with what to wear and bring.</span></li>
                  <li className="flex gap-2"><span className="text-brand-red">•</span><span>Complete your movement waiver before your first class.</span></li>
                  <li className="flex gap-2"><span className="text-brand-red">•</span><span>Wear comfortable clothes you can move in — no dance experience needed!</span></li>
                </ul>
              </div>

              {/* Contact / share row */}
              <div className="border-t border-surface-border pt-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between text-xs text-[#5a6a8a]">
                <div>
                  Questions? <a href="tel:8042344014" className="font-semibold text-navy-dark hover:underline">(804) 234-4014</a>{' '}or{' '}
                  <a href="mailto:info@capitalcoredance.com" className="font-semibold text-navy-dark hover:underline">info@capitalcoredance.com</a>
                </div>
                <div className="flex items-center gap-2">
                  <span>Tell a friend:</span>
                  <a href="https://www.instagram.com/capitalcoredance" target="_blank" rel="noreferrer" className="text-[#f4a8b4] font-semibold hover:underline">Instagram</a>
                  <span>·</span>
                  <a href="https://www.facebook.com/p/Capital-Core-Dance-Challenge-61566002721661/" target="_blank" rel="noreferrer" className="text-[#7ab3e8] font-semibold hover:underline">Facebook</a>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/adult-summer-series"
              className="flex-1 bg-brand-red text-white text-center font-bold py-3 rounded-md hover:bg-red-700 transition-colors"
            >
              Back to Adult Summer Series
            </Link>
            <Link
              to="/"
              className="flex-1 bg-white text-navy-dark text-center font-bold py-3 rounded-md border border-surface-border hover:bg-surface-light transition-colors"
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
