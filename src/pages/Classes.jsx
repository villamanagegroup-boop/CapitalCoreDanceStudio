import { useState } from 'react'
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

// ageGroups: 'tiny' (2-5), 'kids' (4-12), 'teen' (6-17), 'adult' (16+)
// category: 'tiny' | 'ballet' | 'jazz-acro' | 'hiphop' | 'irish' | 'tumble-cheer' | 'musical-theatre' | 'adult'
const SCHEDULE = [
  {
    day: 'Monday',
    classes: [
      { name: 'Tiny Ballet + Tumble', time: '5:00 PM – 5:30 PM', ages: 'Ages 2–5', price: '$65/mo', ageGroups: ['tiny'], category: 'tiny' },
      { name: 'Ballet + Modern/Contemporary', time: '5:30 PM – 6:15 PM', ages: 'Ages 4–17 · Beg–Adv', price: '$85/mo', ageGroups: ['kids', 'teen'], category: 'ballet' },
      { name: 'Jazz + Acro Arts', time: '5:30 PM – 6:15 PM', ages: 'Ages 4–17 · Beg–Adv', price: '$85/mo', ageGroups: ['kids', 'teen'], category: 'jazz-acro' },
      { name: 'Ballet + Jazz', time: '6:15 PM – 7:00 PM', ages: 'Ages 4–17 · Beg–Novice', price: '$85/mo', ageGroups: ['kids', 'teen'], category: 'ballet' },
      { name: 'Lyrical + Acro Arts', time: '6:15 PM – 7:15 PM', ages: 'Ages 6–17 · Beg–Adv', price: '$105/mo', ageGroups: ['kids', 'teen'], category: 'jazz-acro' },
      { name: 'Ballet Tech + Pre/Pointe', time: '7:15 PM – 8:15 PM', ages: 'Ages 6–18 · Novice–Adv', price: '$105/mo', ageGroups: ['teen'], category: 'ballet' },
    ],
  },
  {
    day: 'Tuesday',
    classes: [
      { name: 'Irish Dance', time: '5:30 PM – 6:15 PM', ages: 'Ages 4–17 · Beg–Novice', price: '$85/mo', ageGroups: ['kids', 'teen'], category: 'irish' },
      { name: 'Ballet + Hip Hop', time: '6:15 PM – 7:15 PM', ages: 'Ages 4–17 · Beg–Novice', price: '$85/mo', ageGroups: ['kids', 'teen'], category: 'hiphop' },
      { name: 'Irish Dance', time: '7:15 PM – 8:00 PM', ages: 'Ages 6–17 · Int–Adv', price: '$85/mo', ageGroups: ['teen'], category: 'irish' },
    ],
  },
  {
    day: 'Wednesday',
    classes: [
      { name: 'Tiny Ballet + Tap', time: '5:30 PM – 6:00 PM', ages: 'Ages 2–5', price: '$65/mo', ageGroups: ['tiny'], category: 'tiny' },
      { name: 'Adult Ballet + Tap', time: '6:45 PM – 7:30 PM', ages: 'Ages 16+ · Beg–Adv', price: '$85/mo', ageGroups: ['adult'], category: 'adult' },
    ],
  },
  {
    day: 'Thursday',
    classes: [
      { name: 'Tiny Ballet + Jazz', time: '5:30 PM – 6:00 PM', ages: 'Ages 2–5', price: '$65/mo', ageGroups: ['tiny'], category: 'tiny' },
      { name: 'Ballet + Tap', time: '6:00 PM – 6:45 PM', ages: 'Ages 4–17 · Beg–Novice', price: '$85/mo', ageGroups: ['kids', 'teen'], category: 'ballet' },
      { name: 'Pom Pom + Cheer Dance', time: '6:45 PM – 7:30 PM', ages: 'Ages 4–17 · Beg–Adv', price: '$85/mo', ageGroups: ['kids', 'teen'], category: 'tumble-cheer' },
      { name: 'Tumble Techniques', time: '7:30 PM – 8:15 PM', ages: 'Ages 6–17 · Beg–Adv', price: '$85/mo', ageGroups: ['kids', 'teen'], category: 'tumble-cheer' },
    ],
  },
  {
    day: 'Friday',
    classes: [
      { name: 'Tiny Ballet + Tumble', time: '5:30 PM – 6:00 PM', ages: 'Ages 2–5', price: '$65/mo', ageGroups: ['tiny'], category: 'tiny' },
      { name: 'Musical Theatre', time: '5:30 PM – 6:15 PM', ages: 'Ages 6–17 · Beg–Adv', price: '$85/mo', ageGroups: ['kids', 'teen'], category: 'musical-theatre' },
      { name: 'Hip Hop + Breakdancing', time: '6:15 PM – 7:00 PM', ages: 'Ages 5–17 · Beg–Adv', price: '$85/mo', ageGroups: ['kids', 'teen'], category: 'hiphop' },
      { name: 'Adult Modern/Contemporary + Jazz', time: '7:00 PM – 8:00 PM', ages: 'Ages 16+ · Beg–Adv', price: '$85/mo', ageGroups: ['adult'], category: 'adult' },
    ],
  },
]

