import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import { eventSchema, simpleBreadcrumb } from '../lib/schema'

const RECITAL_EVENT = eventSchema({
  name: 'A Night at the Cinema — Capital Core Dance Studio Annual Recital 2026',
  description:
    "Capital Core Dance Studio's annual spring recital. All enrolled dancers perform in a cinema-themed evening of dance. General admission tickets are $25; children 3 and under are free.",
  startDate: '2026-06-13T14:00:00-04:00',
  endDate: '2026-06-13T16:00:00-04:00',
  offerUrl: 'https://capitalcoredance.com/recitalshop',
  offerPrice: '25.00',
  offerName: 'General Admission Ticket',
})

const DRESS_REHEARSAL_EVENT = eventSchema({
  name: 'Dress Rehearsal — A Night at the Cinema (Capital Core Dance Studio)',
  description: 'Dress rehearsal for the 2026 Capital Core Dance Studio annual recital, A Night at the Cinema.',
  startDate: '2026-06-12T18:00:00-04:00',
  endDate: '2026-06-12T20:00:00-04:00',
})

export default function Recital() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0B1F3A]">
      <SEO
        title="Annual Recital 2026 – A Night at the Cinema | Capital Core Dance Studio Midlothian VA"
        description="Capital Core Dance Studio presents 'A Night at the Cinema' — dress rehearsal Friday June 12 and recital Saturday June 13, 2026 at Richmond Christian School in Chesterfield, VA. All enrolled dancers perform. Tickets $25 adult, free for children 3 &amp; under."
        canonical="/recital"
        ogType="event"
        jsonLd={[
          RECITAL_EVENT,
          DRESS_REHEARSAL_EVENT,
          simpleBreadcrumb('Recital', '/recital'),
        ]}
      />
      <style>{`
        .recital-playfair { font-family: 'Playfair Display', Georgia, serif; }
        .recital-cormorant { font-family: 'Cormorant Garamond', Georgia, serif; }

        .gold-gradient {
          background: linear-gradient(135deg, #c9a84c 0%, #e8c84a 40%, #c9a84c 60%, #ddb84a 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        @keyframes recital-shop-shimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .recital-shop-btn {
          background: linear-gradient(135deg, #C9A84C 0%, #f4d97a 45%, #ffe89c 50%, #f4d97a 55%, #C9A84C 100%);
          background-size: 250% 250%;
          animation: recital-shop-shimmer 4s ease-in-out infinite;
        }

        .title-card {
          background: linear-gradient(160deg, #12203a 0%, #0f1c30 60%, #0d1828 100%);
          border: 1px solid rgba(201,168,76,0.35);
          box-shadow: 0 0 0 1px rgba(10,10,10,0.6), 0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(201,168,76,0.1);
        }

        .curtain-accent-left {
          position: absolute; top: 0; left: 0;
          width: 18%; height: 100%;
          background: linear-gradient(to right, rgba(130,10,10,0.8) 0%, rgba(110,10,10,0.4) 55%, transparent 100%);
          pointer-events: none;
        }
        .curtain-accent-right {
          position: absolute; top: 0; right: 0;
          width: 18%; height: 100%;
          background: linear-gradient(to left, rgba(130,10,10,0.8) 0%, rgba(110,10,10,0.4) 55%, transparent 100%);
          pointer-events: none;
        }
        .spotlight-glow {
          position: absolute; top: 0; left: 50%;
          transform: translateX(-50%);
          width: 60%; height: 100%;
          background: radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.07) 0%, transparent 65%);
          pointer-events: none;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fu1 { animation: fadeUp 0.7s 0.0s ease both; }
        .fu2 { animation: fadeUp 0.7s 0.2s ease both; }
        .fu3 { animation: fadeUp 0.7s 0.4s ease both; }
        .fu4 { animation: fadeUp 0.7s 0.6s ease both; }
      `}</style>

      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden flex flex-col items-center justify-center text-center px-6 py-16"
        style={{ background: 'linear-gradient(180deg, #0d1b36 0%, #0f1c2e 60%, #0d1828 100%)', minHeight: '70vh' }}
      >
        <div className="curtain-accent-left" />
        <div className="curtain-accent-right" />
        <div className="spotlight-glow" />

        <div className="relative z-10 max-w-xl mx-auto w-full">
          <p className="fu1 recital-cormorant text-[#c9a84c] text-xs tracking-[0.45em] uppercase mb-6">
            Capital Core Dance Studio Presents
          </p>

          {/* Title card */}
          <div className="fu2 title-card rounded px-8 py-8 mb-8">
            <h1 className="sr-only">A Night at the Cinema — Capital Core Dance Studio Annual Recital 2026</h1>
            <p aria-hidden="true" className="recital-playfair italic font-black gold-gradient mb-1" style={{ fontSize: 'clamp(2rem, 5vw, 2.8rem)', lineHeight: 1 }}>A</p>
            <p aria-hidden="true" className="gold-gradient recital-playfair italic font-black" style={{ fontSize: 'clamp(3.2rem, 10vw, 6rem)', lineHeight: 1.05, paddingBottom: '0.1em', marginBottom: '0.15em' }}>Night</p>
            <p className="recital-cormorant text-[#c8b890] tracking-[0.5em] uppercase text-sm font-semibold mb-3">at the</p>
            <p aria-hidden="true" className="gold-gradient recital-playfair italic font-black leading-none" style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)' }}>Cinema</p>
            <div className="w-12 h-px bg-[#c9a84c] opacity-40 mx-auto my-4" />
            <p className="recital-cormorant italic text-[#a09070] text-sm tracking-wide">
              A Celebration of Cinematic Movies, Music &amp; Dance
            </p>
          </div>

          {/* Date */}
          <div className="fu3">
            <p className="recital-playfair text-white font-bold" style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)' }}>
              June 12 – 13, 2026
            </p>
            <p className="recital-cormorant italic text-[#8a9aaa] text-sm mt-1">
              All enrolled dancers will take part in the performance
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(to right, transparent, #8b1a1a 20%, #c0392b 50%, #8b1a1a 80%, transparent)' }} />
      </section>

      {/* ── SHOW DETAILS (text only, no cards) ──────────────── */}
      <section className="bg-[#080f1c] px-6 py-14">
        <div className="max-w-2xl mx-auto text-center">
          <p className="recital-cormorant text-[#c9a84c] text-xs tracking-[0.4em] uppercase mb-6">Show Details</p>

          <div className="grid sm:grid-cols-2 gap-8 mb-8">
            <div>
              <p className="recital-cormorant text-[#c9a84c] text-[10px] tracking-[0.3em] uppercase mb-2">Dress Rehearsal</p>
              <p className="recital-playfair text-white font-bold text-lg leading-tight">Friday, June 12</p>
              <p className="text-white/60 text-sm">6:00 PM</p>
            </div>
            <div>
              <p className="recital-cormorant text-[#c9a84c] text-[10px] tracking-[0.3em] uppercase mb-2">Recital</p>
              <p className="recital-playfair text-white font-bold text-lg leading-tight">Saturday, June 13</p>
              <p className="text-white/60 text-sm">2:00 PM</p>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10">
            <p className="recital-cormorant text-[#c9a84c] text-[10px] tracking-[0.3em] uppercase mb-2">Venue</p>
            <p className="recital-playfair text-white font-bold text-base">Richmond Christian School</p>
            <p className="text-white/55 text-sm">6511 Belmont Rd, Chesterfield, VA 23832</p>
          </div>
        </div>
      </section>

      {/* ── PURCHASE CTA ─────────────────────────────────────── */}
      <section className="bg-white px-6 py-16 text-center">
        <div className="max-w-xl mx-auto">
          <p className="recital-cormorant text-[#c9a84c] text-xs font-black tracking-[0.35em] uppercase mb-3">Recital Shop</p>
          <h2 className="recital-playfair text-[#0B1F3A] text-2xl md:text-3xl font-black leading-tight mb-3">
            Purchase your ticket, shirt, and program booklet here
          </h2>
          <p className="text-gray-500 text-sm mb-8 max-w-md mx-auto">
            Adult tickets are $25 — children 3 &amp; under are free. Show programs and "A Night at the Cinema" shirts are pre-order.
          </p>
          <Link
            to="/recitalshop"
            className="recital-cormorant relative inline-block recital-shop-btn text-[#0B1F3A] font-black px-8 py-3.5 rounded-lg text-sm tracking-widest uppercase hover:scale-105 transition-transform shadow-lg shadow-[#c9a84c]/40 hover:shadow-xl hover:shadow-[#c9a84c]/60"
          >
            <span className="absolute -top-1.5 -right-1.5 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f4a8b4] opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#f4a8b4] border border-white/40" />
            </span>
            Visit the Recital Shop →
          </Link>
        </div>
      </section>

      {/* ── SUPPORT THE SHOW ─────────────────────────────────── */}
      <section className="bg-[#fdf8f0] border-t border-[#C9A84C]/20 px-6 py-14 text-center">
        <div className="max-w-xl mx-auto">
          <p className="recital-cormorant text-[#C9A84C] text-xs font-black tracking-[0.35em] uppercase mb-3">Support the Show</p>
          <h2 className="recital-playfair text-[#0B1F3A] text-2xl font-black mb-3">Volunteer or Reserve a Booklet Ad</h2>
          <p className="text-gray-500 text-sm mb-8 max-w-md mx-auto">
            Volunteers receive 20% off up to 6 adult tickets. Booklet ads are a great way to promote your business or send a personal message to your dancer.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSfgwuYcj4eoHVu3PBFjyHb2itTamObqNI5f-IRha1dEPAbYgA/viewform?usp=header"
              target="_blank"
              rel="noreferrer"
              className="recital-cormorant inline-block bg-[#0B1F3A] text-white font-black px-6 py-3 rounded-lg text-xs tracking-widest uppercase hover:bg-[#1a3055] transition-colors"
            >
              Sign Up to Volunteer
            </a>
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSfLPGV4kVW7_YGRp0iW8tYYSKAkMnZUIOFAj1xfhvvrWw5K4Q/viewform?usp=header"
              target="_blank"
              rel="noreferrer"
              className="recital-cormorant inline-block border-2 border-[#0B1F3A] text-[#0B1F3A] font-black px-6 py-3 rounded-lg text-xs tracking-widest uppercase hover:bg-[#0B1F3A] hover:text-white transition-colors"
            >
              Reserve a Booklet Ad
            </a>
          </div>
        </div>
      </section>

      {/* ── STAY TUNED (compact footer note) ─────────────────── */}
      <section className="bg-[#080f1c] px-6 py-12 text-center flex-1">
        <div className="max-w-md mx-auto">
          <p className="recital-cormorant italic text-white/45 text-sm leading-relaxed mb-4">
            Costume information and additional show details will appear here as the date approaches.
          </p>
          <Link
            to="/contact"
            className="recital-cormorant text-[#c9a84c]/70 text-xs tracking-widest uppercase font-bold hover:text-[#c9a84c] transition-colors"
          >
            Questions? Contact Us →
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
