import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import PageHeader from '../components/PageHeader'
import Footer from '../components/Footer'

const ACCENT_COLORS = [
  'border-brand-red',
  'border-[#7ab3e8]',
  'border-[#f4a8b4]',
  'border-[#f4a060]',
]

const CAMPS = [
  {
    name: 'Summer Intensive',
    season: 'Summer',
    ages: 'Ages 6–16',
    description: 'A week-long deep dive into technique, choreography, and performance. Students work with instructors to prepare a showcase piece.',
  },
  {
    name: 'Holiday Camp',
    season: 'Winter Break',
    ages: 'Ages 4–12',
    description: 'Three days of festive dance fun during winter break. Holiday-themed routines, crafts, and a mini performance for parents.',
  },
  {
    name: 'Spring Break Camp',
    season: 'Spring Break',
    ages: 'Ages 5–14',
    description: 'Keep the momentum going over spring break. A mix of styles, games, and creative movement in a fun, relaxed setting.',
  },
]

export default function Camps() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <PageHeader
        eyebrow="Capital Core Dance"
        title="Camps"
        subtitle="Immersive multi-day camps packed with dance, creativity, and fun. Perfect for school breaks and summer schedules."
      />

      <section className="bg-white flex-1 px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <p className="text-brand-red text-xs font-bold tracking-[0.3em] uppercase mb-2">
            Upcoming Camps
          </p>
          <h2 className="text-navy-dark text-2xl font-black mb-8">
            Keep dancing all year long
          </h2>

          <div className="flex flex-col gap-4">
            {CAMPS.map(({ name, season, ages, description }, i) => (
              <div
                key={name}
                className={`border border-surface-border border-l-4 ${ACCENT_COLORS[i % ACCENT_COLORS.length]} rounded-lg px-5 py-4`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="font-bold text-navy-dark text-base">{name}</div>
                  <div className="text-[#7ab3e8] text-sm font-medium whitespace-nowrap">{season}</div>
                </div>
                <div className="text-[#5a6a8a] text-sm mt-0.5 mb-2">{ages}</div>
                <p className="text-[#3a4a6a] text-sm leading-relaxed">{description}</p>
              </div>
            ))}

            <div className="border border-dashed border-surface-border rounded-lg px-5 py-4 text-center">
              <p className="text-[#8a9aaa] text-sm">More camps added each season</p>
            </div>
          </div>

          <Link
            to="/contact"
            className="mt-8 block w-full bg-brand-red text-white text-center font-bold py-3 rounded-md hover:bg-red-700 transition-colors"
          >
            Register Now
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
