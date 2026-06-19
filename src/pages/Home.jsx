import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import InstagramBanner from '../components/InstagramBanner'
import SEO from '../components/SEO'
import { localBusinessSchema } from '../lib/schema'

const SECTION_CARDS = [
  {
    to: '/summer-classes',
    title: 'Classes',
    subtitle: 'Summer 2026 · June 23 – July 30',
    photo: '/card-classes.jpg',
    imageAlt: 'Kids dance classes at Capital Core Dance Studio in Midlothian, VA',
    description:
      'Six weeks of summer ballet, hip hop, jazz, tap, contemporary, and tumble for ages 2 through teen. Per-class, Flex Pass, or drop-in.',
    linkLabel: 'View Summer Classes',
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
    to: '/adult-summer-series',
    title: 'Adult Dance',
    subtitle: 'Move. Connect. Grow.',
    photo: '/card-adult-dance.jpg',
    imageAlt: 'Women dancing together in an adult movement class at Capital Core Dance Studio',
    description:
      'A 90-minute Monday-night movement series for women — Throwback Flow, Femme Flow, and Calm Confidence. Beginner friendly. $25 drop-in or $120 series pass.',
    linkLabel: 'Register Now',
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
              to="/summer-classes"
              className="bg-brand-red text-white font-bold px-8 py-3 rounded-md hover:bg-red-700 transition-colors"
            >
              Explore Summer Classes
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

      {/* Flyers */}
      {/*
        Birthday Parties tile is hidden during the June 2026 studio-birthday
        promo (we feature the June birthday flyer in its own pink side-by-side
        card below). To restore — when the user says "add the birthday flyer
        back" — re-insert this entry into the array before Summer Camps:

        {
          to: '/birthdays',
          img: '/flyer-birthday-parties.png',
          alt: 'Kids dance birthday party packages starting at $199 — Capital Core Dance Studio',
          imgClass: 'object-cover',
          title: 'Birthday Parties',
          subtitle: 'Private packages from $199',
          accent: 'text-[#c0392b]',
        },

        Then bump `lg:grid-cols-3` below to 4.

        The Recital Shop tile that used to lead this grid was removed after the
        June 2026 recital wrapped.
      */}
      <section className="py-10 px-6" style={{ backgroundColor: '#ede0fa' }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              to: '/camps',
              img: '/flyer-summer-camps.png',
              alt: 'Summer 2026 dance camps — eight themed weeks for ages 4–13, $50 deposit reserves your spot — Capital Core Dance Studio Midlothian VA',
              imgClass: 'object-cover',
              title: 'Summer Camps',
              subtitle: '8 themed weeks · ages 4–13',
              accent: 'text-[#7a4ed8]',
            },
            {
              to: '/summer-classes',
              img: '/flyer-summer-dance-classes.png',
              alt: 'Summer dance classes June 23 to July 30, 6 weeks — ballet, tap, hip hop, jazz, contemporary, tumble — Capital Core Dance Studio Midlothian VA',
              imgClass: 'object-contain',
              imgStyle: { background: 'linear-gradient(to bottom, #ffffff 50%, #0d1b36 50%)' },
              title: 'Summer Classes',
              subtitle: '6 weeks · June 23 – July 30',
              accent: 'text-[#c0392b]',
            },
            {
              to: '/adult-summer-series',
              img: '/flyer-adult-summer-series.png',
              alt: 'Adult Summer Series — a 90-minute movement experience for women — Throwback Flow, Femme Flow, Calm Confidence — Mondays 6 to 7:30 PM — Capital Core Dance Studio Midlothian VA',
              imgClass: 'object-cover',
              title: 'Adult Summer Series',
              subtitle: 'For women · registration open',
              accent: 'text-[#7a3e42]',
            },
          ].map(({ to, img, alt, imgClass, imgStyle, title, subtitle, accent }) => (
            <Link key={to} to={to} className="group flex flex-col">
              <img
                src={img}
                alt={alt}
                className={`w-full aspect-square ${imgClass} rounded-xl shadow-md group-hover:shadow-lg transition-shadow`}
                style={imgStyle}
              />
              <div className="text-center mt-3 px-1">
                <p className={`font-black text-sm tracking-wide uppercase leading-tight ${accent}`}>
                  {title}
                </p>
                <p className="text-navy-dark/70 text-xs mt-1 leading-snug">{subtitle}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* June Birthday Special announcement */}
      <section className="px-6 py-10" style={{ backgroundColor: '#fff5f8' }}>
        <div className="max-w-xl mx-auto">

          {/* June Birthday Special */}
          <div className="flex flex-col rounded-2xl bg-gradient-to-br from-[#fff0f6] via-[#ffd6e7] to-[#fff0f6] border border-[#f4c8d4] overflow-hidden shadow-md">
            <img
              src="/flyer-june-birthday-special.png"
              alt="Capital Core Dance is turning 1 — June birthday party special: 50% off a package or two free upgrades"
              className="w-full aspect-square object-cover"
              loading="lazy"
            />
            <div className="p-6 text-center md:text-left flex flex-col flex-1">
              <p className="text-[#d6336c] text-[11px] font-black tracking-[0.4em] uppercase mb-2">
                All June Long
              </p>
              <h2 className="text-navy-dark text-xl md:text-2xl font-black leading-tight">
                We're turning 1 — <span className="text-[#d6336c]">let's celebrate!</span>
              </h2>
              <p className="text-[#3a4a6a] text-sm mt-3 leading-relaxed flex-1">
                Every party booked in June gets your pick:
                <span className="font-bold text-[#d6336c]"> 50% off a birthday package</span> or
                <span className="font-bold text-[#d6336c]"> two free upgrades</span>. Schedule
                for any future available date — book in June to lock in the deal.
              </p>
              <Link
                to="/birthday-booking"
                className="inline-block self-center md:self-start mt-5 bg-[#d6336c] text-white font-bold px-7 py-3 rounded-md hover:bg-[#b82658] transition-colors text-sm tracking-wide"
              >
                Book Your Party →
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* First class free banner */}
      <section className="px-6 py-4" style={{ backgroundColor: '#daf0f7' }}>
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-center sm:text-left">
            <p className="text-navy-dark font-black text-lg leading-snug">Your first class is always FREE.</p>
            <p className="text-[#3a6a8a] text-sm mt-0.5">Come try us out — code <span className="font-bold tracking-wider">TRYITFREE</span> covers your trial.</p>
          </div>
          <Link
            to="/summer-classes/signup?promo=TRYITFREE"
            className="flex-shrink-0 bg-navy-dark text-white text-sm font-bold px-6 py-2 rounded-md hover:bg-navy-mid transition-colors whitespace-nowrap"
          >
            Register for a Trial →
          </Link>
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

      <InstagramBanner />
      <Footer />
    </div>
  )
}
