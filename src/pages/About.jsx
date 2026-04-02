import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import PageHeader from '../components/PageHeader'
import Footer from '../components/Footer'
import SEO from '../components/SEO'

const PILLARS = [
  {
    accent: 'border-brand-red',
    label: 'We Focus on the Whole Dancer',
    body: 'Our goal is not just to teach choreography. We develop coordination, musicality, athleticism, confidence, and creativity in every dancer.',
  },
  {
    accent: 'border-[#7ab3e8]',
    label: 'We Create a Positive Studio Environment',
    body: 'Every dancer deserves to feel welcome and supported. Our studio culture is built on encouragement, respect, and teamwork.',
  },
  {
    accent: 'border-[#f4a8b4]',
    label: 'We Offer Opportunities to Grow',
    body: 'From technique classes and performances to camps, workshops, and community events — dancers have many ways to develop and express themselves.',
  },
  {
    accent: 'border-[#f4a060]',
    label: 'We Build a Strong Community',
    body: 'Capital Core Dance is more than a studio — it is a place where dancers and families connect, celebrate milestones, and grow together.',
  },
]

const PROGRAMS = [
  'Preschool Creative Movement',
  'Ballet, Jazz, Tap, and Hip Hop',
  'Acro and Tumbling',
  'Musical Theatre and Performance Classes',
  'Adult Dance and Fitness Classes',
  'Summer Camps and Seasonal Programs',
  'Birthday Parties and Special Events',
]

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="About Us | Capital Core Dance Studio"
        description="Learn about Capital Core Dance Studio's mission, instructors, and our commitment to building confident, skilled dancers in the Richmond/Midlothian area."
        canonical="/about"
      />
      <Navbar />
      <PageHeader
        eyebrow="Capital Core Dance"
        title="About Us"
        subtitle="Where Confidence, Creativity, and Community Take Center Stage"
      />

      <section className="bg-white flex-1 px-6 py-12">
        <div className="max-w-3xl mx-auto flex flex-col gap-12">

          {/* Founding story */}
          <div>
            <p className="text-brand-red text-xs font-bold tracking-[0.3em] uppercase mb-2">Who We Are</p>
            <h2 className="text-navy-dark text-2xl font-black mb-4">
              Built on a belief that every dancer belongs
            </h2>
            <p className="text-[#3a4a6a] text-sm leading-relaxed mb-3">
              Capital Core Dance was founded on the belief that dance should be a place where every student feels confident, supported, and inspired to grow.
            </p>
            <p className="text-[#3a4a6a] text-sm leading-relaxed">
              Dance is more than movement — it is discipline, creativity, resilience, and self-expression. We focus on helping dancers develop strong technique while also building confidence, character, and a lifelong love of movement. Whether a dancer is stepping into their very first class or continuing to build their skills, our programs are designed to support growth at every level.
            </p>
          </div>

          {/* Our approach */}
          <div className="border border-surface-border border-l-4 border-l-[#7ab3e8] rounded-lg px-5 py-5">
            <p className="text-brand-red text-xs font-bold tracking-[0.3em] uppercase mb-2">Our Approach</p>
            <h3 className="text-navy-dark text-lg font-black mb-3">Strong instruction. Supportive environment.</h3>
            <p className="text-[#3a4a6a] text-sm leading-relaxed mb-3">
              At Capital Core Dance, we believe that the best dance education combines strong instruction with a supportive environment. Our classes are designed to challenge dancers while also encouraging creativity, teamwork, and confidence.
            </p>
            <p className="text-[#3a4a6a] text-sm leading-relaxed">
              We celebrate progress, effort, and individuality — helping each dancer discover their unique strengths. Our studio is a place where dancers are encouraged to try new things, build friendships, and take pride in their accomplishments both inside and outside the studio.
            </p>
          </div>

          {/* What makes us different */}
          <div>
            <p className="text-brand-red text-xs font-bold tracking-[0.3em] uppercase mb-2">What Makes Us Different</p>
            <h2 className="text-navy-dark text-2xl font-black mb-6">Four things we stand by</h2>
            <div className="flex flex-col gap-4">
              {PILLARS.map(({ accent, label, body }) => (
                <div
                  key={label}
                  className={`border border-surface-border border-l-4 ${accent} rounded-lg px-5 py-4`}
                >
                  <div className="font-bold text-navy-dark text-base mb-1">{label}</div>
                  <p className="text-[#3a4a6a] text-sm leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Programs */}
          <div className="bg-[#f0f6ff] border border-[#c8ddf4] rounded-lg px-5 py-5">
            <p className="text-brand-red text-xs font-bold tracking-[0.3em] uppercase mb-2">Programs</p>
            <h3 className="text-navy-dark text-lg font-black mb-4">For every stage of the journey</h3>
            <ul className="flex flex-col gap-2">
              {PROGRAMS.map((p) => (
                <li key={p} className="text-[#3a4a6a] text-sm flex gap-2">
                  <span className="text-brand-red mt-0.5 flex-shrink-0">✓</span>
                  {p}
                </li>
              ))}
            </ul>
            <p className="text-[#5a6a8a] text-xs mt-4 italic">
              Our goal is to create a welcoming environment where dancers can begin their journey and continue growing for years to come.
            </p>
          </div>

          {/* Vision */}
          <div className="border border-surface-border border-l-4 border-l-brand-red rounded-lg px-5 py-5">
            <p className="text-brand-red text-xs font-bold tracking-[0.3em] uppercase mb-2">Our Vision</p>
            <p className="text-[#3a4a6a] text-sm leading-relaxed mb-3">
              We believe a dance studio should be a place where dancers build more than technique — it should be a place where they build confidence, friendships, discipline, and joy.
            </p>
            <p className="text-[#3a4a6a] text-sm leading-relaxed">
              Capital Core Dance is committed to creating a space where dancers feel proud of their progress, excited to perform, and supported every step of the way.
            </p>
          </div>

          {/* CTA */}
          <div className="text-center">
            <p className="text-brand-red text-xs font-bold tracking-[0.3em] uppercase mb-2">Join Us</p>
            <h2 className="text-navy-dark text-2xl font-black mb-3">Come dance with Capital Core</h2>
            <p className="text-[#5a6a8a] text-sm mb-1">Come dance with purpose.</p>
            <p className="text-[#5a6a8a] text-sm mb-1">Come dance with passion.</p>
            <p className="text-[#5a6a8a] text-sm mb-6">Come dance with Capital Core.</p>
            <Link
              to="/contact"
              className="inline-block bg-brand-red text-white font-bold px-8 py-3 rounded-md hover:bg-red-700 transition-colors"
            >
              Become Part of the Family
            </Link>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  )
}
