import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import { supabase } from '../lib/supabase'
import { localBusinessSchema } from '../lib/schema'

function SpiritWeekIdeaForm() {
  const [idea, setIdea] = useState('')
  const [submitterName, setSubmitterName] = useState('')
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!idea.trim()) return
    setStatus('submitting')
    setErrorMsg('')

    const { error } = await supabase.from('spirit_week_ideas').insert([
      {
        idea: idea.trim(),
        submitter_name: submitterName.trim() || null,
      },
    ])

    if (error) {
      setStatus('error')
      setErrorMsg('Something went wrong. Please try again or email info@capitalcoredance.com.')
      return
    }

    fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        formType: 'spirit_week_idea',
        idea: idea.trim(),
        submitterName: submitterName.trim(),
      }),
    }).catch(() => {})

    setStatus('success')
    setIdea('')
    setSubmitterName('')
  }

  if (status === 'success') {
    return (
      <div className="mt-5 bg-white border border-[#e8d8a8] rounded-lg px-5 py-4 text-center md:text-left">
        <p className="text-[#b88820] font-black text-base">Got it — thank you!</p>
        <p className="text-[#3a4a6a] text-sm mt-1">Your idea is in. We'll work the best ones into Spirit Week.</p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="text-[#b88820] text-xs font-bold hover:underline mt-2"
        >
          Submit another idea
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3" aria-label="Spirit Week idea submission">
      <textarea
        id="spirit-week-idea"
        rows={3}
        placeholder="Your idea (e.g. 'twin day with their favorite teacher')"
        required
        value={idea}
        onChange={(e) => setIdea(e.target.value)}
        className="w-full bg-white text-navy-dark placeholder:text-[#8a9aaa] border border-[#d9c478] focus:border-[#b88820] focus:ring-1 focus:ring-[#b88820] rounded-md px-4 py-2.5 text-sm resize-none focus:outline-none"
      />
      <input
        id="spirit-week-name"
        type="text"
        placeholder="Your name (optional)"
        value={submitterName}
        onChange={(e) => setSubmitterName(e.target.value)}
        className="w-full bg-white text-navy-dark placeholder:text-[#8a9aaa] border border-[#d9c478] focus:border-[#b88820] focus:ring-1 focus:ring-[#b88820] rounded-md px-4 py-2.5 text-sm focus:outline-none"
      />
      {status === 'error' && (
        <p className="text-brand-red text-xs">{errorMsg}</p>
      )}
      <button
        type="submit"
        disabled={status === 'submitting' || !idea.trim()}
        className="bg-navy-dark text-white text-sm font-black px-6 py-3 rounded-md hover:bg-navy-mid transition-colors tracking-wide disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === 'submitting' ? 'Sending…' : 'Submit Idea →'}
      </button>
    </form>
  )
}

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
    subtitle: 'Move For Confidence',
    photo: '/card-adult-dance.jpg',
    imageAlt: 'Women dancing together in an adult movement class at Capital Core Dance Studio',
    description:
      'A boutique summer movement series for women — Calm Confidence, Throwback Flow, and Femme Flow. Beginner friendly, supportive community.',
    linkLabel: 'View Adult Series',
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
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {[
            {
              to: '/recitalshop',
              img: '/flyer-night-at-the-cinema.png',
              alt: 'A Night at the Cinema — Spring Recital tickets on sale, June 13 2026 at Richmond Christian School — Capital Core Dance Studio',
              imgClass: 'object-cover',
              title: 'Recital Shop',
              subtitle: 'A Night at the Cinema · June 13',
              accent: 'text-[#C9A84C]',
            },
            {
              to: '/birthdays',
              img: '/flyer-birthday-parties.png',
              alt: 'Kids dance birthday party packages starting at $199 — Capital Core Dance Studio',
              imgClass: 'object-cover',
              title: 'Birthday Parties',
              subtitle: 'Private packages from $199',
              accent: 'text-[#c0392b]',
            },
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
              alt: 'Adult Summer Series — Move for Confidence, Connection & Community — Calm Confidence, Throwback Flow, Femme Flow — Capital Core Dance Studio Midlothian VA',
              imgClass: 'object-cover object-top',
              title: 'Adult Summer Series',
              subtitle: 'For women · interest list open',
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

      {/* Teacher Appreciation Spirit Week banner */}
      <section className="px-6 py-10 bg-gradient-to-br from-[#fdf8ec] via-[#f7ecd0] to-[#fdf8ec]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[1.1fr_1fr] gap-6 md:gap-8 items-center">
          <img
            src="/banner-teacher-appreciation.png"
            alt="Capital Core Dance Teacher Appreciation Spirit Week — June 1 through June 5"
            className="w-full rounded-xl shadow-lg border border-[#e8d8a8]"
            loading="lazy"
          />
          <div className="text-center md:text-left">
            <p className="text-[#b88820] text-[11px] font-black tracking-[0.4em] uppercase mb-2">
              June 1 – June 5
            </p>
            <h2 className="text-navy-dark text-3xl md:text-4xl font-black leading-tight">
              We want <span className="text-[#b88820]">your ideas!</span>
            </h2>
            <p className="text-[#3a4a6a] text-sm md:text-base mt-3 leading-relaxed">
              We're celebrating the incredible instructors who inspire our dancers every day —
              and we want Spirit Week to be packed with their favorite things. What are some
              fun ways dancers can honor their teachers? Drop your ideas and we'll work them in.
            </p>
            <SpiritWeekIdeaForm />
          </div>
        </div>
      </section>

      {/* First class free banner */}
      <section className="px-6 py-4" style={{ backgroundColor: '#daf0f7' }}>
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-center sm:text-left">
            <p className="text-navy-dark font-black text-lg leading-snug">Your first class is always FREE.</p>
            <p className="text-[#3a6a8a] text-sm mt-0.5">Come try us out — no commitment needed.</p>
          </div>
          <Link
            to="/contact?interest=trial"
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

      <Footer />
    </div>
  )
}
