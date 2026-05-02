import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import PageHeader from '../components/PageHeader'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import { supabase } from '../lib/supabase'

const THEMES = [
  'Princess & Fairytale Dance',
  'Hip Hop Dance Party',
  'Pop Star Dance Party',
  'Glow Dance Party',
  'Unicorn & Rainbow Party',
  'Preschool Wiggle & Giggle',
  'Tea Party & Royal Celebration',
  'Superhero Movement Party',
  'Dance & Craft Party',
  'Custom Theme',
]

const TIME_SLOTS = [
  'Saturday 9:00 – 10:30 AM',
  'Saturday 4:00 – 5:30 PM',
  'Sunday 11:00 AM – 12:30 PM',
  'Sunday 1:00 – 2:30 PM',
  'Sunday 3:00 – 4:30 PM',
  'Sunday 5:00 – 6:30 PM',
  'Other',
]

const UPGRADES = [
  'Additional Party Goers (Over 10) – $15/person',
  'Extended Party Time (15 minutes) – $30',
  'Custom Theme Request – Free',
  'Balloon Backdrop – $75',
  'Extra Themed Decorations – $30',
  'Personalized Party Playlist – $20',
  'Photo or Video Highlight (short clip) – $35',
  'Custom Birthday Sign with Child\'s Name – $30',
  'Party Favors Provided by Studio & Craft Station – $5/child',
  'Birthday Photo Frame for Pictures – $15',
  'Mini Instructor Performance – $50',
  'Other',
]

const REFERRAL_OPTIONS = [
  'Social Media (Instagram, TikTok, Facebook, X)',
  'Studio Website',
  'Other Website',
  'Referral From a Friend (add them to additional notes)',
  'Other',
]

const INITIAL_FORM = {
  parentName: '',
  email: '',
  phone: '',
  birthdayName: '',
  birthdayAge: '',
  enrolled: '',
  dateFirst: '',
  dateSecond: '',
  timeSlot: '',
  timeSlotOther: '',
  timeSlotSecond: '',
  timeSlotSecondOther: '',
  guestCount: '',
  theme: '',
  customTheme: '',
  upgrades: [],
  upgradeOther: '',
  bringingFood: '',
  allergies: '',
  referral: '',
  promoCode: '',
  notes: '',
  policyDeposit: false,
  policyBalance: false,
  policyConfirm: false,
  waiverAck: false,
}

