import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import PageHeader from '../components/PageHeader'
import Footer from '../components/Footer'
import SEO from '../components/SEO'

// The three segments of every 90-minute class, in order (matches the flyer).
const SEGMENTS = [
  {
    minutes: '45 Minutes',
    title: 'Throwback Flow',
    description: 'Dance, move, and laugh to your favorite throwback hits.',
    accent: '#c9a868',
    accentInk: '#7a5a1f',
  },
  {
    minutes: '30 Minutes',
    title: 'Femme Flow',
    description: 'Build confidence through graceful, empowering movement.',
    accent: '#a83a4c',
    accentInk: '#7a1f1f',
  },
  {
    minutes: '15 Minutes',
    title: 'Calm Confidence',
    description: 'Stretch, breathe, and reconnect before heading into your weekend.',
    accent: '#7a3e42',
    accentInk: '#5a2e32',
  },
]

const ALL_CLASS_FEATURES = [
  { label: 'No Experience Needed', accent: '#f4a8b4' },
  { label: 'Just for Women', accent: '#7ab3e8' },
  { label: 'Supportive & Judgment-Free', accent: '#c9a868' },
  { label: 'A Space for You', accent: '#c0392b' },
]

export default function AdultSummerSeries() {
  return (
    <div className="min-h-screen flex flex-col bg-warm-ivory">
      <SEO
        title="Adult Summer Series · Monday-Night Movement for Women | Capital Core Dance Studio"
        description="A 90-minute movement experience for women in Midlothian, VA — Throwback Flow, Femme Flow & Calm Confidence. Mondays 6–7:30 PM, six weeks from June 29. $25 drop-in or $120 Summer Series Pass. Registration now open."
        canonical="/adult-summer-series"
      />
      <Navbar />
      <PageHeader
        eyebrow="Capital Core Dance"
        title="Adult Summer Series"
        subtitle="Move. Connect. Grow. — a 90-minute movement experience designed for women."
      />

      <main className="flex-1">
        {/* ── Hero ────────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden" style={{ backgroundColor: '#faf3eb' }}>
          <div className="absolute top-6 left-6 text-warm-gold/40 text-4xl font-script select-none pointer-events-none">❦</div>
          <div className="absolute bottom-6 right-8 text-warm-gold/30 text-3xl font-script select-none pointer-events-none">✦</div>

          <div className="max-w-4xl mx-auto px-6 py-10 sm:py-12 text-center relative">
            <p className="text-warm-burgundy font-serif italic text-xs tracking-[0.4em] uppercase mb-3">
              This Summer, Monday Nights Are About You
            </p>
            <h2 className="font-serif text-warm-ink text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[0.95]">
              A 90-MINUTE
            </h2>
            <p className="font-script text-warm-burgundy text-3xl sm:text-4xl md:text-5xl leading-tight mt-1">
              Movement Experience
            </p>

            <div className="mt-5 flex items-center justify-center gap-3">
              <div className="h-px bg-warm-mocha/40 w-10" />
              <span className="text-warm-gold text-sm">❤</span>
              <div className="h-px bg-warm-mocha/40 w-10" />
            </div>

            <p className="mt-4 text-warm-ink/85 font-serif text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              For women who want to move, connect, build confidence, and have fun in a supportive,
              judgment-free environment.
            </p>

            <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link
                to="/adult-summer-series/signup"
                className="text-warm-ink font-serif tracking-[0.25em] uppercase text-xs font-bold px-7 py-3 rounded-sm border-2 hover:shadow-xl hover:scale-[1.03] active:scale-[0.98] transition-all"
                style={{
                  background: 'linear-gradient(135deg, #f9c5cb 0%, #f4a8b4 100%)',
                  borderColor: '#e890a5',
                  boxShadow: '0 10px 24px -8px rgba(244, 168, 180, 0.65)',
                }}
              >
                Register Now →
              </Link>
              <button
                type="button"
                onClick={() => document.getElementById('segments')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className="text-warm-ink font-serif tracking-[0.2em] uppercase text-[11px] font-bold px-6 py-3 rounded-sm border-2 hover:shadow-lg hover:scale-[1.03] active:scale-[0.98] transition-all"
                style={{
                  background: 'linear-gradient(135deg, #f0d68a 0%, #c9a868 100%)',
                  borderColor: '#a8884a',
                  boxShadow: '0 8px 20px -8px rgba(201, 168, 104, 0.55)',
                }}
              >
                What's Included
              </button>
            </div>
          </div>
        </section>

        {/* ── What's in every class ───────────────────────────────────────── */}
        <section id="segments" className="bg-warm-cream py-16 sm:py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <p className="text-warm-burgundy font-serif italic tracking-[0.35em] uppercase text-xs text-center mb-2">
              Every Class Includes
            </p>
            <h2 className="text-warm-ink font-serif text-3xl sm:text-4xl font-black text-center tracking-tight mb-12">
              Three Ways to Move
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14">
              {SEGMENTS.map((s) => (
                <article key={s.title} className="flex flex-col text-center">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="h-px flex-1" style={{ backgroundColor: s.accent, opacity: 0.4 }} />
                    <span className="font-serif text-xs font-bold tracking-[0.25em] uppercase leading-none" style={{ color: s.accent }}>
                      {s.minutes}
                    </span>
                    <div className="h-px flex-1" style={{ backgroundColor: s.accent, opacity: 0.4 }} />
                  </div>

                  <h3 className="font-serif text-warm-ink text-2xl sm:text-3xl font-black tracking-tight leading-none">
                    {s.title.split(' ')[0].toUpperCase()}
                  </h3>
                  <p className="font-script text-4xl sm:text-5xl leading-tight mt-1" style={{ color: s.accent }}>
                    {s.title.split(' ').slice(1).join(' ')}
                  </p>

                  <p className="text-warm-ink/85 text-sm leading-relaxed mt-5">
                    {s.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── This series is ──────────────────────────────────────────────── */}
        <section className="py-14 px-6 border-y border-warm-border" style={{ backgroundColor: '#f9e3da' }}>
          <div className="max-w-5xl mx-auto">
            <p className="text-warm-burgundy font-serif italic tracking-[0.35em] uppercase text-xs text-center mb-8">
              This Series Is
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-6 sm:gap-y-0 sm:divide-x divide-warm-burgundy/20">
              {ALL_CLASS_FEATURES.map(({ label, accent }) => (
                <div key={label} className="px-4 text-center">
                  <div className="w-10 h-px mx-auto mb-3" style={{ backgroundColor: accent }} />
                  <p className="font-serif text-warm-ink text-xs sm:text-sm font-bold tracking-widest uppercase leading-tight">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Details ──────────────────────────────────────────────────────── */}
        <section className="bg-warm-cream py-14 px-6">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-y-10 md:gap-y-0 md:divide-x divide-warm-border/70">
            <div className="md:px-6 text-center">
              <p className="text-warm-burgundy font-serif italic tracking-[0.3em] uppercase text-xs mb-3">When</p>
              <p className="font-serif text-warm-ink font-bold text-xl sm:text-2xl">Mondays · 6:00 – 7:30 PM</p>
              <p className="text-warm-ink/80 text-sm mt-2 leading-relaxed">
                Six weeks, starting Monday, June 29. 90 minutes a week, just for you.
              </p>
            </div>
            <div className="md:px-6 text-center">
              <p className="text-warm-burgundy font-serif italic tracking-[0.3em] uppercase text-xs mb-3">Pricing</p>
              <p className="font-serif text-warm-ink font-bold text-xl sm:text-2xl">
                $120 <span className="font-normal text-warm-taupe text-base">Summer Series Pass</span>
              </p>
              <p className="font-serif text-warm-ink font-bold text-base sm:text-lg mt-1">
                $25 <span className="font-normal text-warm-taupe text-sm">drop-in</span>
              </p>
              <p className="text-warm-ink/70 text-xs mt-2 italic">
                The pass covers all 6 Mondays and saves you $30.
              </p>
            </div>
            <div className="md:px-6 text-center">
              <p className="text-warm-burgundy font-serif italic tracking-[0.3em] uppercase text-xs mb-3">For You</p>
              <p className="font-serif text-warm-ink font-bold text-xl sm:text-2xl">No Experience Needed</p>
              <p className="text-warm-ink/80 text-sm mt-2 leading-relaxed">
                No pressure — just a space to move, grow, and do something for yourself.
              </p>
            </div>
          </div>
        </section>

        {/* ── Mission Quote ────────────────────────────────────────────────── */}
        <section className="bg-warm-burgundy py-12 px-6 text-center">
          <p className="font-script text-warm-ivory text-3xl sm:text-4xl md:text-5xl leading-tight">
            Move. Connect. Grow.
          </p>
        </section>

        {/* ── Flyer + Register CTA (side-by-side on lg+) ─────────────────── */}
        <section id="register" className="bg-white py-16 sm:py-20 px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">

            {/* Flyer (left on lg+) */}
            <div className="lg:sticky lg:top-24">
              <img
                src="/flyer-adult-summer-series.png"
                alt="Capital Core Adult Summer Series flyer — a 90-minute movement experience for women — Throwback Flow, Femme Flow, Calm Confidence — Mondays 6 to 7:30 PM"
                className="w-full rounded-md shadow-xl border border-surface-border"
              />
            </div>

            {/* CTA (right on lg+) */}
            <div className="text-center lg:text-left">
              <p className="text-brand-red text-xs font-bold tracking-[0.3em] uppercase mb-2">
                Registration is now open
              </p>
              <h2 className="text-navy-dark text-3xl sm:text-4xl font-black tracking-tight">
                Reserve Your Spot
              </h2>
              <p className="text-[#5a6a8a] text-sm sm:text-base mt-3 mb-8 leading-relaxed">
                Spots are limited. Grab the Summer Series Pass for all six Mondays, or drop in for a
                single class — pay securely online and you're set.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:items-center lg:justify-start justify-center">
                <Link
                  to="/adult-summer-series/signup"
                  className="text-warm-ink font-serif tracking-[0.25em] uppercase text-sm font-bold px-8 py-4 rounded-md border-2 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                  style={{
                    background: 'linear-gradient(135deg, #f9c5cb 0%, #f4a8b4 100%)',
                    borderColor: '#e890a5',
                    boxShadow: '0 10px 24px -8px rgba(244, 168, 180, 0.65)',
                  }}
                >
                  Register Now →
                </Link>
              </div>

              <p className="text-[#8a9aaa] text-xs mt-6">
                Questions? <a href="mailto:info@capitalcoredance.com" className="underline hover:text-navy-dark">info@capitalcoredance.com</a>{' '}
                or call <a href="tel:8042344014" className="underline hover:text-navy-dark">(804) 234-4014</a>.
              </p>
            </div>

          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
