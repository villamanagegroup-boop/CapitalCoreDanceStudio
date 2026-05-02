import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import PageHeader from '../components/PageHeader'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import { simpleBreadcrumb } from '../lib/schema'

const SECTIONS = [
  {
    title: 'Information We Collect',
    body: [
      'We collect information you provide directly when you enroll in classes, register for camps or recital activities, book a birthday party, contact us through our forms, or purchase merchandise and tickets. This typically includes your name, email address, phone number, billing information, and details about your dancer (name, age, emergency contact, allergies, and similar enrollment information).',
      'We may also collect basic technical information automatically when you visit our website — such as browser type, device type, and pages visited — to help us improve the site experience.',
    ],
  },
  {
    title: 'How We Use Your Information',
    body: [
      'We use the information we collect to register dancers, schedule classes and parties, process payments, send confirmations and receipts, communicate about your enrollment or upcoming events, and respond to questions you send us.',
      'We do not sell your personal information.',
    ],
  },
  {
    title: 'Third-Party Services',
    body: [
      'To run the studio and this website, we rely on a small set of trusted services that handle data on our behalf:',
    ],
    list: [
      'iClassPro — class registration, scheduling, and tuition payments',
      'PayPal — recital ticket, merchandise, and birthday deposit payments',
      'Supabase — secure storage for form submissions and orders',
      'Resend — email delivery for booking confirmations and notifications',
      'Vercel — website hosting',
    ],
    after: 'Each of these services has their own privacy practices, and we share only the information needed for them to perform their function.',
  },
  {
    title: 'Cookies & Analytics',
    body: [
      'Our website may use cookies or similar technologies to keep your session active, remember preferences, and understand which pages are most useful to families. You can control cookies through your browser settings.',
    ],
  },
  {
    title: 'Children\'s Privacy',
    body: [
      'Capital Core Dance Studio works with dancers of all ages, including children under 13. We collect information about minor dancers only from a parent or guardian as part of enrollment or event registration. We use this information solely for studio operations and never for marketing to children directly.',
    ],
  },
  {
    title: 'Data Security',
    body: [
      'We take reasonable steps to protect the information we collect. Payments are processed through PayPal and iClassPro, both of which use industry-standard encryption. We never store full credit card numbers on our website or servers.',
    ],
  },
  {
    title: 'Your Choices',
    body: [
      'You can request to access, correct, or delete information we hold about you or your dancer at any time by contacting us at info@capitalcoredance.com. You may unsubscribe from non-essential email at any time using the unsubscribe link in those emails or by contacting us directly.',
    ],
  },
  {
    title: 'Updates to This Policy',
    body: [
      'We may update this Privacy Policy from time to time. The "Last Updated" date below will reflect the most recent revision. Significant changes will be communicated where appropriate.',
    ],
  },
]

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Privacy Policy | Capital Core Dance Studio"
        description="Privacy Policy for Capital Core Dance Studio in Midlothian, VA — how we collect, use, and protect your information."
        canonical="/privacy"
        jsonLd={simpleBreadcrumb('Privacy Policy', '/privacy')}
      />
      <Navbar />
      <PageHeader
        eyebrow="Legal"
        title="Privacy Policy"
        subtitle="How we collect, use, and protect the information you share with Capital Core Dance Studio."
      />

      <section className="bg-white flex-1 px-6 py-12">
        <div className="max-w-3xl mx-auto flex flex-col gap-10">

          <p className="text-[#5a6a8a] text-xs italic">Last Updated: May 1, 2026</p>

          <p className="text-[#3a4a6a] text-sm leading-relaxed">
            Capital Core Dance Studio (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;the studio&rdquo;) values your privacy. This policy explains what
            information we collect when you visit our website or use our services, how we use it, and the choices
            you have. By using our website you agree to the practices described below.
          </p>

          {SECTIONS.map(({ title, body, list, after }) => (
            <div key={title}>
              <h2 className="text-navy-dark text-lg font-black mb-3">{title}</h2>
              <div className="flex flex-col gap-3">
                {body.map((p, i) => (
                  <p key={i} className="text-[#3a4a6a] text-sm leading-relaxed">{p}</p>
                ))}
                {list && (
                  <ul className="list-disc pl-5 space-y-1.5">
                    {list.map((item, i) => (
                      <li key={i} className="text-[#3a4a6a] text-sm leading-relaxed">{item}</li>
                    ))}
                  </ul>
                )}
                {after && <p className="text-[#3a4a6a] text-sm leading-relaxed">{after}</p>}
              </div>
            </div>
          ))}

          {/* Contact card */}
          <div className="bg-[#f0f6ff] border border-[#c8ddf4] rounded-lg px-5 py-5">
            <p className="text-navy-dark font-black text-base mb-2">Questions about your privacy?</p>
            <p className="text-[#5a6a8a] text-sm leading-relaxed mb-4">
              Reach out anytime — we're happy to walk you through what we collect or update your information on request.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/contact"
                className="inline-block bg-brand-red text-white font-bold px-6 py-2.5 rounded-md hover:bg-red-700 transition-colors text-sm text-center"
              >
                Contact Us
              </Link>
              <a
                href="mailto:info@capitalcoredance.com"
                className="inline-block border border-[#c8ddf4] text-navy-dark font-bold px-6 py-2.5 rounded-md hover:bg-white transition-colors text-sm text-center"
              >
                info@capitalcoredance.com
              </a>
            </div>
          </div>

          <p className="text-[#8a9aaa] text-xs text-center">
            Capital Core Dance Studio · 13110 Midlothian Turnpike, Midlothian, VA 23113 · (804) 234-4014
          </p>

        </div>
      </section>

      <Footer />
    </div>
  )
}
