import { useState } from 'react'
import Navbar from '../components/Navbar'
import PageHeader from '../components/PageHeader'
import Footer from '../components/Footer'

const ACCENT_COLORS = [
  'border-brand-red',
  'border-[#7ab3e8]',
  'border-[#f4a8b4]',
  'border-[#f4a060]',
]

const DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

const SERIES = [
  { name: 'Tiny Ballet + Tumble (Ages 2–5)', level: 'All Levels', day: 'Monday', time: '5:00 PM – 5:30 PM', category: 'Tiny' },
  { name: 'Ballet + Modern/Contemporary', level: 'Beginner+', day: 'Monday', time: '5:30 PM – 6:15 PM', category: 'Ballet' },
  { name: 'Jazz + Acro Arts', level: 'Beginner+', day: 'Monday', time: '5:30 PM – 6:15 PM', category: 'Jazz' },
  { name: 'Ballet + Jazz', level: 'Beginner+', day: 'Monday', time: '6:15 PM – 7:15 PM', category: 'Ballet' },
  { name: 'Lyrical + Acro Arts', level: 'Beginner+', day: 'Monday', time: '6:15 PM – 7:15 PM', category: 'Lyrical' },
  { name: 'Irish Dance', level: 'Beginner – Novice', day: 'Tuesday', time: '5:30 PM – 6:15 PM', category: 'Irish Dance' },
  { name: 'Ballet + Hip Hop', level: 'Beginner – Novice', day: 'Tuesday', time: '6:15 PM – 7:15 PM', category: 'Ballet' },
  { name: 'Tiny Ballet + Tap (Ages 2–5)', level: 'All Levels', day: 'Wednesday', time: '5:30 PM – 6:00 PM', category: 'Tiny' },
  { name: 'Ballet + Tap', level: 'Beginner – Novice', day: 'Thursday', time: '6:00 PM – 6:45 PM', category: 'Ballet' },
  { name: 'Pom Pom + Cheer Dance', level: 'Beginner+', day: 'Thursday', time: '6:45 PM – 7:30 PM', category: 'Cheer' },
  { name: 'Tumble Techniques', level: 'All Levels', day: 'Thursday', time: '7:30 PM – 8:15 PM', category: 'Tumble' },
  { name: 'Musical Theatre', level: 'Beginner – Advanced', day: 'Friday', time: '5:30 PM – 6:15 PM', category: 'Musical Theatre' },
  { name: 'Tiny Ballet + Tap (Ages 2–5)', level: 'All Levels', day: 'Friday', time: '5:30 PM – 6:00 PM', category: 'Tiny' },
  { name: 'Hip Hop + Breakdancing', level: 'Beginner – Advanced', day: 'Friday', time: '6:15 PM – 7:00 PM', category: 'Hip Hop' },
]

const DAYS = ['All Days', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
const CATEGORIES = ['All Styles', 'Ballet', 'Hip Hop', 'Irish Dance', 'Jazz', 'Lyrical', 'Musical Theatre', 'Cheer', 'Tiny', 'Tumble']

function FilterSelect({ label, options, value, onChange }) {
  return (
    <div className="flex flex-col gap-1 min-w-0">
      <label className="text-[#8a9aaa] text-[10px] font-bold uppercase tracking-wider">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="bg-white border border-surface-border rounded px-3 py-2 text-sm text-navy-dark focus:outline-none focus:ring-2 focus:ring-[#7ab3e8]"
      >
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  )
}

export default function MiniSeries() {
  const [selectedDay, setSelectedDay] = useState('All Days')
  const [selectedCategory, setSelectedCategory] = useState('All Styles')

  const filtered = SERIES.filter(s => {
    const dayMatch = selectedDay === 'All Days' || s.day === selectedDay
    const catMatch = selectedCategory === 'All Styles' || s.category === selectedCategory
    return dayMatch && catMatch
  })

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <PageHeader
        eyebrow="Capital Core Dance"
        title="Mini Series"
        subtitle="Short-term class series combining two styles into one fun session. April 6 – May 15, 2026."
      />

      {/* Filter bar */}
      <div className="bg-surface-light border-b border-surface-border px-6 py-4 sticky top-16 z-40">
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FilterSelect label="Day" options={DAYS} value={selectedDay} onChange={setSelectedDay} />
            <FilterSelect label="Dance Style" options={CATEGORIES} value={selectedCategory} onChange={setSelectedCategory} />
          </div>
        </div>
      </div>

      <section className="bg-white flex-1 px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <p className="text-brand-red text-xs font-bold tracking-[0.3em] uppercase mb-2">
            Spring 2026
          </p>
          <h2 className="text-navy-dark text-2xl font-black mb-2">
            Try something new this spring
          </h2>
          <p className="text-[#5a6a8a] text-sm mb-8">
            Co-ed · Studio A · Max 20 per class · Registration open through May 15
          </p>

          {filtered.length === 0 ? (
            <p className="text-[#8a9aaa] text-sm text-center py-12">No classes match your filters.</p>
          ) : (
            <div className="flex flex-col gap-6">
              {DAY_ORDER.filter(day => filtered.some(s => s.day === day)).map(day => (
                <div key={day}>
                  <h3 className="text-navy-dark font-black text-sm uppercase tracking-widest mb-3 border-b border-surface-border pb-2">{day}</h3>
                  <div className="flex flex-col gap-3">
                    {filtered.filter(s => s.day === day).map(({ name, level, time }, i) => (
                      <div
                        key={`${name}-${day}`}
                        className={`border border-surface-border border-l-4 ${ACCENT_COLORS[i % ACCENT_COLORS.length]} rounded-lg px-5 py-4 flex items-center justify-between gap-4`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="text-navy-dark font-bold text-base">{name}</div>
                          <div className="text-[#5a6a8a] text-sm mt-0.5">{level}</div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-[#7ab3e8] text-sm font-medium">{time}</div>
                          <div className="text-brand-red text-xs font-bold mt-0.5">$165</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <a
            href="https://portal.iclasspro.com/capitalcoredance/camps/10?sortBy=time"
            target="_blank"
            rel="noreferrer"
            className="mt-8 block w-full bg-brand-red text-white text-center font-bold py-3 rounded-md hover:bg-red-700 transition-colors"
          >
            Register Now
          </a>
        </div>
      </section>

      <Footer />
    </div>
  )
}
