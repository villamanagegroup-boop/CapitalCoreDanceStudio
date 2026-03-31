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

const SCHEDULE = [
  {
    day: 'Monday',
    classes: [
      { name: 'Private Lessons', time: '4:00 PM – 5:00 PM', ages: 'Ages 2–99', price: 'Contact for pricing' },
      { name: 'Tiny Ballet + Tumble', time: '5:00 PM – 5:30 PM', ages: 'Ages 2–5', price: '$65/mo' },
      { name: 'Ballet + Modern/Contemporary', time: '5:30 PM – 6:15 PM', ages: 'Ages 4–17 · Beg–Adv', price: '$85/mo' },
      { name: 'Jazz + Acro Arts', time: '5:30 PM – 6:15 PM', ages: 'Ages 4–17 · Beg–Adv', price: '$85/mo' },
      { name: 'Ballet + Jazz', time: '6:15 PM – 7:00 PM', ages: 'Ages 4–17 · Beg–Novice', price: '$85/mo' },
      { name: 'Lyrical + Acro Arts', time: '6:15 PM – 7:15 PM', ages: 'Ages 6–17 · Beg–Adv', price: '$105/mo' },
      { name: 'Ballet Tech + Pre/Pointe', time: '7:15 PM – 8:15 PM', ages: 'Ages 6–18 · Novice–Adv', price: '$105/mo' },
    ],
  },
  {
    day: 'Tuesday',
    classes: [
      { name: 'Irish Dance', time: '5:30 PM – 6:15 PM', ages: 'Ages 4–17 · Beg–Novice', price: '$85/mo' },
      { name: 'Ballet + Hip Hop', time: '6:15 PM – 7:15 PM', ages: 'Ages 4–17 · Beg–Novice', price: '$85/mo' },
      { name: 'Irish Dance', time: '7:15 PM – 8:00 PM', ages: 'Ages 6–17 · Int–Adv', price: '$85/mo' },
    ],
  },
  {
    day: 'Wednesday',
    classes: [
      { name: 'Tiny Ballet + Tap', time: '5:30 PM – 6:00 PM', ages: 'Ages 2–5', price: '$65/mo' },
      { name: 'Adult Ballet + Tap', time: '6:45 PM – 7:30 PM', ages: 'Ages 16+ · Beg–Adv', price: '$85/mo' },
    ],
  },
  {
    day: 'Thursday',
    classes: [
      { name: 'Tiny Ballet + Jazz', time: '5:30 PM – 6:00 PM', ages: 'Ages 2–5', price: '$65/mo' },
      { name: 'Ballet + Tap', time: '6:00 PM – 6:45 PM', ages: 'Ages 4–17 · Beg–Novice', price: '$85/mo' },
      { name: 'Pom Pom + Cheer Dance', time: '6:45 PM – 7:30 PM', ages: 'Ages 4–17 · Beg–Adv', price: '$85/mo' },
      { name: 'Tumble Techniques', time: '7:30 PM – 8:15 PM', ages: 'Ages 6–17 · Beg–Adv', price: '$85/mo' },
    ],
  },
  {
    day: 'Friday',
    classes: [
      { name: 'Tiny Ballet + Tumble', time: '5:30 PM – 6:00 PM', ages: 'Ages 2–5', price: '$65/mo' },
      { name: 'Musical Theatre', time: '5:30 PM – 6:15 PM', ages: 'Ages 6–17 · Beg–Adv', price: '$85/mo' },
      { name: 'Hip Hop + Breakdancing', time: '6:15 PM – 7:00 PM', ages: 'Ages 5–17 · Beg–Adv', price: '$85/mo' },
      { name: 'Adult Modern/Contemporary + Jazz', time: '7:00 PM – 8:00 PM', ages: 'Ages 16+ · Beg–Adv', price: '$85/mo' },
    ],
  },
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
            Spring 2026 Schedule
          </p>
          <h2 className="text-navy-dark text-2xl font-black mb-8">
            Find the right class for your dancer
          </h2>

          <div className="flex flex-col gap-10">
            {SCHEDULE.map(({ day, classes }) => (
              <div key={day}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-navy-dark font-black text-lg">{day}</div>
                  <div className="flex-1 h-px bg-surface-border" />
                </div>
                <div className="flex flex-col gap-3">
                  {classes.map(({ name, time, ages, price }, i) => (
                    <div
                      key={`${day}-${name}-${time}`}
                      className={`border border-surface-border border-l-4 ${ACCENT_COLORS[i % ACCENT_COLORS.length]} rounded-lg px-5 py-4 flex items-center justify-between gap-4`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-navy-dark font-bold text-base">{name}</div>
                        <div className="text-[#5a6a8a] text-sm mt-0.5">{ages}</div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-[#7ab3e8] text-sm font-medium">{time}</div>
                        <div className="text-brand-red text-xs font-bold mt-0.5">{price}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <Link
            to="/contact"
            className="mt-10 block w-full bg-navy-dark text-white text-center font-bold py-3 rounded-md hover:bg-navy-mid transition-colors"
          >
            Enroll Now
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
