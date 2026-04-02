import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import Navbar from '../components/Navbar'
import PageHeader from '../components/PageHeader'
import Footer from '../components/Footer'
import SEO from '../components/SEO'

const FAQS = [
  {
    category: 'Classes & Programs',
    items: [
      {
        q: 'What dance styles do you offer?',
        a: 'We offer a wide range of styles including ballet, jazz, hip hop, contemporary, tap, acro, tumbling, lyrical, musical theatre, Irish dance, and pom/cheer. We also offer preschool creative movement for our youngest dancers (ages 2–5) and adult fitness classes.',
      },
      {
        q: 'What ages do you teach?',
        a: 'We welcome dancers starting at age 2 all the way through adults. Our preschool classes (ages 2–5) focus on creative movement and basic technique, while our older programs offer progressive levels from beginner through advanced.',
      },
      {
        q: 'Do you have classes for beginners?',
        a: 'Absolutely. Most of our classes are open to beginners and we never assume prior experience. Our instructors are trained to work with all skill levels in a supportive, encouraging environment.',
      },
      {
        q: 'How long is each class?',
        a: 'Class lengths range from 30 minutes (preschool/tiny classes) to 90 minutes depending on the style, age group, and level. You can view our full schedule on the Classes page.',
      },
      {
        q: 'What is the Mini Series?',
        a: 'The Mini Series is a short-term spring program where each class combines two dance styles into one fun session. It runs April 6 – May 15, 2026 and is a low-commitment way for dancers to try something new. Classes are $145 per series and are capped at 20 students.',
      },
    ],
  },
  {
    category: 'Enrollment & Tuition',
    items: [
      {
        q: 'Is there a free trial class?',
        a: 'Yes — your first class is always free. No commitment required. You can register for a trial through our iClassPro portal.',
      },
      {
        q: 'How do I enroll my child?',
        a: 'You can enroll online through our iClassPro student portal. If you have questions before signing up, feel free to reach out to us by phone at 804-234-4014 or by email at info@capitalcoredance.com.',
      },
      {
        q: 'How much do classes cost?',
        a: 'Class pricing is based on class length: 30-minute classes are $65/month, 45-minute classes are $85/month, 60-minute classes are $105/month, 75-minute classes are $125/month, and 90-minute classes are $150/month. Full-semester rates are also available.',
      },
      {
        q: 'What is the registration fee?',
        a: 'There is a $65 registration fee per dancer per semester, or $120 for the full year (both semesters). Sibling discounts and family fee caps are available for families with multiple dancers enrolled.',
      },
      {
        q: 'When are your semesters?',
        a: 'We run two semesters per year: Fall (August – December) and Spring (January – June). Once registered, dancers are locked into their classes and pricing for the semester.',
      },
      {
        q: 'Do you offer discounts?',
        a: 'Yes. We offer multi-class discounts for dancers enrolled in more than one class, multi-student discounts for families with multiple dancers, and sibling discounts on registration fees. Reach out to us for details.',
      },
      {
        q: 'How do I pay?',
        a: 'All payments are made through our iClassPro portal. We accept all major credit and debit cards, ACH transfers, and checks. If you have trouble with the portal, just contact us and we\'ll help.',
      },
    ],
  },
  {
    category: 'Recital',
    items: [
      {
        q: 'Do you have an annual recital?',
        a: 'Yes! Our 2026 recital is "A Night at the Cinema" taking place June 12–14, 2026. All enrolled dancers participate in the performance.',
      },
      {
        q: 'How much does the recital cost?',
        a: 'The recital fee is $100 for the first dance (which includes the costume), $85 for a second costume, and $65 for a third costume and beyond. This covers the costume, recital venue, and all associated production costs. Families with multiple dancers receive a discount, and payment plans are available.',
      },
      {
        q: 'Do all students have to participate in the recital?',
        a: 'Participation in the recital is encouraged but not required. If you choose to participate, your dancer will perform with their class in a professional showcase setting.',
      },
    ],
  },
  {
    category: 'Summer Camps & Classes',
    items: [
      {
        q: 'Do you offer summer camps?',
        a: 'Yes! We offer 8 themed summer camp weeks for dancers ages 4–13. Camps run Monday through Friday, 9:30 AM to 3:30 PM, from June through August 2026. Each week has a different creative theme packed with dance, games, and activities.',
      },
      {
        q: 'How do I register for a summer camp?',
        a: 'Camp registration is handled through our iClassPro portal. Visit the Summer Camps page for the full schedule and available weeks, then register online.',
      },
      {
        q: 'Do you offer summer dance classes?',
        a: 'Yes! Our summer classes run from mid-June through early August — approximately 7 weeks. They follow a full-semester pay scale and cover a range of genres, giving dancers a great way to keep training and explore new styles over the summer. Details on specific classes and scheduling are coming soon.',
      },
      {
        q: 'Can my dancer do both a summer camp week and a summer class?',
        a: 'Absolutely — dancers are welcome to participate in both! However, they cannot be left at the studio between camp and their class. Families would need to pick up their dancer after camp ends and bring them back when their class begins.',
      },
    ],
  },
  {
    category: 'Birthday Parties',
    items: [
      {
        q: 'Do you host birthday parties?',
        a: 'Yes! Our birthday parties are a fun, active, and stress-free way to celebrate. Each party includes a private studio space, an instructor-led dance party, themed activities, music, tables and chairs, and set-up and clean-up. Parents just bring the cake and food.',
      },
      {
        q: 'How much do birthday parties cost?',
        a: 'Packages start at $199 and include up to 10 children for a 90-minute private party. Additional children can be added. A $50 non-refundable deposit is required to book, with the balance due on party day.',
      },
      {
        q: 'What themes are available for birthday parties?',
        a: 'We offer a variety of themes including Princess & Fairytale Dance, Hip Hop Dance Party, Pop Star Dance Party, Glow Dance Party, Unicorn & Rainbow Party, Preschool Wiggle & Giggle, Tea Party & Royal Celebration, Superhero Movement Party, and Dance & Craft Party. Custom themes and upgrades (like glow parties and crafts) are also available.',
      },
      {
        q: 'How do I book a birthday party?',
        a: 'You can book by completing our online booking form on the Birthday Parties page. We recommend booking in advance as availability is limited — especially on weekends.',
      },
    ],
  },
  {
    category: 'Studio Info',
    items: [
      {
        q: 'Where are you located?',
        a: 'We are located at 13110 Midlothian Turnpike, Midlothian, VA 23113. We serve the greater Midlothian, Chesterfield, and Richmond, Virginia area.',
      },
      {
        q: 'What are your studio hours?',
        a: 'Our general studio hours are Monday through Friday 3:00 PM – 8:00 PM and Saturday 9:00 AM – 2:00 PM. Specific class times vary — check the Classes page for the full schedule.',
      },
      {
        q: 'How can I contact you?',
        a: 'You can reach us by phone at 804-234-4014, by email at info@capitalcoredance.com, or by submitting the form on our Contact page. We are also active on Instagram and Facebook @capitalcoredance.',
      },
    ],
  },
]

