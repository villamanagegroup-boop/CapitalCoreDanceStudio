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

const WEEK_TEXT_COLORS = [
  'text-brand-red',
  'text-[#7ab3e8]',
  'text-[#f4a8b4]',
  'text-[#f4a060]',
]

const CAMPS = [
  {
    week: 1,
    dates: 'June 15 – June 19',
    theme: 'Rainbow Remix',
    description: 'This colorful camp celebrates self-expression through vibrant dance styles, creative crafts, and music that encourages individuality and joy.',
  },
  {
    week: 2,
    dates: 'June 22 – June 26',
    theme: 'Glow Dance Party',
    description: 'A high-energy experience featuring neon crafts, upbeat choreography, and a glowing dance celebration that lights up the studio.',
  },
  {
    week: 3,
    dates: 'June 29 – July 3',
    theme: 'Pop Stars and Performers',
    description: 'Dancers step into the spotlight with high-energy routines, creative movement, and pop-inspired activities that build confidence and stage presence.',
  },
  {
    week: 4,
    dates: 'July 6 – July 10',
    theme: 'Around The World',
    description: 'Campers travel the globe through dance by exploring music, movement styles, and cultural rhythms from around the world.',
  },
  {
    week: 5,
    dates: 'July 13 – July 17',
    theme: 'Beach Bash Boogie',
    description: 'A fun, summer-vibe dance camp filled with upbeat routines, beach-themed crafts, and sunny, feel-good movement.',
  },
  {
    week: 6,
    dates: 'July 20 – July 24',
    theme: 'Movie Magic Dance Camp',
    description: 'Dancers bring the big screen to life with choreography inspired by favorite movie soundtracks and cinematic storytelling.',
  },
  {
    week: 7,
    dates: 'July 27 – July 31',
    theme: 'Dance & Dream Spirit Week',
    description: 'A confidence-building camp that blends expressive dance, positive affirmations, and creative activities focused on goal-setting and self-belief.',
  },
  {
    week: 8,
    dates: 'August 3 – August 7',
    theme: 'Princess and Heroes',
    description: 'Dancers bring fairytales to life through character-based movement, imaginative play, and story-driven choreography.',
  },
]

