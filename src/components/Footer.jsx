import { Link } from 'react-router-dom'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/classes', label: 'Our Classes' },
  { to: '/camps', label: 'Summer Camps' },
  { to: '/tuition', label: 'Tuition' },
  { to: '/mini-series', label: 'Mini Series' },
  { to: '/birthdays', label: 'Birthdays' },
  { to: '/recital', label: 'Recital' },
  { to: '/contact', label: 'Contact Us' },
]

const PORTAL_URL = 'https://portal.iclasspro.com/capitalcoredance/dashboard'

export default function Footer() {
  return (
    <footer className="bg-navy-dark px-6 pt-10 pb-6">
      <div className="max-w-6xl mx-auto">

        {/* Main footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-[#2a3a5a]">

          {/* Studio info */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <img src="/logo.png" alt="Capital Core Dance Studio" className="h-10 w-10 object-contain flex-shrink-0" />
              <div>
                <div className="text-white font-black text-sm tracking-widest">CAPITAL CORE DANCE STUDIO</div>
                <div className="text-[#7ab3e8] text-[10px] tracking-[0.3em]">MIDLOTHIAN, VIRGINIA</div>
              </div>
            </div>
            <ul className="flex flex-col gap-2 text-[#8a9aaa] text-xs">
              <li>
                <a
                  href="https://maps.google.com/?q=13110+Midlothian+Turnpike+Midlothian+VA+23113"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  13110 Midlothian Turnpike<br />Midlothian, VA 23113
                </a>
              </li>
              <li>
                <a href="tel:8042344014" className="hover:text-white transition-colors">
                  804-234-4014
                </a>
              </li>
              <li>
                <a href="mailto:info@capitalcoredance.com" className="hover:text-white transition-colors">
                  info@capitalcoredance.com
                </a>
              </li>
            </ul>
          </div>

          {/* Nav links */}
          <div>
            <div className="text-[#5a7aaa] text-xs font-bold uppercase tracking-widest mb-4">Quick Links</div>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
              {NAV_LINKS.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-[#8a9aaa] text-xs hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Portal CTA */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="text-[#5a7aaa] text-xs font-bold uppercase tracking-widest mb-4">Student Portal</div>
              <p className="text-[#8a9aaa] text-xs mb-4 leading-relaxed">
                Manage enrollments, make payments, and access your account through our iClassPro portal.
              </p>
            </div>
            <a
              href={PORTAL_URL}
              target="_blank"
              rel="noreferrer"
              className="block bg-brand-red text-white text-center text-xs font-bold px-5 py-3 rounded-md hover:bg-red-700 transition-colors"
            >
              Enter Studio Portal →
            </a>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[#5a7aaa] text-xs">© 2026 Capital Core Dance Studio. All rights reserved.</p>
          <p className="text-[#3a4a6a] text-xs">Managed by Hicks Virtual Solutions LLC</p>
        </div>

      </div>
    </footer>
  )
}
