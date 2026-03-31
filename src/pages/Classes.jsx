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

const CLASSES = [
  { name: 'Ballet', ages: 'Ages 3+', level: 'All levels', days: 'Mon / Wed' },
  { name: 'Hip Hop', ages: 'Ages 6+', level: 'Beginner–Intermediate', days: 'Tue / Thu' },
  { name: 'Jazz', ages: 'Ages 5+', level: 'All levels', days: 'Saturday' },
  { name: 'Contemporary', ages: 'Ages 8+', level: 'Intermediate+', days: 'Thursday' },
]

export default function Classes() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <PageHeader
        eyebrow="Capital Core Dance"
        title="Classes"
        subtitle="Year-round dance instruction for all ages and skill levels in a supportive, energetic environment."
      />

      <section className="bg-white flex-1 px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <p className="text-brand-red text-xs font-bold tracking-[0.3em] uppercase mb-2">
            What We Teach
          </p>
          <h2 className="text-navy-dark text-2xl font-black mb-8">
            Find the right class for your dancer
          </h2>

          <div className="flex flex-col gap-4">
            {CLASSES.map(({ name, ages, level, days }, i) => (
              <div
                key={name}
                className={`border border-surface-border border-l-4 ${ACCENT_COLORS[i % ACCENT_COLORS.length]} rounded-lg px-5 py-4 flex items-center justify-between`}
              >
                <div>
                  <div className="text-navy-dark font-bold text-base">{name}</div>
                  <div className="text-[#5a6a8a] text-sm mt-0.5">
                    {ages} · {level}
                  </div>
                </div>
                <div className="text-[#7ab3e8] text-sm font-medium">{days}</div>
              </div>
            ))}

            <div className="border border-dashed border-surface-border rounded-lg px-5 py-4 text-center">
              <p className="text-[#8a9aaa] text-sm">More classes coming soon</p>
            </div>
          </div>

          <Link
            to="/contact"
            className="mt-8 block w-full bg-navy-dark text-white text-center font-bold py-3 rounded-md hover:bg-navy-mid transition-colors"
          >
            Enroll Now
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