export default function Camps() {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Summer Dance Camps 2026 in Midlothian, VA | Capital Core Dance Studio"
        description="Eight themed weeks of summer dance camps for kids ages 4–13 in Midlothian, VA. Monday–Friday, 9:30 AM–3:30 PM, June through August 2026. Single days, half-days, and before/aftercare available. Serving Chesterfield County and Richmond."
        canonical="/camps"
        jsonLd={simpleBreadcrumb('Summer Camps', '/camps')}
      />
      <Navbar />
      <PageHeader
        eyebrow="Capital Core Dance"
        title="Summer Camps 2026"
        subtitle="Eight themed weeks of dance, creativity, and fun — Monday through Friday, 9:30 AM to 3:30 PM. Ages 4–13."
      />

      {/* Hero Photos */}
      <div className="grid grid-cols-2 w-full overflow-hidden" style={{ maxHeight: '210px' }}>
        <div className="relative" style={{ maxHeight: '210px' }}>
          <img
            src="/camp-hero-1.jpg"
            alt="Happy kids at Capital Core Dance Studio summer dance camp in Midlothian, VA"
            className="w-full h-full object-cover object-center"
            style={{ maxHeight: '210px' }}
          />
        </div>
        <div className="relative" style={{ maxHeight: '210px' }}>
          <img
            src="/camp-hero-2.jpg"
            alt="Kids dancing during summer dance camp at Capital Core Dance Studio"
            className="w-full h-full object-cover"
            style={{ maxHeight: '210px', objectPosition: 'center 25%' }}
          />
        </div>
      </div>

      {/* CertifiKid Banner */}
      <section className="px-6 py-4" style={{ backgroundColor: '#ecc9ff' }}>
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-center sm:text-left">
            <p className="text-navy-dark font-black text-lg leading-snug">Save $40–$60 on summer camp with CertifiKid — for each week!</p>
            <p className="text-navy-dark/70 text-sm mt-0.5">Exclusive deals available for our families.</p>
          </div>
          <Link
            to="/camp-registration?promo=CKSummer26"
            className="flex-shrink-0 bg-navy-dark text-white text-sm font-bold px-6 py-2 rounded-md hover:bg-navy-mid transition-colors whitespace-nowrap"
          >
            Get the Deal →
          </Link>
        </div>
      </section>

      <section className="bg-white flex-1 px-6 py-12">
        <div className="max-w-3xl mx-auto">

          {/* Info bar */}
          <div className="bg-[#f0f6ff] border border-[#c8ddf4] rounded-lg px-5 py-4 mb-8 flex flex-col gap-3 text-sm text-[#3a4a6a]">
            <div className="flex flex-wrap gap-x-6 gap-y-1">
              <span><span className="font-bold">Schedule:</span> M–F, 9:30 AM – 3:30 PM</span>
              <span><span className="font-bold">Ages:</span> 4–13</span>
              <span><span className="font-bold">Before &amp; Aftercare</span> available ($15/hr per day)</span>
            </div>

            <div className="pt-3 border-t border-[#c8ddf4]">
              <p className="font-bold text-navy-dark mb-2">Camp Rates</p>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-left text-[#5a6a8a]">
                      <th className="py-1 pr-3 font-semibold"></th>
                      <th className="py-1 pr-3 font-semibold">Current dancer</th>
                      <th className="py-1 font-semibold">Non-studio</th>
                    </tr>
                  </thead>
                  <tbody className="text-[#3a4a6a]">
                    <tr className="border-t border-[#c8ddf4]/60">
                      <td className="py-1 pr-3 font-bold">Full week (M–F)</td>
                      <td className="py-1 pr-3 text-brand-red font-bold">$205</td>
                      <td className="py-1 font-bold">$225</td>
                    </tr>
                    <tr className="border-t border-[#c8ddf4]/60">
                      <td className="py-1 pr-3 font-bold">Half-day full week</td>
                      <td className="py-1 pr-3 text-brand-red font-bold">$155</td>
                      <td className="py-1 font-bold">$175</td>
                    </tr>
                    <tr className="border-t border-[#c8ddf4]/60">
                      <td className="py-1 pr-3 font-bold">Single full day</td>
                      <td className="py-1 pr-3 text-brand-red font-bold">$50</td>
                      <td className="py-1 font-bold">$55</td>
                    </tr>
                    <tr className="border-t border-[#c8ddf4]/60">
                      <td className="py-1 pr-3 font-bold">Single half day</td>
                      <td className="py-1 pr-3 text-brand-red font-bold">$35</td>
                      <td className="py-1 font-bold">$40</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-[#5a6a8a] mt-2">
                "Current dancer" rates apply to families enrolled in Fall 2025 / Spring 2026 classes. Mix and match weeks, days, and half-days during registration.
              </p>
            </div>
          </div>

          <p className="text-brand-red text-xs font-bold tracking-[0.3em] uppercase mb-2">
            Summer 2026
          </p>
          <h2 className="text-navy-dark text-2xl font-black mb-8">
            Eight weeks of themed camps
          </h2>

          <div className="flex flex-col gap-4">
            {CAMPS.map(({ week, dates, theme, description }, i) => (
              <div
                key={week}
                className={`border border-surface-border border-l-4 ${ACCENT_COLORS[i % ACCENT_COLORS.length]} rounded-lg px-5 py-4`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className={`${WEEK_TEXT_COLORS[i % WEEK_TEXT_COLORS.length]} text-xs font-bold uppercase tracking-widest mr-2`}>Week {week}</span>
                    <span className="text-[#5a6a8a] text-xs">{dates}</span>
                  </div>
                </div>
                <div className="font-bold text-navy-dark text-base mt-1 mb-2">{theme}</div>
                <p className="text-[#3a4a6a] text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>

          <Link
            to="/camp-registration"
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
