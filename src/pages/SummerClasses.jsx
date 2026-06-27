import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import PageHeader from '../components/PageHeader'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import { simpleBreadcrumb } from '../lib/schema'

const ACCENT_COLORS = [
  'border-brand-red',
  'border-[#7ab3e8]',
  'border-[#f4a8b4]',
  'border-[#f4a060]',
]

const DAY_ACCENTS = {
  Tuesday: { text: 'text-brand-red', bg: 'bg-[#fff5f8]', border: 'border-[#f4c8d4]' },
  Wednesday: { text: 'text-[#7a4ed8]', bg: 'bg-[#f4ecff]', border: 'border-[#d7c4f4]' },
}

const SCHEDULE = [
  {
    day: 'Tuesday',
    classes: [
      { name: 'Tiny Ballet & Tumble', time: '5:30 – 6:10 PM', ages: 'Ages 2–3', duration: '40 min class', price: 120 },
      { name: 'Tumble', time: '6:10 – 7:00 PM', ages: 'Ages 6+', duration: '50 min class', price: 120 },
    ],
  },
  {
    day: 'Wednesday',
    classes: [
      { name: 'Beginner Ballet & Tap', time: '5:30 – 6:30 PM', ages: 'Ages 5–7', duration: '60 min class', price: 140 },
      { name: 'Hip Hop', time: '6:30 – 7:15 PM', ages: 'Ages 5+', duration: '45 min class', price: 120 },
      { name: 'Tik Tok Hip Hop Dance Workshop', time: '7:15 – 8:00 PM', ages: 'Ages 6+', duration: '45 min class', price: 120 },
    ],
  },
]

export default function SummerClasses() {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Summer Dance Classes 2026 in Midlothian, VA | Capital Core Dance Studio"
        description="Six-week summer dance classes June 23 – July 30 at Capital Core Dance Studio in Midlothian, VA. Ballet, hip hop, tap, and tumble for ages 2 through teen. $50 deposit reserves your dancer's spot."
        canonical="/summer-classes"
        jsonLd={simpleBreadcrumb('Summer Classes', '/summer-classes')}
      />
      <Navbar />
      <PageHeader
        eyebrow="6 Weeks of Fun · June 23 – July 30"
        title="Summer Dance Classes"
        subtitle="Tuesday and Wednesday evenings. Pick a class, grab the Flex Pass, or drop in for the week."
      />

      {/* Flyer */}
      <section className="px-6 py-8" style={{ backgroundColor: '#ede0fa' }}>
        <div className="max-w-3xl mx-auto">
          <img
            src="/flyer-summer-dance-classes.png"
            alt="Summer dance classes June 23 to July 30, 6 weeks — ballet, tap, hip hop, jazz, contemporary, tumble — Capital Core Dance Studio Midlothian VA"
            className="w-full rounded-xl shadow-lg"
          />
        </div>
      </section>

      {/* Deposit banner */}
      <section className="px-6 py-4" style={{ backgroundColor: '#daf0f7' }}>
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-center sm:text-left">
            <p className="text-navy-dark font-black text-lg leading-snug">A $50 deposit reserves their spot.</p>
            <p className="text-[#3a6a8a] text-sm mt-0.5">Deposit applies toward tuition — spaces fill fast!</p>
          </div>
          <Link
            to="/summer-classes/signup"
            className="flex-shrink-0 bg-brand-red text-white text-sm font-bold px-6 py-2 rounded-md hover:bg-red-700 transition-colors whitespace-nowrap"
          >
            Sign Up Today →
          </Link>
        </div>
      </section>

      <section className="bg-white flex-1 px-6 py-12">
        <div className="max-w-3xl mx-auto">

          {/* Pricing summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            <div className="bg-[#fff5f8] border border-[#f4c8d4] rounded-lg p-5 text-center">
              <p className="text-brand-red text-[10px] font-bold tracking-[0.3em] uppercase mb-1">Per Class</p>
              <p className="text-navy-dark font-black text-2xl">$120–$140</p>
              <p className="text-[#5a6a8a] text-xs mt-1">for the full 6 weeks</p>
            </div>
            <div className="bg-[#f4ecff] border border-[#d7c4f4] rounded-lg p-5 text-center">
              <p className="text-[#7a4ed8] text-[10px] font-bold tracking-[0.3em] uppercase mb-1">Summer Flex Pass</p>
              <p className="text-navy-dark font-black text-2xl">$329</p>
              <p className="text-[#5a6a8a] text-xs mt-1">unlimited classes · 6 weeks</p>
            </div>
            <div className="bg-[#fdf3e8] border border-[#f4d6b8] rounded-lg p-5 text-center">
              <p className="text-[#c47830] text-[10px] font-bold tracking-[0.3em] uppercase mb-1">Drop-In</p>
              <p className="text-navy-dark font-black text-2xl">$25</p>
              <p className="text-[#5a6a8a] text-xs mt-1">per class / per week</p>
            </div>
          </div>

          <p className="text-brand-red text-xs font-bold tracking-[0.3em] uppercase mb-2">
            Summer 2026 Schedule
          </p>
          <h2 className="text-navy-dark text-2xl font-black mb-8">
            June 23 – July 30 · Two evenings a week
          </h2>

          <div className="flex flex-col gap-10">
            {SCHEDULE.map(({ day, classes }) => {
              const accent = DAY_ACCENTS[day]
              return (
                <div key={day}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`text-navy-dark font-black text-lg ${accent.text}`}>{day}</div>
                    <div className="flex-1 h-px bg-surface-border" />
                  </div>
                  <div className="flex flex-col gap-3">
                    {classes.map(({ name, time, ages, duration, price }, i) => (
                      <div
                        key={`${day}-${name}-${time}`}
                        className={`border border-surface-border border-l-4 ${ACCENT_COLORS[i % ACCENT_COLORS.length]} rounded-lg px-5 py-4 flex items-center justify-between gap-4`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="text-navy-dark font-bold text-base">{name}</div>
                          <div className="text-[#5a6a8a] text-sm mt-0.5">{ages} · {duration}</div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-[#7ab3e8] text-sm font-medium">{time}</div>
                          <div className="text-brand-red text-xs font-bold mt-0.5">${price} / 6 wks</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          <Link
            to="/summer-classes/signup"
            className="mt-10 block w-full bg-brand-red text-white text-center font-bold py-3 rounded-md hover:bg-red-700 transition-colors"
          >
            Sign Up Now
          </Link>

          <div className="mt-8 bg-[#f0f6ff] border border-[#c8ddf4] rounded-lg px-5 py-4 text-sm text-[#3a4a6a]">
            <p className="font-bold text-navy-dark mb-1">Build confidence · Make friends · Love to dance!</p>
            <p>An encouraging summer of movement, memories, and joy — in a positive environment where dancers connect and support each other.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
