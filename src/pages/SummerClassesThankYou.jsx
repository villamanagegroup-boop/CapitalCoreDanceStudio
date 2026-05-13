import { Link, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEO from '../components/SEO'

const SIGNUP_TYPE_LABELS = {
  classes: 'Per-class · Full 6 weeks',
  flex_pass: 'Summer Flex Pass · Unlimited',
  drop_in: 'Drop-in',
}

export default function SummerClassesThankYou() {
  const { state } = useLocation()
  const parentName = state?.name || ''
  const parentEmail = state?.email || ''
  const dancers = state?.dancers || []
  const dancerCount = Number(state?.dancerCount || dancers.length || 0)
  const allDropIn = !!state?.allDropIn
  const balanceDue = Number(state?.balanceDue || 0)
  const amountPaid = Number(state?.amountPaid || state?.amountDueToday || 0)
  const tuitionTotal = Number(state?.tuitionTotal || 0)

  const firstName = parentName ? parentName.split(' ')[0] : ''
  const dancerLabel = dancers.length
    ? dancers.map((d) => d.name || 'Dancer').join(' & ')
    : ''

  const headline = (() => {
    if (allDropIn) {
      return dancerLabel
        ? `${dancerLabel}'s drop-in${dancerCount > 1 ? 's are' : ' is'} confirmed!`
        : 'Drop-in confirmed!'
    }
    return dancerLabel
      ? `${dancerLabel}'s spot${dancerCount > 1 ? 's are' : ' is'} reserved!`
      : 'Your spot is reserved!'
  })()

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Thank You · Summer Class Confirmation | Capital Core Dance Studio"
        description="Thank you for signing up for summer classes at Capital Core Dance Studio!"
        canonical="/summer-classes/thankyou"
        noindex
      />
      <Navbar />

      <section className="flex-1 px-6 py-12" style={{ backgroundColor: '#ede0fa' }}>
        <div className="max-w-2xl mx-auto flex flex-col gap-6">

          {/* Hero confirmation card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-br from-[#f4a8b4] via-[#e890a5] to-[#7a4ed8] px-8 py-10 text-center text-white">
              <div className="w-20 h-20 mx-auto rounded-full bg-white/95 flex items-center justify-center text-4xl mb-4 shadow-lg">
                🩰
              </div>
              <p className="text-white/90 text-xs font-bold tracking-[0.4em] uppercase mb-2">Confirmation</p>
              <h1 className="text-white text-2xl sm:text-3xl font-black leading-tight">{headline}</h1>
              {firstName && (
                <p className="text-white/90 text-sm mt-3">Thank you, {firstName} — we can't wait to dance with you this summer.</p>
              )}
            </div>

            {/* Body */}
            <div className="px-6 sm:px-8 py-7 flex flex-col gap-5">

              {/* Dancer cards */}
              {dancers.length > 0 && (
                <div className="flex flex-col gap-3">
                  <p className="text-brand-red text-xs font-bold tracking-[0.3em] uppercase">Your dancers</p>
                  {dancers.map((d, i) => (
                    <div key={`${d.name || 'd'}-${i}`} className="border border-surface-border rounded-lg px-4 py-3 bg-surface-light/40">
                      <div className="flex justify-between items-baseline gap-3">
                        <div>
                          <p className="font-bold text-navy-dark">
                            {d.name || `Dancer ${i + 1}`}
                            <span className="text-[#8a9aaa] text-xs font-normal ml-1.5">
                              · {d.isReturning === 'Yes' ? 'returning' : 'new'}
                            </span>
                          </p>
                          <p className="text-[#5a6a8a] text-xs mt-0.5">
                            {SIGNUP_TYPE_LABELS[d.signupType] || d.signupType}
                          </p>
                        </div>
                        <span className="text-brand-red font-bold whitespace-nowrap">${d.tuition || 0}</span>
                      </div>

                      {d.signupType === 'classes' && Array.isArray(d.classes) && d.classes.length > 0 && (
                        <p className="text-[#3a4a6a] text-xs mt-2">
                          <span className="font-semibold">Classes:</span> {d.classes.join(', ')}
                        </p>
                      )}
                      {d.signupType === 'drop_in' && (
                        <p className="text-[#3a4a6a] text-xs mt-2">
                          <span className="font-semibold">Drop-in:</span> {d.dropInClass || '—'} · {d.dropInWeek || '—'}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Totals */}
              <div className="bg-[#f0f6ff] border border-[#c8ddf4] rounded-lg px-5 py-4 flex flex-col gap-1.5 text-sm">
                {tuitionTotal > 0 && (
                  <div className="flex justify-between text-[#3a4a6a]">
                    <span>Tuition total</span>
                    <span className="font-semibold">${tuitionTotal}</span>
                  </div>
                )}
                {amountPaid > 0 && (
                  <div className="flex justify-between text-navy-dark font-bold">
                    <span>Paid today</span>
                    <span>${amountPaid}</span>
                  </div>
                )}
                {balanceDue > 0 && (
                  <div className="flex justify-between text-[#3a4a6a] pt-2 border-t border-[#c8ddf4]">
                    <span>Balance due before first class</span>
                    <span className="font-semibold">${balanceDue}</span>
                  </div>
                )}
              </div>

              {/* Email confirmation note */}
              <div className="flex items-start gap-3 bg-[#f0faf5] border border-[#b5e0c8] rounded-lg px-4 py-3">
                <span className="text-2xl flex-shrink-0">📧</span>
                <div>
                  <p className="text-navy-dark font-bold text-sm">Confirmation email sent</p>
                  <p className="text-[#3a4a6a] text-xs leading-relaxed mt-0.5">
                    {parentEmail
                      ? <>We sent a copy of your registration to <span className="font-semibold text-navy-dark">{parentEmail}</span>. Check your spam folder if you don't see it.</>
                      : 'We sent a copy of your registration to your email. Check your spam folder if you don\'t see it.'}
                  </p>
                </div>
              </div>

              {/* Key dates */}
              <div className="bg-[#fff5f8] border border-[#f4c8d4] rounded-lg px-5 py-4">
                <p className="text-brand-red text-xs font-bold tracking-[0.3em] uppercase mb-2">Mark Your Calendar</p>
                <div className="flex flex-col gap-1.5 text-sm text-[#3a4a6a]">
                  <div className="flex justify-between">
                    <span>First class</span>
                    <span className="font-semibold text-navy-dark">Tuesday, June 23, 2026</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last class</span>
                    <span className="font-semibold text-navy-dark">Thursday, July 30, 2026</span>
                  </div>
                </div>
              </div>

              {/* What's next */}
              <div>
                <p className="text-navy-dark text-xs font-bold tracking-[0.3em] uppercase mb-2">What's Next?</p>
                <ul className="flex flex-col gap-2 text-sm text-[#3a4a6a]">
                  <li className="flex gap-2"><span className="text-brand-red">•</span><span>We'll reach out within 1–2 business days with what to wear and bring.</span></li>
                  {balanceDue > 0 && (
                    <li className="flex gap-2"><span className="text-brand-red">•</span><span>Your remaining balance of <span className="font-semibold text-navy-dark">${balanceDue}</span> is due before the first class.</span></li>
                  )}
                  <li className="flex gap-2"><span className="text-brand-red">•</span><span>Make sure each dancer's waiver is completed before their first class.</span></li>
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
              to="/summer-classes"
              className="flex-1 bg-brand-red text-white text-center font-bold py-3 rounded-md hover:bg-red-700 transition-colors"
            >
              Back to Summer Classes
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
