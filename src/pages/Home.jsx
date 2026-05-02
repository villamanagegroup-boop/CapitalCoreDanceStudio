import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import { localBusinessSchema } from '../lib/schema'

const SECTION_CARDS = [
  {
    to: '/classes',
    title: 'Classes',
    subtitle: 'Year-round instruction',
    photo: '/card-classes.jpg',
    imageAlt: 'Kids dance classes at Capital Core Dance Studio in Midlothian, VA',
    description:
      'Ballet, jazz, hip hop, and more for all ages and skill levels. Weekly sessions in a supportive, energetic environment.',
    linkLabel: 'View Classes',
  },
  {
    to: '/camps',
    title: 'Camps',
    subtitle: 'Summer & holiday',
    photo: '/card-camps.jpg',
    imageAlt: 'Kids participating in summer dance camp at Capital Core Dance Studio',
    description:
      'Immersive multi-day camps packed with dance, creativity, and fun. Perfect for school breaks and summer schedules.',
    linkLabel: 'View Camps',
  },
  {
    to: '/birthdays',
    title: 'Birthdays',
    subtitle: 'Party packages',
    photo: '/card-birthdays.jpg',
    imageAlt: 'Kids dance birthday party at Capital Core Dance Studio in Midlothian',
    description:
      'Celebrate in style at the studio! Custom dance party packages for kids of all ages. Unforgettable memories guaranteed.',
    linkLabel: 'View Packages',
  },
  {
    to: '/mini-series',
    title: 'Mini Series',
    subtitle: 'Spring 2026',
    photo: '/card-mini-series.jpg',
    imageAlt: 'Spring Mini Series dance classes at Capital Core Dance Studio',
    description:
      'Short-term class series combining two styles into one fun session. A low-commitment way to try something new this spring.',
    linkLabel: 'View Mini Series',
  },
  {
    to: '/recital',
    title: 'Recital',
    subtitle: 'Annual showcase',
    photo: '/card-recital.jpg',
    imageAlt: 'Annual dance recital performance at Capital Core Dance Studio',
    description:
      'Our annual recital is the highlight of the year — a chance for every dancer to shine on stage in front of family and friends.',
    linkLabel: 'View Recital Info',
  },
  {
    to: '/contact',
    title: 'Contact Us',
    subtitle: 'Get in touch',
    photo: '/card-contact.png',
    imageAlt: 'Contact Capital Core Dance Studio in Midlothian, VA',
    description:
      "Questions? Ready to enroll? Reach out and we'll get back to you quickly. We'd love to have your dancer join our family.",
    linkLabel: 'Contact Us',
  },
]

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Capital Core Dance Studio | Dance Classes in Midlothian, VA"
        description="Capital Core Dance Studio offers ballet, hip hop, jazz, contemporary, and tap classes for kids and adults in Midlothian, VA. Year-round programs, summer camps, birthday parties, and an annual recital. Serving Chesterfield County and Richmond."
        canonical="/"
        jsonLd={localBusinessSchema}
      />
      <Navbar />

      <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0d1b36] via-[#1a1040] to-[#5a1020] py-24 px-6 text-center">
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-brand-red opacity-[0.08] rounded-full" />
        <div className="absolute -bottom-20 -left-16 w-80 h-80 bg-[#7ab3e8] opacity-[0.06] rounded-full" />
        <div className="absolute top-8 left-16 w-2 h-2 bg-[#f4a8b4] opacity-60 rounded-full" />
        <div className="absolute bottom-12 right-20 w-1.5 h-1.5 bg-[#f4d0b8] opacity-60 rounded-full" />
        <div className="relative max-w-2xl mx-auto">
          <p className="text-[#f4a8b4] text-xs font-semibold tracking-[0.4em] uppercase mb-3">
            Midlothian, Virginia
          </p>
          <h1 className="text-white text-5xl md:text-6xl font-black tracking-tight leading-tight mb-4">
            MOVE WITH<br />
            <span className="text-[#f4a8b4]">PURPOSE</span>
          </h1>
          <p className="text-[#b8d4f0] text-base md:text-lg mb-10 leading-relaxed">
            Classes, camps, and birthday parties for dancers of all ages and skill levels.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/classes"
              className="bg-brand-red text-white font-bold px-8 py-3 rounded-md hover:bg-red-700 transition-colors"
            >
              Explore Classes
            </Link>
            <Link
              to="/birthdays"
              className="border-2 border-white/30 text-white font-semibold px-8 py-3 rounded-md hover:border-white/60 transition-colors"
            >
              Plan a Party
            </Link>
          </div>
        </div>
      </section>

      {/* Recital shop banner — cinema marquee */}
      <section className="relative px-6 py-7 bg-gradient-to-r from-[#080f1c] via-[#0d1a3a] to-[#080f1c] overflow-hidden">
        <style>{`
          .marquee-playfair { font-family: 'Playfair Display', Georgia, serif; }
          @keyframes marquee-shimmer {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          .marquee-btn {
            background: linear-gradient(135deg, #C9A84C 0%, #f4d97a 45%, #ffe89c 50%, #f4d97a 55%, #C9A84C 100%);
            background-size: 250% 250%;
            animation: marquee-shimmer 4s ease-in-out infinite;
          }
          @keyframes bulb-blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.25; }
          }
          .marquee-bulb { animation: bulb-blink 2s ease-in-out infinite; }
          .marquee-curtain-left {
            position: absolute; top: 0; left: 0; bottom: 0; width: 12%;
            background: linear-gradient(to right, rgba(130,10,10,0.5) 0%, rgba(110,10,10,0.2) 50%, transparent 100%);
            pointer-events: none;
          }
          .marquee-curtain-right {
            position: absolute; top: 0; right: 0; bottom: 0; width: 12%;
            background: linear-gradient(to left, rgba(130,10,10,0.5) 0%, rgba(110,10,10,0.2) 50%, transparent 100%);
            pointer-events: none;
          }
        `}</style>

        {/* Curtains */}
        <div className="marquee-curtain-left" />
        <div className="marquee-curtain-right" />

        {/* Top gold strip */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent" />
        {/* Marquee bulbs along top */}
        <div className="absolute top-2 left-0 right-0 flex justify-center gap-2.5 pointer-events-none">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <span
              key={i}
              className="w-1 h-1 rounded-full bg-[#C9A84C] marquee-bulb"
              style={{ animationDelay: `${i * 0.15}s`, boxShadow: '0 0 6px rgba(201,168,76,0.8)' }}
            />
          ))}
        </div>

        {/* Spotlights */}
        <div className="absolute top-1/2 -translate-y-1/2 left-1/4 w-48 h-48 bg-[#C9A84C]/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -translate-y-1/2 right-1/4 w-48 h-48 bg-[#f4a8b4]/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5 pt-3">
          <div className="text-center sm:text-left">
            <p className="text-[#C9A84C] text-[10px] font-black tracking-[0.5em] uppercase mb-1">Now Showing</p>
            <p className="marquee-playfair italic text-white text-2xl md:text-3xl font-black leading-tight">
              A Night at the Cinema
            </p>
            <p className="text-white/55 text-xs mt-1.5 tracking-wide">
              Annual Recital · Tickets, Programs &amp; T-Shirts
            </p>
          </div>
          <Link
            to="/recitalshop"
            className="relative flex-shrink-0 marquee-btn text-[#0B1F3A] text-sm font-black px-7 py-3 rounded-lg shadow-2xl shadow-[#C9A84C]/30 hover:scale-105 transition-transform tracking-widest uppercase whitespace-nowrap"
          >
            Enter Shop →
          </Link>
        </div>

        {/* Bottom gold strip */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent" />
      </section>

      {/* Flyers */}
      <section className="py-10 px-6" style={{ backgroundColor: '#ede0fa' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Link to="/mini-series">
            <img src="/flyer-mini-series.png" alt="Spring 2026 Mini Series dance classes flyer — Capital Core Dance Studio Midlothian VA" className="w-full rounded-xl shadow-md hover:shadow-lg transition-shadow" />
          </Link>
          <Link to="/birthdays">
            <img src="/flyer-birthday-parties.png" alt="Kids dance birthday party packages starting at $199 — Capital Core Dance Studio" className="w-full rounded-xl shadow-md hover:shadow-lg transition-shadow" />
          </Link>
          <Link to="/camps">
            <img src="/flyer-summer-camps.png" alt="Summer dance camps for ages 4 to 13 — Capital Core Dance Studio Midlothian VA" className="w-full rounded-xl shadow-md hover:shadow-lg transition-shadow" />
          </Link>
        </div>
      </section>

      {/* First class free banner */}
      <section className="px-6 py-4" style={{ backgroundColor: '#daf0f7' }}>
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-center sm:text-left">
            <p className="text-navy-dark font-black text-lg leading-snug">Your first class is always FREE.</p>
            <p className="text-[#3a6a8a] text-sm mt-0.5">Come try us out — no commitment needed.</p>
          </div>
          <a
            href="https://portal.iclasspro.com/capitalcoredance/dashboard"
            target="_blank"
            rel="noreferrer"
            className="flex-shrink-0 bg-navy-dark text-white text-sm font-bold px-6 py-2 rounded-md hover:bg-navy-mid transition-colors whitespace-nowrap"
          >
            Register for a Trial →
          </a>
        </div>
      </section>

      {/* Section intro */}
      <section className="bg-white py-12 px-6 text-center">
        <p className="text-brand-red text-xs font-bold tracking-[0.3em] uppercase mb-2">
          What We Offer
        </p>
        <h2 className="text-navy-dark text-3xl font-black">Everything your dancer needs</h2>
        <p className="text-[#5a6a8a] text-sm mt-2">
          From weekly classes to summer camps and unforgettable birthday parties
        </p>
      </section>

      {/* Section cards */}
      <section className="bg-surface-light px-6 pb-16 flex-1">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {SECTION_CARDS.map(({ to, title, subtitle, photo, imageAlt, description, linkLabel }) => (
            <Link
              key={to}
              to={to}
              className="bg-white rounded-xl overflow-hidden border border-surface-border hover:shadow-lg transition-shadow group"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={photo}
                  alt={imageAlt || title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 px-5 pb-4 text-center">
                  <div className="text-white text-lg font-black tracking-wide drop-shadow">{title}</div>
                  <div className="text-white/80 text-xs mt-0.5 drop-shadow">{subtitle}</div>
                </div>
              </div>
              <div className="p-5">
                <p className="text-[#3a4a6a] text-sm leading-relaxed mb-3">{description}</p>
                <span className="text-brand-red text-xs font-bold group-hover:underline">
                  {linkLabel} →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
      </main>

      <Footer />
    </div>
  )
}
