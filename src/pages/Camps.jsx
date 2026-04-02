import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import PageHeader from '../components/PageHeader'
import Footer from '../components/Footer'
import SEO from '../components/SEO'

const ACCENT_COLORS = [
  'border-brand-red',
  'border-[#7ab3e8]',
  'border-[#f4a8b4]',
  'border-[#f4a060]',
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
        title="Summer Dance Camps 2026 | Capital Core Dance Studio – Midlothian, VA"
        description="Immersive summer dance camps for kids ages 4–13 in Midlothian, VA. Eight themed weeks of dance, creativity, and fun. Monday–Friday, June through August 2026."
        canonical="/camps"
      />
      <Navbar />
      <PageHeader
        eyebrow="Capital Core Dance"
        title="Summer Camps 2026"
        subtitle="Eight themed weeks of dance, creativity, and fun — Monday through Friday, 9:30 AM to 3:30 PM. Ages 4–13."
      />

      {/* CertifiKid Banner */}
      <section className="px-6 py-4" style={{ backgroundColor: '#ecc9ff' }}>
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-center sm:text-left">
            <p className="text-navy-dark font-black text-lg leading-snug">Save on summer camp with CertifiKid!</p>
            <p className="text-navy-dark/70 text-sm mt-0.5">Exclusive deals available for our families.</p>
          </div>
          <a
            href="https://www.certifikid.com/deal/78855/capital-core-dance-summer-camp"
            target="_blank"
            rel="noreferrer"
            className="flex-shrink-0 bg-navy-dark text-white text-sm font-bold px-6 py-2 rounded-md hover:bg-navy-mid transition-colors whitespace-nowrap"
          >
            Get the Deal →
          </a>
        </div>
      </section>

      <section className="bg-white flex-1 px-6 py-12">
        <div className="max-w-3xl mx-auto">

          {/* Info bar */}
          <div className="bg-[#f0f6ff] border border-[#c8ddf4] rounded-lg px-5 py-4 mb-8 flex flex-col gap-2 text-sm text-[#3a4a6a]">
            <div className="flex flex-wrap gap-x-6 gap-y-1">
              <span><span className="font-bold">Schedule:</span> M–F, 9:30 AM – 3:30 PM</span>
              <span><span className="font-bold">Ages:</span> 4–13</span>
              <span><span className="font-bold">Before &amp; Aftercare</span> available ($15/hr per day)</span>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-1 mt-1">
              <span><span className="font-bold">Current dancers</span> (Fall 2025 / Spring 2026): <span className="text-brand-red font-bold">$205 / week</span></span>
              <span><span className="font-bold">Non-studio campers:</span> <span className="font-bold">$185 / week</span></span>
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
                    <span className="text-[#8a9aaa] text-xs font-bold uppercase tracking-widest mr-2">Week {week}</span>
                    <span className="text-[#5a6a8a] text-xs">{dates}</span>
                  </div>
                </div>
                <div className="font-bold text-navy-dark text-base mt-1 mb-2">{theme}</div>
                <p className="text-[#3a4a6a] text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>

          <a
            href="https://portal.iclasspro.com/capitalcoredance/camps/1?sortBy=time"
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