const DAYS = ['All', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

const AGES = [
  { value: 'All', label: 'All Ages' },
  { value: 'tiny', label: 'Tiny (2–5)' },
  { value: 'kids', label: 'Kids (4–12)' },
  { value: 'teen', label: 'Teen (6–17)' },
  { value: 'adult', label: 'Adult (16+)' },
]

const CATEGORIES = [
  { value: 'All', label: 'All Styles' },
  { value: 'tiny', label: 'Tiny Classes' },
  { value: 'ballet', label: 'Ballet' },
  { value: 'jazz-acro', label: 'Jazz & Acro' },
  { value: 'hiphop', label: 'Hip Hop' },
  { value: 'irish', label: 'Irish Dance' },
  { value: 'tumble-cheer', label: 'Tumble & Cheer' },
  { value: 'musical-theatre', label: 'Musical Theatre' },
  { value: 'adult', label: 'Adult Classes' },
]

function FilterChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors whitespace-nowrap ${
        active
          ? 'bg-navy-dark text-white border-navy-dark'
          : 'bg-white text-[#3a4a6a] border-surface-border hover:border-navy-mid'
      }`}
    >
      {label}
    </button>
  )
}

function FilterRow({ label, options, selected, onSelect }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[#8a9aaa] text-xs font-bold uppercase tracking-wider w-16 flex-shrink-0">
        {label}
      </span>
      <div className="flex gap-2 flex-wrap">
        {options.map((opt) => {
          const value = typeof opt === 'string' ? opt : opt.value
          const display = typeof opt === 'string' ? opt : opt.label
          return (
            <FilterChip
              key={value}
              label={display}
              active={selected === value}
              onClick={() => onSelect(value)}
            />
          )
        })}
      </div>
    </div>
  )
}

export default function Classes() {
  const [selectedDay, setSelectedDay] = useState('All')
  const [selectedAge, setSelectedAge] = useState('All')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredSchedule = SCHEDULE
    .filter(({ day }) => selectedDay === 'All' || day === selectedDay)
    .map(({ day, classes }) => ({
      day,
      classes: classes.filter((c) => {
        const ageMatch = selectedAge === 'All' || c.ageGroups.includes(selectedAge)
        const catMatch = selectedCategory === 'All' || c.category === selectedCategory
        return ageMatch && catMatch
      }),
    }))
    .filter(({ classes }) => classes.length > 0)

  const hasResults = filteredSchedule.length > 0

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <PageHeader
        eyebrow="Capital Core Dance"
        title="Classes"
        subtitle="Year-round dance instruction for all ages and skill levels in a supportive, energetic environment."
      />

      {/* Filter bar */}
      <div className="bg-surface-light border-b border-surface-border px-6 py-4 sticky top-16 z-40">
        <div className="max-w-3xl mx-auto flex flex-col gap-3">
          <FilterRow label="Day" options={DAYS} selected={selectedDay} onSelect={setSelectedDay} />
          <FilterRow label="Age" options={AGES} selected={selectedAge} onSelect={setSelectedAge} />
          <FilterRow label="Style" options={CATEGORIES} selected={selectedCategory} onSelect={setSelectedCategory} />
        </div>
      </div>

      <section className="bg-white flex-1 px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <p className="text-brand-red text-xs font-bold tracking-[0.3em] uppercase mb-2">
            Spring 2026 Schedule
          </p>
          <h2 className="text-navy-dark text-2xl font-black mb-8">
            Find the right class for your dancer
          </h2>

          {!hasResults ? (
            <div className="border border-dashed border-surface-border rounded-lg px-6 py-10 text-center">
              <p className="text-[#8a9aaa] text-sm">No classes match your filters. Try adjusting your selection.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-10">
              {filteredSchedule.map(({ day, classes }) => (
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
          )}

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
