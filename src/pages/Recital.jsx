import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Recital() {
  return (
    <div className="min-h-screen flex flex-col bg-navy-dark">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&display=swap');

        .recital-playfair { font-family: 'Playfair Display', Georgia, serif; }
        .recital-cormorant { font-family: 'Cormorant Garamond', Georgia, serif; }

        .gold-gradient {
          background: linear-gradient(135deg, #c9a84c 0%, #e8c84a 40%, #c9a84c 60%, #ddb84a 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .title-card {
          background: linear-gradient(160deg, #12203a 0%, #0f1c30 60%, #0d1828 100%);
          border: 1px solid rgba(201,168,76,0.35);
          box-shadow: 0 0 0 1px rgba(10,10,10,0.6), 0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(201,168,76,0.1);
        }

        .curtain-accent-left {
          position: absolute;
          top: 0; left: 0;
          width: 22%;
          height: 100%;
          background: linear-gradient(to right, rgba(130,10,10,0.75) 0%, rgba(110,10,10,0.45) 50%, transparent 100%);
          pointer-events: none;
        }
        .curtain-accent-right {
          position: absolute;
          top: 0; right: 0;
          width: 22%;
          height: 100%;
          background: linear-gradient(to left, rgba(130,10,10,0.75) 0%, rgba(110,10,10,0.45) 50%, transparent 100%);
          pointer-events: none;
        }

        .spotlight-glow {
          position: absolute;
          top: 0; left: 50%;
          transform: translateX(-50%);
          width: 60%;
          height: 100%;
          background: radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.06) 0%, transparent 65%);
          pointer-events: none;
        }

        .ticket-btn-disabled {
          background: #12203a;
          border: 1px solid rgba(201,168,76,0.3);
          color: #9a8a6a;
          cursor: default;
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

      {/* Hero */}
      <section className="relative overflow-hidden flex flex-col items-center justify-center text-center px-6 py-20" style={{ background: 'linear-gradient(180deg, #0d1b36 0%, #0f1c2e 60%, #0d1828 100%)', minHeight: '88vh' }}>
        <div className="curtain-accent-left" />
        <div className="curtain-accent-right" />
        <div className="spotlight-glow" />

        <div className="relative z-10 max-w-xl mx-auto w-full">

          {/* Studio presents */}
          <p className="fu1 recital-cormorant text-[#c9a84c] text-xs tracking-[0.45em] uppercase mb-8">
            Capital Core Dance Studio Presents
          </p>

          {/* Title card */}
          <div className="fu2 title-card rounded px-8 py-10 mb-10">
            {/* "A" — large and prominent */}
            <p className="recital-playfair italic font-black gold-gradient mb-1" style={{ fontSize: 'clamp(2rem, 5vw, 2.8rem)', lineHeight: 1 }}>A</p>

            {/* "Night" with enough bottom padding so descender clears */}
            <h1 className="gold-gradient recital-playfair italic font-black" style={{ fontSize: 'clamp(3.2rem, 10vw, 6rem)', lineHeight: 1.05, paddingBottom: '0.1em', marginBottom: '0.15em' }}>
              Night
            </h1>

            {/* "at the" — clear gap from Night */}
            <p className="recital-cormorant text-[#c8b890] tracking-[0.5em] uppercase text-sm font-semibold mb-3">
              at the
            </p>

            <h2 className="gold-gradient recital-playfair italic font-black leading-none" style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)' }}>
              Cinema
            </h2>

            <div className="w-12 h-px bg-[#c9a84c] opacity-40 mx-auto my-5" />

            <p className="recital-cormorant italic text-[#a09070] text-sm tracking-wide">
              A Celebration of Cinematic Movies, Music &amp; Dance
            </p>
          </div>

          {/* Date */}
          <div className="fu3 mb-10">
            <p className="recital-cormorant text-[#7a8aaa] text-xs tracking-[0.4em] uppercase mb-2">Weekend of</p>
            <p className="recital-playfair text-white font-bold" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)' }}>
              June 12 – 14, 2026
            </p>
            <p className="recital-cormorant italic text-[#7a8aaa] text-sm mt-2">
              All enrolled dancers will take part in the performance
            </p>
          </div>

          {/* Ticket button */}
          <div className="fu4 flex flex-col items-center gap-4">
            <span className="ticket-btn-disabled recital-cormorant inline-block px-8 py-3 rounded text-sm tracking-widest uppercase select-none">
              🎟 Ticket Sales Coming Soon
            </span>
            <Link
              to="/contact"
              className="recital-cormorant italic text-[#8a9aaa] text-sm hover:text-[#b8d4f0] transition-colors underline underline-offset-4"
            >
              Questions? Contact Us
            </Link>
          </div>

        </div>

        {/* Red carpet bar at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(to right, transparent, #8b1a1a 20%, #c0392b 50%, #8b1a1a 80%, transparent)' }} />
      </section>

      {/* Info strip */}
      <section className="bg-[#0f1c30] border-t border-b border-[#1e2e4a] px-6 py-8">
        <div className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {[
            { label: 'Location', value: 'To Be Announced', sub: 'Details coming soon' },
            { label: 'Dates', value: 'June 12–14, 2026', sub: 'Weekend performances' },
            { label: 'Performers', value: 'All Enrolled Dancers', sub: 'Spring 2026 semester' },
          ].map(({ label, value, sub }) => (
            <div key={label}>
              <p className="recital-cormorant text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-1">{label}</p>
              <p className="recital-playfair text-white font-bold text-base">{value}</p>
              <p className="recital-cormorant italic text-[#7a8aaa] text-xs mt-1">{sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Coming soon details */}
      <section className="bg-navy-dark flex-1 px-6 py-16 text-center">
        <div className="max-w-md mx-auto">
          <p className="recital-cormorant text-[#c9a84c] text-xs tracking-[0.4em] uppercase mb-3">More Details</p>
          <h3 className="recital-playfair text-white font-bold italic text-2xl mb-4">Coming Soon</h3>
          <p className="recital-cormorant text-[#8a9aaa] text-base leading-relaxed italic mb-8">
            Showtime schedule, costume information, and ticket purchase links will be posted here as the date approaches. Stay tuned!
          </p>
          <Link
            to="/contact"
            className="inline-block bg-brand-red text-white text-sm font-bold px-8 py-3 rounded-md hover:bg-red-700 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