const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.flatMap(({ items }) =>
    items.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: a,
      },
    }))
  ),
}

const ACCENT_COLORS = [
  'border-brand-red',
  'border-[#7ab3e8]',
  'border-[#f4a8b4]',
  'border-[#f4a060]',
  'border-[#d4b8f4]',
  'border-[#b8f0d4]',
]

function FAQItem({ q, a, index }) {
  const [open, setOpen] = useState(false)

  return (
    <div
      className={`border border-surface-border border-l-4 ${ACCENT_COLORS[index % ACCENT_COLORS.length]} rounded-lg overflow-hidden`}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 hover:bg-[#f8faff] transition-colors"
        aria-expanded={open}
      >
        <span className="text-navy-dark font-bold text-sm leading-snug">{q}</span>
        <span className={`text-brand-red flex-shrink-0 text-lg font-bold transition-transform ${open ? 'rotate-45' : ''}`}>+</span>
      </button>
      {open && (
        <div className="px-5 pb-5 pt-1">
          <p className="text-[#3a4a6a] text-sm leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  )
}

export default function FAQ() {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="FAQ | Capital Core Dance Studio – Midlothian, VA"
        description="Answers to common questions about classes, enrollment, tuition, recitals, summer camps, birthday parties, and more at Capital Core Dance Studio in Midlothian, VA."
        canonical="/faq"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(JSON_LD)}</script>
      </Helmet>

      <Navbar />
      <PageHeader
        eyebrow="Got Questions?"
        title="Frequently Asked Questions"
        subtitle="Everything you need to know about classes, enrollment, tuition, camps, and more."
      />

      <section className="bg-white flex-1 px-6 py-12">
        <div className="max-w-3xl mx-auto flex flex-col gap-12">
          {FAQS.map(({ category, items }, ci) => (
            <div key={category}>
              <p className="text-brand-red text-xs font-bold tracking-[0.3em] uppercase mb-2">{category}</p>
              <div className="flex flex-col gap-3">
                {items.map(({ q, a }, i) => (
                  <FAQItem key={q} q={q} a={a} index={ci + i} />
                ))}
              </div>
            </div>
          ))}

          <div className="bg-[#f0f6ff] border border-[#c8ddf4] rounded-lg px-5 py-5 text-center">
            <p className="text-navy-dark font-black text-base mb-1">Still have questions?</p>
            <p className="text-[#5a6a8a] text-sm mb-4">We're happy to help — reach out and we'll get back to you quickly.</p>
            <Link
              to="/contact"
              className="inline-block bg-brand-red text-white font-bold px-8 py-3 rounded-md hover:bg-red-700 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
