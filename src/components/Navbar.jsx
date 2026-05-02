import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/classes', label: 'Our Classes' },
  { to: '/camps', label: 'Summer Camps' },
  { to: '/tuition', label: 'Tuition' },
  { to: '/mini-series', label: 'Mini Series' },
  { to: '/birthdays', label: 'Birthdays' },
  { to: '/recital', label: 'Recital' },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  function linkClass(to) {
    return pathname === to
      ? 'text-[#f4a8b4] border-b-2 border-[#f4a8b4] pb-0.5'
      : 'text-[#b8d4f0] hover:text-white'
  }

  return (
    <nav className="bg-navy-dark sticky top-0 z-50">
      <style>{`
        @keyframes nav-shimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .nav-recital-btn {
          background: linear-gradient(135deg, #C9A84C 0%, #f4d97a 45%, #ffe89c 50%, #f4d97a 55%, #C9A84C 100%);
          background-size: 250% 250%;
          animation: nav-shimmer 4s ease-in-out infinite;
        }
      `}</style>
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 flex-shrink-0">
          <img src="/logo.png" alt="Capital Core Dance Studio" className="h-10 w-10 object-contain flex-shrink-0" />
          <div>
            <div className="text-white font-black text-sm tracking-widest">CAPITAL CORE</div>
            <div className="text-[#7ab3e8] text-[10px] tracking-[0.3em]">DANCE STUDIO</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6 lg:gap-7">
          {NAV_LINKS.map(({ to, label }) => (
            <Link key={to} to={to} className={`text-sm font-medium transition-colors ${linkClass(to)}`}>
              {label}
            </Link>
          ))}

          {/* Fancy Recital Shop button */}
          <Link
            to="/recitalshop"
            className="relative nav-recital-btn text-[#0B1F3A] text-xs font-black px-4 py-2 rounded-md tracking-widest uppercase shadow-lg shadow-[#C9A84C]/30 hover:shadow-xl hover:shadow-[#C9A84C]/60 hover:scale-105 transition-all whitespace-nowrap"
          >
            <span className="absolute -top-1.5 -right-1.5 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f4a8b4] opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#f4a8b4] border border-white/40" />
            </span>
            Recital Shop
          </Link>

          <Link
            to="/contact"
            className="bg-brand-red text-white text-sm font-bold px-5 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            Contact Us
          </Link>
        </div>

        {/* Hamburger button */}
        <button
          className="md:hidden text-white text-xl leading-none"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-navy-dark border-t border-navy-mid px-6 py-4 flex flex-col gap-3">
          {NAV_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={`text-sm font-medium ${pathname === to ? 'text-[#f4a8b4]' : 'text-[#b8d4f0]'}`}
            >
              {label}
            </Link>
          ))}
          <Link
            to="/recitalshop"
            onClick={() => setMenuOpen(false)}
            className="relative nav-recital-btn text-[#0B1F3A] text-xs font-black px-5 py-3 rounded-md text-center tracking-widest uppercase shadow-lg shadow-[#C9A84C]/30 mt-1"
          >
            <span className="absolute -top-1.5 -right-1.5 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f4a8b4] opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#f4a8b4] border border-white/40" />
            </span>
            Recital Shop
          </Link>
          <Link
            to="/contact"
            onClick={() => setMenuOpen(false)}
            className="bg-brand-red text-white text-sm font-bold px-5 py-2 rounded-md text-center"
          >
            Contact Us
          </Link>
        </div>
      )}
    </nav>
  )
}
