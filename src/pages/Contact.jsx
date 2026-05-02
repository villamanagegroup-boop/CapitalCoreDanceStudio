import { useState } from 'react'
import Navbar from '../components/Navbar'
import PageHeader from '../components/PageHeader'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import { supabase } from '../lib/supabase'
import { simpleBreadcrumb } from '../lib/schema'

const INITIAL_FORM = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  interest: '',
  message: '',
}

export default function Contact() {
  const [form, setForm] = useState(INITIAL_FORM)
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState('')

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('submitting')
    setErrorMsg('')

    const { error } = await supabase.from('contact_submissions').insert([
      {
        first_name: form.firstName,
        last_name: form.lastName,
        email: form.email,
        phone: form.phone || null,
        interest: form.interest || null,
        message: form.message,
      },
    ])

    if (error) {
      setStatus('error')
      setErrorMsg('Something went wrong. Please try again or email us directly at info@capitalcoredance.com.')
    } else {
      fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formType: 'contact',
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          interest: form.interest,
          message: form.message,
        }),
      }).catch(() => {})
      setStatus('success')
      setForm(INITIAL_FORM)
    }
  }

  const inputClass = 'border border-surface-border rounded-md px-4 py-2.5 text-sm bg-surface-light focus:outline-none focus:border-[#7ab3e8] focus:ring-1 focus:ring-[#7ab3e8]'

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Contact Capital Core Dance Studio | Midlothian, VA Dance Classes"
        description="Get in touch with Capital Core Dance Studio at 13110 Midlothian Turnpike, Midlothian, VA. Call (804) 234-4014, email info@capitalcoredance.com, or send us a message. Free trial classes available."
        canonical="/contact"
        jsonLd={simpleBreadcrumb('Contact', '/contact')}
      />
      <Navbar />
      <PageHeader
        eyebrow="We'd love to hear from you"
        title="Contact Us"
        subtitle="Questions about enrollment, schedules, or parties? Reach out and we'll get back to you soon."
      />

      <section className="bg-white flex-1 px-6 py-12">
        <div className="max-w-xl mx-auto">

          {status === 'success' ? (
            <div className="text-center py-16">
              <div className="text-4xl mb-4">✓</div>
              <h2 className="text-navy-dark font-black text-2xl mb-2">Message sent!</h2>
              <p className="text-[#5a6a8a] text-sm mb-6">
                Thanks for reaching out. We'll get back to you within 1–2 business days.
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="text-brand-red text-sm font-bold hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form className="flex flex-col gap-5" aria-label="Contact us" onSubmit={handleSubmit}>
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
                    required
                    value={form.firstName}
                    onChange={handleChange}
                    className={inputClass}
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
                    required
                    value={form.lastName}
                    onChange={handleChange}
                    className={inputClass}
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
                  required
                  value={form.email}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-1.5">
                <label className="text-navy-dark text-sm font-semibold" htmlFor="phone">
                  Phone <span className="text-[#8a9aaa] font-normal">(optional)</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="(000) 000-0000"
                  value={form.phone}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              {/* Interest */}
              <div className="flex flex-col gap-1.5">
                <label className="text-navy-dark text-sm font-semibold" htmlFor="interest">
                  I'm interested in...
                </label>
                <select
                  id="interest"
                  value={form.interest}
                  onChange={handleChange}
                  className={`${inputClass} text-[#3a4a6a]`}
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
                  required
                  value={form.message}
                  onChange={handleChange}
                  className={`${inputClass} resize-none`}
                />
              </div>

              {status === 'error' && (
                <p className="text-brand-red text-sm">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="bg-brand-red text-white font-bold py-3 rounded-md hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === 'submitting' ? 'Sending…' : 'Send Message'}
              </button>
            </form>
          )}

        </div>
      </section>

      <Footer />
    </div>
  )
}