export default function BirthdayForm() {
  const navigate = useNavigate()
  const [form, setForm] = useState(INITIAL_FORM)
  const [status, setStatus] = useState('idle') // idle | submitting | error
  const [errorMsg, setErrorMsg] = useState('')

  function handleChange(e) {
    const { id, value, type, checked } = e.target
    if (type === 'checkbox' && id.startsWith('upgrade-')) {
      const upgrade = id.replace('upgrade-', '')
      setForm((prev) => ({
        ...prev,
        upgrades: checked
          ? [...prev.upgrades, upgrade]
          : prev.upgrades.filter((u) => u !== upgrade),
      }))
    } else if (type === 'checkbox') {
      setForm((prev) => ({ ...prev, [id]: checked }))
    } else {
      setForm((prev) => ({ ...prev, [id]: value }))
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('submitting')
    setErrorMsg('')

    const resolvedTimeSlot = form.timeSlot === 'Other' ? `Other: ${form.timeSlotOther}` : form.timeSlot
    const resolvedTimeSlotSecond = form.timeSlotSecond === 'Other' ? `Other: ${form.timeSlotSecondOther}` : form.timeSlotSecond
    const resolvedUpgrades = form.upgrades.includes('Other')
      ? [...form.upgrades.filter((u) => u !== 'Other'), `Other: ${form.upgradeOther}`]
      : form.upgrades

    const { error } = await supabase.from('birthday_bookings').insert([{
      parent_name: form.parentName,
      email: form.email,
      phone: form.phone,
      birthday_person_name: form.birthdayName,
      birthday_person_age: form.birthdayAge,
      currently_enrolled: form.enrolled,
      date_first_choice: form.dateFirst,
      date_second_choice: form.dateSecond,
      preferred_time_slot: resolvedTimeSlot,
      preferred_time_slot_secondary: resolvedTimeSlotSecond || null,
      estimated_guests: form.guestCount,
      theme: form.theme,
      custom_theme_description: form.customTheme || null,
      optional_upgrades: resolvedUpgrades.length ? resolvedUpgrades.join(', ') : null,
      bringing_food: form.bringingFood,
      allergies: form.allergies || null,
      referral: form.referral,
      promo_code: form.promoCode || null,
      additional_notes: form.notes || null,
    }])

    if (error) {
      console.error('Supabase insert error:', JSON.stringify(error, null, 2))
      setStatus('error')
      setErrorMsg('Something went wrong. Please try again or email us at info@capitalcoredance.com.')
    } else {
      fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formType: 'birthday',
          parentName: form.parentName,
          email: form.email,
          phone: form.phone,
          birthdayName: form.birthdayName,
          birthdayAge: form.birthdayAge,
          enrolled: form.enrolled,
          dateFirst: form.dateFirst,
          dateSecond: form.dateSecond,
          timeSlot: resolvedTimeSlot,
          timeSlotSecond: resolvedTimeSlotSecond,
          guestCount: form.guestCount,
          theme: form.theme,
          customTheme: form.customTheme,
          upgrades: resolvedUpgrades,
          bringingFood: form.bringingFood,
          allergies: form.allergies,
          referral: form.referral,
          promoCode: form.promoCode,
          notes: form.notes,
        }),
      }).catch(() => {})
      navigate('/birthday-payment', {
        state: {
          parentName: form.parentName,
          email: form.email,
          birthdayName: form.birthdayName,
          dateFirst: form.dateFirst,
        },
      })
    }
  }

  const inputClass = 'border border-surface-border rounded-md px-4 py-2.5 text-sm bg-surface-light focus:outline-none focus:border-[#f4a8b4] focus:ring-1 focus:ring-[#f4a8b4]'
  const labelClass = 'text-navy-dark text-sm font-semibold'
  const fieldClass = 'flex flex-col gap-1.5'
  const radioClass = 'flex items-center gap-2 text-[#3a4a6a] text-sm cursor-pointer'

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Book a Birthday Party | Capital Core Dance Studio – Midlothian, VA"
        description="Request a birthday party booking at Capital Core Dance Studio in Midlothian, VA. Fill out our form and we'll be in touch to confirm your date."
        canonical="/birthday-booking"
        noindex
      />
      <Navbar />
      <PageHeader
        eyebrow="Let's Celebrate!"
        title="Birthday Party Request"
        subtitle="Fill out the form below and we'll reach out within 1–2 business days to confirm your date and details."
      />

      <section className="bg-white flex-1 px-6 py-12">
        <div className="max-w-2xl mx-auto">

          <form className="flex flex-col gap-8" onSubmit={handleSubmit} aria-label="Birthday party booking form">

            {/* ── Contact Info ── */}
            <div className="flex flex-col gap-5">
              <div>
                <p className="text-brand-red text-xs font-bold tracking-[0.3em] uppercase mb-1">Step 1</p>
                <h2 className="text-navy-dark text-lg font-black">Your Contact Info</h2>
              </div>

              <div className={fieldClass}>
                <label className={labelClass} htmlFor="parentName">Parent / Guardian Full Name <span className="text-brand-red text-xs font-normal">required</span></label>
                <input id="parentName" type="text" required placeholder="Full name" value={form.parentName} onChange={handleChange} className={inputClass} />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className={`${fieldClass} flex-1`}>
                  <label className={labelClass} htmlFor="email">Email Address <span className="text-brand-red text-xs font-normal">required</span></label>
                  <input id="email" type="email" required placeholder="your@email.com" value={form.email} onChange={handleChange} className={inputClass} />
                </div>
                <div className={`${fieldClass} flex-1`}>
                  <label className={labelClass} htmlFor="phone">Phone Number <span className="text-brand-red text-xs font-normal">required</span></label>
                  <input id="phone" type="tel" required placeholder="(000) 000-0000" value={form.phone} onChange={handleChange} className={inputClass} />
                </div>
              </div>
            </div>

            <hr className="border-surface-border" />

            {/* ── Birthday Person ── */}
            <div className="flex flex-col gap-5">
              <div>
                <p className="text-brand-red text-xs font-bold tracking-[0.3em] uppercase mb-1">Step 2</p>
                <h2 className="text-navy-dark text-lg font-black">About the Birthday Person</h2>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className={`${fieldClass} flex-1`}>
                  <label className={labelClass} htmlFor="birthdayName">Birthday Person's Name <span className="text-brand-red text-xs font-normal">required</span></label>
                  <input id="birthdayName" type="text" required placeholder="Name" value={form.birthdayName} onChange={handleChange} className={inputClass} />
                </div>
                <div className={`${fieldClass} flex-1`}>
                  <label className={labelClass} htmlFor="birthdayAge">Upcoming Age <span className="text-brand-red text-xs font-normal">required</span></label>
                  <input id="birthdayAge" type="text" required placeholder="e.g. 7" value={form.birthdayAge} onChange={handleChange} className={inputClass} />
                </div>
              </div>

              <div className={fieldClass}>
                <span className={labelClass}>Currently enrolled at Capital Core Dance Studio? <span className="text-brand-red text-xs font-normal">required</span></span>
                <div className="flex gap-6 mt-1">
                  {['Yes', 'No'].map((opt) => (
                    <label key={opt} className={radioClass}>
                      <input type="radio" name="enrolled" id="enrolled" value={opt} checked={form.enrolled === opt} onChange={handleChange} required />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <hr className="border-surface-border" />

            {/* ── Date & Time ── */}
            <div className="flex flex-col gap-5">
              <div>
                <p className="text-brand-red text-xs font-bold tracking-[0.3em] uppercase mb-1">Step 3</p>
                <h2 className="text-navy-dark text-lg font-black">Date & Time</h2>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className={`${fieldClass} flex-1`}>
                  <label className={labelClass} htmlFor="dateFirst">First Choice Party Date <span className="text-brand-red text-xs font-normal">required</span></label>
                  <input id="dateFirst" type="date" required value={form.dateFirst} onChange={handleChange} className={inputClass} />
                </div>
                <div className={`${fieldClass} flex-1`}>
                  <label className={labelClass} htmlFor="dateSecond">Second Choice Party Date <span className="text-brand-red text-xs font-normal">required</span></label>
                  <input id="dateSecond" type="date" required value={form.dateSecond} onChange={handleChange} className={inputClass} />
                </div>
              </div>

              <div className={fieldClass}>
                <span className={labelClass}>Preferred Time Slot <span className="text-brand-red text-xs font-normal">required</span></span>
                <div className="flex flex-col gap-2 mt-1">
                  {TIME_SLOTS.map((slot) => (
                    <label key={slot} className={radioClass}>
                      <input type="radio" name="timeSlot" id="timeSlot" value={slot} checked={form.timeSlot === slot} onChange={handleChange} required />
                      {slot}
                    </label>
                  ))}
                </div>
                {form.timeSlot === 'Other' && (
                  <input
                    id="timeSlotOther"
                    type="text"
                    placeholder="Describe your preferred time..."
                    value={form.timeSlotOther}
                    onChange={handleChange}
                    required
                    className={`${inputClass} mt-1`}
                  />
                )}
              </div>

              <div className={fieldClass}>
                <span className={labelClass}>Secondary Time Slot <span className="text-[#8a9aaa] text-xs font-normal">(optional backup preference)</span></span>
                <div className="flex flex-col gap-2 mt-1">
                  {TIME_SLOTS.map((slot) => (
                    <label key={`second-${slot}`} className={radioClass}>
                      <input type="radio" name="timeSlotSecond" id="timeSlotSecond" value={slot} checked={form.timeSlotSecond === slot} onChange={handleChange} />
                      {slot}
                    </label>
                  ))}
                </div>
                {form.timeSlotSecond === 'Other' && (
                  <input
                    id="timeSlotSecondOther"
                    type="text"
                    placeholder="Describe your preferred time..."
                    value={form.timeSlotSecondOther}
                    onChange={handleChange}
                    className={`${inputClass} mt-1`}
                  />
                )}
              </div>
            </div>

            <hr className="border-surface-border" />

            {/* ── Party Details ── */}
            <div className="flex flex-col gap-5">
              <div>
                <p className="text-brand-red text-xs font-bold tracking-[0.3em] uppercase mb-1">Step 4</p>
                <h2 className="text-navy-dark text-lg font-black">Party Details</h2>
              </div>

              <div className={fieldClass}>
                <label className={labelClass} htmlFor="guestCount">Estimated Number of Party Guests <span className="text-brand-red text-xs font-normal">required</span></label>
                <input id="guestCount" type="text" required placeholder="e.g. 12" value={form.guestCount} onChange={handleChange} className={`${inputClass} max-w-xs`} />
              </div>

              <div className={fieldClass}>
                <span className={labelClass}>Theme Selection <span className="text-brand-red text-xs font-normal">required</span></span>
                <div className="flex flex-col gap-2 mt-1">
                  {THEMES.map((theme) => (
                    <label key={theme} className={radioClass}>
                      <input type="radio" name="theme" id="theme" value={theme} checked={form.theme === theme} onChange={handleChange} required />
                      {theme}
                    </label>
                  ))}
                </div>
              </div>

              {form.theme === 'Custom Theme' && (
                <div className={fieldClass}>
                  <label className={labelClass} htmlFor="customTheme">Describe Your Custom Theme</label>
                  <textarea id="customTheme" rows={3} placeholder="Tell us about your vision..." value={form.customTheme} onChange={handleChange} className={`${inputClass} resize-none`} />
                </div>
              )}

              <div className={fieldClass}>
                <span className={labelClass}>Optional Upgrades <span className="text-[#8a9aaa] font-normal">(select all that apply)</span></span>
                <div className="flex flex-col gap-2 mt-1">
                  {UPGRADES.map((upgrade) => (
                    <label key={upgrade} className={radioClass}>
                      <input
                        type="checkbox"
                        id={`upgrade-${upgrade}`}
                        checked={form.upgrades.includes(upgrade)}
                        onChange={handleChange}
                      />
                      {upgrade}
                    </label>
                  ))}
                </div>
                {form.upgrades.includes('Other') && (
                  <input
                    id="upgradeOther"
                    type="text"
                    placeholder="Describe the upgrade you're interested in..."
                    value={form.upgradeOther}
                    onChange={handleChange}
                    className={`${inputClass} mt-1`}
                  />
                )}
              </div>

              <div className={fieldClass}>
                <span className={labelClass}>Will you be bringing food or cake? <span className="text-brand-red text-xs font-normal">required</span></span>
                <div className="flex gap-6 mt-1">
                  {['Yes', 'No'].map((opt) => (
                    <label key={opt} className={radioClass}>
                      <input type="radio" name="bringingFood" id="bringingFood" value={opt} checked={form.bringingFood === opt} onChange={handleChange} required />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>

              <div className={fieldClass}>
                <label className={labelClass} htmlFor="allergies">Any known allergies we should be aware of? <span className="text-brand-red text-xs font-normal">required</span></label>
                <input id="allergies" type="text" placeholder="List any allergies, or write 'None'" required value={form.allergies} onChange={handleChange} className={inputClass} />
              </div>
            </div>

            <hr className="border-surface-border" />

            {/* ── Final Details ── */}
            <div className="flex flex-col gap-5">
              <div>
                <p className="text-brand-red text-xs font-bold tracking-[0.3em] uppercase mb-1">Step 5</p>
                <h2 className="text-navy-dark text-lg font-black">A Few More Details</h2>
              </div>

              <div className={fieldClass}>
                <span className={labelClass}>How did you hear about us? <span className="text-brand-red text-xs font-normal">required</span></span>
                <div className="flex flex-col gap-2 mt-1">
                  {REFERRAL_OPTIONS.map((opt) => (
                    <label key={opt} className={radioClass}>
                      <input type="radio" name="referral" id="referral" value={opt} checked={form.referral === opt} onChange={handleChange} required />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>

              <div className={fieldClass}>
                <label className={labelClass} htmlFor="promoCode">Promo Code <span className="text-[#8a9aaa] font-normal">(optional)</span></label>
                <input id="promoCode" type="text" placeholder="Enter code if you have one" value={form.promoCode} onChange={handleChange} className={`${inputClass} max-w-xs`} />
              </div>

              <div className={fieldClass}>
                <label className={labelClass} htmlFor="notes">Additional Notes <span className="text-[#8a9aaa] font-normal">(optional)</span></label>
                <textarea id="notes" rows={4} placeholder="Anything else we should know?" value={form.notes} onChange={handleChange} className={`${inputClass} resize-none`} />
              </div>
            </div>

            <hr className="border-surface-border" />

            {/* ── Policies ── */}
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-brand-red text-xs font-bold tracking-[0.3em] uppercase mb-1">Step 6</p>
                <h2 className="text-navy-dark text-lg font-black">Policies & Acknowledgements</h2>
              </div>

              <div className="bg-[#fff5f8] border border-[#f4c8d4] rounded-lg px-5 py-4 flex flex-col gap-3">
                {[
                  { id: 'policyDeposit', label: 'I understand that a $50 non-refundable deposit is required to secure my party date.' },
                  { id: 'policyBalance', label: 'I understand the remaining balance is due on the day of the party.' },
                  { id: 'policyConfirm', label: 'I understand that party dates are not confirmed until the deposit is received.' },
                ].map(({ id, label }) => (
                  <label key={id} className="flex items-start gap-3 text-[#3a4a6a] text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      id={id}
                      checked={form[id]}
                      onChange={handleChange}
                      required
                      className="mt-0.5 flex-shrink-0"
                    />
                    {label}
                  </label>
                ))}
              </div>

              <div className="bg-[#f0f6ff] border border-[#c8ddf4] rounded-lg px-5 py-4">
                <label className="flex items-start gap-3 text-[#3a4a6a] text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    id="waiverAck"
                    checked={form.waiverAck}
                    onChange={handleChange}
                    required
                    className="mt-0.5 flex-shrink-0"
                  />
                  I understand that all party guests must have a waiver completed prior to participation.
                </label>
              </div>
            </div>

            {status === 'error' && (
              <p className="text-brand-red text-sm">{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="bg-brand-red text-white font-bold py-3 rounded-md hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === 'submitting' ? 'Submitting…' : 'Submit Booking Request'}
            </button>

            <p className="text-[#8a9aaa] text-xs text-center">
              We'll follow up within 1–2 business days. Questions? Call us at <a href="tel:8042344014" className="underline hover:text-navy-dark">(804) 234-4014</a>.
            </p>

          </form>
        </div>
      </section>

      <Footer />
    </div>
  )
}
