import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import PageHeader from '../components/PageHeader'
import Footer from '../components/Footer'

const PACKAGES = [
  {
    name: 'Mini Dancer Party',
    price: 'Starting at $TBD',
    ages: 'Ages 3–6',
    accent: 'border-[#f4a8b4]',
    includes: [
      '60-minute guided dance class for up to 10 guests',
      'Party host and music',
      'Studio decorated for the occasion',
    ],
  },
  {
    name: 'Studio Star Party',
    price: 'Starting at $TBD',
    ages: 'Ages 5–12',
    accent: 'border-[#f4a060]',
    includes: [
      '90-minute dance class for up to 15 guests',
      'Custom choreography routine',
      'Party host, music, and decorations',
      'Performance for parents at the end',
    ],
  },
  {
    name: 'VIP Dance Bash',
    price: 'Starting at $TBD',
    ages: 'All ages',
    accent: 'border-brand-red',
    includes: [
      '2-hour full studio rental for up to 20 guests',
      'Two instructors',
      'Custom routine + freestyle time',
      'Full decoration setup',
      'Parent showcase performance',
    ],
  },
]

export default function Birthdays() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <PageHeader
        eyebrow="Capital Core Dance"
        title="Birthdays"
        subtitle="Celebrate in style at the studio! Custom dance party packages for kids of all ages. Unforgettable memories guaranteed."
      />

      <section className="bg-white flex-1 px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <p className="text-brand-red text-xs font-bold tracking-[0.3em] uppercase mb-2">
            Party Packages
          </p>
          <h2 className="text-navy-dark text-2xl font-black mb-8">
            Celebrate at the studio
          </h2>

          <div className="flex flex-col gap-6">
            {PACKAGES.map(({ name, price, ages, accent, includes }) => (
              <div
                key={name}
                className={`border border-surface-border border-l-4 ${accent} rounded-lg px-5 py-5`}
              >
                <div className="flex items-start justify-between gap-4 mb-1">
                  <div className="font-black text-navy-dark text-lg">{name}</div>
                  <div className="text-[#f4a8b4] text-sm font-semibold whitespace-nowrap">{price}</div>
                </div>
                <div className="text-[#5a6a8a] text-sm mb-3">{ages}</div>
                <ul className="flex flex-col gap-1">
                  {includes.map((item) => (
                    <li key={item} className="text-[#3a4a6a] text-sm flex gap-2">
                      <span className="text-[#f4a8b4] mt-0.5">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <Link
            to="/contact"
            className="mt-8 block w-full bg-brand-red text-white text-center font-bold py-3 rounded-md hover:bg-red-700 transition-colors"
          >
            Book a Party
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
