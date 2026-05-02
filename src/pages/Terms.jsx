import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import PageHeader from '../components/PageHeader'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import { simpleBreadcrumb } from '../lib/schema'

const SECTIONS = [
  {
    title: 'Acceptance of Terms',
    body: [
      'By enrolling in classes, registering for camps, booking a birthday party, purchasing tickets or merchandise, or otherwise using the services of Capital Core Dance Studio ("the studio," "we," "us"), you agree to these Terms of Service. If you are enrolling on behalf of a minor, you represent that you are the parent or legal guardian and that you accept these terms for them.',
    ],
  },
  {
    title: 'Class Enrollment & Trial Class',
    body: [
      'New dancers are welcome to attend a free trial class to see if it\'s the right fit. Enrollment is processed through our iClassPro portal. Spots in each class are limited and assigned on a first-come, first-served basis once enrollment is complete.',
      'Once enrolled, dancers are expected to attend classes consistently. Persistent absences may result in losing the spot to a dancer on the waitlist.',
    ],
  },
  {
    title: 'Tuition, Fees & Payment',
    body: [
      'Tuition is billed monthly or per semester depending on the program. A semester registration fee applies. All payments are processed securely through iClassPro (for tuition) or PayPal (for tickets, merchandise, and birthday deposits).',
      'Tuition is due on the first of each month. Late or missed payments may result in suspension of class access until the balance is brought current.',
    ],
  },
  {
    title: 'Refund Policy',
    body: [
      'Tuition is non-refundable once the month or semester begins. Birthday party deposits ($50) are non-refundable and secure your party date. Recital tickets, programs, and merchandise are made-to-order or pre-allocated, and are non-refundable once purchased.',
      'If the studio cancels a class, camp week, or event for reasons within our control, we will offer a credit, makeup, or refund as appropriate.',
    ],
  },
  {
    title: 'Recital Participation',
    body: [
      'Participation in our annual recital is encouraged but not required. A recital fee covers the cost of costumes, venue, and production. Costume orders are final once placed.',
      'Recital tickets are general admission. Children 3 and under do not require a ticket. Tickets are non-refundable once purchased; please save your confirmation email and present it at the door for entry.',
    ],
  },
  {
    title: 'Birthday Parties',
    body: [
      'A $50 non-refundable deposit is required to secure your party date. The remaining balance is due on the day of the party. All party guests must have a completed waiver on file before participating.',
      'If you need to reschedule, please give us as much notice as possible — we\'ll do our best to accommodate based on availability.',
    ],
  },
  {
    title: 'Liability & Waiver',
    body: [
      'Dance involves physical activity and inherent risk of injury. By enrolling, you acknowledge that participation is voluntary and at your own risk. Each dancer (or their guardian) is required to sign our liability waiver before participating in any class, camp, party, or event.',
      'Capital Core Dance Studio, its instructors, and staff are not liable for personal injury or property loss arising from voluntary participation, except where caused by our gross negligence.',
    ],
  },
  {
    title: 'Photo & Media Release',
    body: [
      'From time to time we photograph or record classes, performances, and events for promotional use on our website, social media, and printed materials. By enrolling or attending, you grant us permission to use these images and recordings unless you notify us in writing that you wish to opt out. Opt-out requests can be sent to info@capitalcoredance.com.',
    ],
  },
  {
    title: 'Cancellations & Inclement Weather',
    body: [
      'In the event of inclement weather or unforeseen circumstances, we may cancel or reschedule classes. We will communicate cancellations as quickly as possible by email, social media, and our iClassPro portal.',
      'If a class is canceled by the studio, families will be offered a makeup class when reasonably possible.',
    ],
  },
  {
    title: 'Code of Conduct',
    body: [
      'We are committed to a positive, respectful, and inclusive environment. Dancers, families, and guests are expected to treat instructors, staff, and one another with kindness. Disruptive, aggressive, or disrespectful behavior may result in dismissal from class or events without refund.',
    ],
  },
  {
    title: 'Intellectual Property',
    body: [
      'All content on this website — including logos, photography, choreography descriptions, and written copy — is the property of Capital Core Dance Studio. You may not copy, reproduce, or redistribute our content without written permission.',
    ],
  },
  {
    title: 'Changes to These Terms',
    body: [
      'We may update these Terms from time to time. The "Last Updated" date below reflects the most recent revision. Continued use of our services after changes are posted constitutes your acceptance of the updated terms.',
    ],
  },
  {
    title: 'Governing Law',
    body: [
      'These Terms are governed by the laws of the Commonwealth of Virginia. Any dispute arising from these Terms or your use of our services will be handled in the appropriate courts of Chesterfield County, Virginia.',
    ],
  },
]

export default function Terms() {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Terms of Service | Capital Core Dance Studio"
        description="Terms of Service for Capital Core Dance Studio in Midlothian, VA — enrollment, payments, refunds, liability, and policies."
        canonical="/terms"
        jsonLd={simpleBreadcrumb('Terms of Service', '/terms')}
      />
      <Navbar />
      <PageHeader
        eyebrow="Legal"
        title="Terms of Service"
        subtitle="The agreements that apply when you enroll, register, or participate in any Capital Core Dance Studio program or event."
      />

      <section className="bg-white flex-1 px-6 py-12">
        <div className="max-w-3xl mx-auto flex flex-col gap-10">

          <p className="text-[#5a6a8a] text-xs italic">Last Updated: May 1, 2026</p>

          <p className="text-[#3a4a6a] text-sm leading-relaxed">
            Welcome to Capital Core Dance Studio. These Terms of Service set out the rules and expectations for
            using our website, enrolling in our programs, and attending our events. Please read them carefully.
          </p>

          {SECTIONS.map(({ title, body }) => (
            <div key={title}>
              <h2 className="text-navy-dark text-lg font-black mb-3">{title}</h2>
              <div className="flex flex-col gap-3">
                {body.map((p, i) => (
                  <p key={i} className="text-[#3a4a6a] text-sm leading-relaxed">{p}</p>
                ))}
              </div>
            </div>
          ))}

          {/* Contact card */}
          <div className="bg-[#f0f6ff] border border-[#c8ddf4] rounded-lg px-5 py-5">
            <p className="text-navy-dark font-black text-base mb-2">Questions about these Terms?</p>
            <p className="text-[#5a6a8a] text-sm leading-relaxed mb-4">
              We're happy to clarify anything you'd like to better understand before enrolling or registering.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/contact"
                className="inline-block bg-brand-red text-white font-bold px-6 py-2.5 rounded-md hover:bg-red-700 transition-colors text-sm text-center"
              >
                Contact Us
              </Link>
              <Link
                to="/privacy"
                className="inline-block border border-[#c8ddf4] text-navy-dark font-bold px-6 py-2.5 rounded-md hover:bg-white transition-colors text-sm text-center"
              >
                View Privacy Policy
              </Link>
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
