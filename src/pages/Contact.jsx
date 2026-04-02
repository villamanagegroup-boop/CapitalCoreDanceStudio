import Navbar from '../components/Navbar'
import PageHeader from '../components/PageHeader'
import Footer from '../components/Footer'
import SEO from '../components/SEO'

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Enroll Now | Capital Core Dance Studio – Midlothian, VA"
        description="Ready to start dancing? Contact Capital Core Dance Studio to enroll in classes or schedule a trial. Serving Midlothian, Chesterfield, and Richmond, VA."
        canonical="/contact"
      />
      <Navbar />
      <PageHeader
        eyebrow="We'd love to hear from you"
        title="Contact Us"
        subtitle="Questions about enrollment, schedules, or parties? Reach out and we'll get back to you soon."
      />

      <section className="bg-white flex-1 px-6 py-12">
        <div className="max-w-xl mx-auto">
          <form className="flex flex-col gap-5" aria-label="Contact us" onSubmit={(e) => e.preventDefault()}>
            {/* Name row */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 flex flex-col gap-1.5">
                <label className="text-navy-dark text-sm font-semibold" htmlFor="firstName">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  placeholder="First name"
                  className="border border-surface-border rounded-md px-4 py-2.5 text-sm bg-surface-light focus:outline-none focus:border-[#7ab3e8] focus:ring-1 focus:ring-[#7ab3e8]"
                />
              </div>
              <div className="flex-1 flex flex-col gap-1.5">
                <label className="text-navy-dark text-sm font-semibold" htmlFor="lastName">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  placeholder="Last name"
                  className="border border-surface-border rounded-md px-4 py-2.5 text-sm bg-surface-light focus:outline-none focus:border-[#7ab3e8] focus:ring-1 focus:ring-[#7ab3e8]"
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-navy-dark text-sm font-semibold" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="your@email.com"
                className="border border-surface-border rounded-md px-4 py-2.5 text-sm bg-surface-light focus:outline-none focus:border-[#7ab3e8] focus:ring-1 focus:ring-[#7ab3e8]"
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1.5">
              <label className="text-navy-dark text-sm font-semibold" htmlFor="phone">
                Phone{' '}
                <span className="text-[#8a9aaa] font-normal">(optional)</span>
              </label>
              <input
                id="phone"
                type="tel"
                placeholder="(000) 000-0000"
                className="border border-surface-border rounded-md px-4 py-2.5 text-sm bg-surface-light focus:outline-none focus:border-[#7ab3e8] focus:ring-1 focus:ring-[#7ab3e8]"
              />
            </div>

            {/* Interest */}
            <div className="flex flex-col gap-1.5">
              <label className="text-navy-dark text-sm font-semibold" htmlFor="interest">
                I'm interested in...
              </label>
              <select
                id="interest"
                className="border border-surface-border rounded-md px-4 py-2.5 text-sm bg-surface-light focus:outline-none focus:border-[#7ab3e8] focus:ring-1 focus:ring-[#7ab3e8] text-[#3a4a6a]"
              >
                <option value="">Select an option</option>
                <option value="classes">Classes</option>
                <option value="camps">Camps</option>
                <option value="birthdays">Birthdays / Parties</option>
                <option value="general">General Inquiry</option>
              </select>
            </div>

            {/* Message */}
            <div className="flex flex-col gap-1.5">
              <label className="text-navy-dark text-sm font-semibold" htmlFor="message">
                Message
              </label>
              <textarea
                id="message"
                rows={5}
                placeholder="How can we help?"
                className="border border-surface-border rounded-md px-4 py-2.5 text-sm bg-surface-light focus:outline-none focus:border-[#7ab3e8] focus:ring-1 focus:ring-[#7ab3e8] resize-none"
              />
            </div>

            <button
              type="submit"
              className="bg-brand-red text-white font-bold py-3 rounded-md hover:bg-red-700 transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  )
}
