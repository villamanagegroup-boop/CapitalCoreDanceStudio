import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import PageHeader from '../components/PageHeader'
import Footer from '../components/Footer'
import SEO from '../components/SEO'

const INCLUDED = [
  'Private studio space',
  'Party host (dance instructor)',
  'Dance party & movement games',
  'Themed activity or craft',
  'Music & sound system',
  'Tables & chairs',
  'Set-up & clean-up',
]

const THEMES = [
  'Princess & Fairytale Dance',
  'Hip Hop Dance Party',
  'Pop Star Dance Party',
  'Glow Dance Party',
  'Unicorn & Rainbow Party',
  'Preschool Wiggle & Giggle',
  'Tea Party & Royal Celebration',
  'Superhero Movement Party',
  'Dance & Craft Party',
]

export default function Birthdays() {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Dance Birthday Parties | Capital Core Dance Studio – Midlothian, VA"
        description="Celebrate your child's birthday with a dance party at Capital Core Dance Studio in Midlothian, VA. Private studio, instructor-led fun, custom packages for all ages."
        canonical="/birthdays"
      />
      <Navbar />
      <PageHeader
        eyebrow="Capital Core Dance"
        title="Birthday Parties"
        subtitle="A fun, active, and stress-free way to celebrate your child's special day — hosted by our experienced staff in a private studio setting."
      />

      {/* Booking Banner */}
      <section className="px-6 py-4" style={{ backgroundColor: '#f4a8b4' }}>
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-center sm:text-left">
            <p className="text-navy-dark font-black text-lg leading-snug">Ready to book your party?</p>
            <p className="text-navy-dark/70 text-sm mt-0.5">Get started in minutes — no phone tag required.</p>
          </div>
          <Link
            to="/birthday-booking"
            className="flex-shrink-0 bg-navy-dark text-white text-sm font-bold px-6 py-2 rounded-md hover:bg-navy-mid transition-colors whitespace-nowrap"
          >
            Complete Our Form Now →
          </Link>
        </div>
      </section>

      <section className="bg-white flex-1 px-6 py-12">
        <div className="max-w-3xl mx-auto">

          {/* Intro */}
          <p className="text-[#3a4a6a] text-sm leading-relaxed mb-10">
            By popular demand, our birthday parties combine dancing, games, themed activities, and imagination-filled fun — all hosted by our experienced staff in a private studio setting.
          </p>

          {/* Three columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

            {/* What's Included */}
            <div className="border border-surface-border border-l-4 border-l-[#f4a8b4] rounded-lg px-5 py-5">
              <h3 className="font-black text-navy-dark text-base mb-3">What's Included</h3>
              <ul className="flex flex-col gap-1.5">
                {INCLUDED.map((item) => (
                  <li key={item} className="text-[#3a4a6a] text-sm flex gap-2">
                    <span className="text-[#f4a8b4] mt-0.5 flex-shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-[#8a9aaa] text-xs mt-4 italic">
                Parents provide food, cake, and drinks — we handle the rest!
              </p>
            </div>

            {/* Themes */}
            <div className="border border-surface-border border-l-4 border-l-[#f4a060] rounded-lg px-5 py-5">
              <h3 className="font-black text-navy-dark text-base mb-3">Exciting Themes</h3>
              <ul className="flex flex-col gap-1.5">
                {THEMES.map((theme) => (
                  <li key={theme} className="text-[#3a4a6a] text-sm flex gap-2">
                    <span className="text-[#f4a060] mt-0.5 flex-shrink-0">✓</span>
                    {theme}
                  </li>
                ))}
              </ul>
              <p className="text-[#8a9aaa] text-xs mt-4 italic">
                Optional upgrades: glow party, crafts, and custom themes
              </p>
            </div>

            {/* Party Details */}
            <div className="border border-surface-border border-l-4 border-l-brand-red rounded-lg px-5 py-5">
              <h3 className="font-black text-navy-dark text-base mb-3">Party Details</h3>
              <ul className="flex flex-col gap-1.5">
                {[
                  '90-minute private party',
                  'Up to 10 children included',
                  'Ages 2–17',
                  'Additional children may be added',
                  'Available weekends (limited weekday availability)',
                ].map((item) => (
                  <li key={item} className="text-[#3a4a6a] text-sm flex gap-2">
                    <span className="text-brand-red mt-0.5 flex-shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-[#8a9aaa] text-xs mt-4 italic">
                Studio Family Bonus: Enrolled dancers receive priority booking and a special thank-you upgrade.
              </p>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-[#fff5f8] border border-[#f4c8d4] rounded-lg px-5 py-5 mb-6 text-center">
            <p className="text-brand-red text-xs font-bold tracking-[0.3em] uppercase mb-1">Packages</p>
            <p className="text-navy-dark text-3xl font-black">Starting at $199</p>
          </div>

          {/* Booking */}
          <div className="border border-surface-border rounded-lg px-5 py-5 mb-8">
            <h3 className="font-black text-navy-dark text-base mb-3">Booking Information</h3>
            <ul className="flex flex-col gap-1.5">
              {[
                '$50 non-refundable deposit required',
                'Remaining balance due on party day',
                'Limited availability — advance booking encouraged!',
              ].map((item) => (
                <li key={item} className="text-[#3a4a6a] text-sm flex gap-2">
                  <span className="text-[#7ab3e8] mt-0.5 flex-shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <Link
            to="/birthday-booking"
            className="block w-full bg-brand-red text-white text-center font-bold py-3 rounded-md hover:bg-red-700 transition-colors"
          >
            Book Your Party →
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
