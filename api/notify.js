import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function buildContactEmail({ firstName, lastName, email, phone, interest, message }) {
  return `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${escapeHtml(firstName)} ${escapeHtml(lastName)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(phone) || 'Not provided'}</p>
    <p><strong>Interest:</strong> ${escapeHtml(interest) || 'Not specified'}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(message)}</p>
  `
}

function buildBirthdayEmail(data) {
  return `
    <h2>New Birthday Party Booking Request</h2>
    <p><strong>Parent Name:</strong> ${escapeHtml(data.parentName)}</p>
    <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>
    <p><strong>Birthday Person:</strong> ${escapeHtml(data.birthdayName)}, turning ${escapeHtml(data.birthdayAge)}</p>
    <p><strong>Currently Enrolled:</strong> ${escapeHtml(data.enrolled)}</p>
    <p><strong>1st Choice Date:</strong> ${escapeHtml(data.dateFirst)}</p>
    <p><strong>2nd Choice Date:</strong> ${escapeHtml(data.dateSecond)}</p>
    <p><strong>Time Slot:</strong> ${escapeHtml(data.timeSlot)}</p>
    <p><strong>Estimated Guests:</strong> ${escapeHtml(data.guestCount)}</p>
    <p><strong>Theme:</strong> ${escapeHtml(data.theme)}${data.customTheme ? ` — ${escapeHtml(data.customTheme)}` : ''}</p>
    <p><strong>Upgrades:</strong> ${data.upgrades?.length ? data.upgrades.map(u => escapeHtml(u)).join(', ') : 'None'}</p>
    <p><strong>Bringing Food:</strong> ${escapeHtml(data.bringingFood)}</p>
    <p><strong>Allergies:</strong> ${escapeHtml(data.allergies) || 'None'}</p>
    <p><strong>Referral:</strong> ${escapeHtml(data.referral)}</p>
    <p><strong>Promo Code:</strong> ${escapeHtml(data.promoCode) || 'None'}</p>
    <p><strong>Notes:</strong> ${escapeHtml(data.notes) || 'None'}</p>
  `
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!req.body || typeof req.body !== 'object') {
    return res.status(400).json({ error: 'Invalid request body' })
  }

  const { formType, ...data } = req.body

  let subject, html
  if (formType === 'contact') {
    subject = 'New Contact Form Submission'
    html = buildContactEmail(data)
  } else if (formType === 'birthday') {
    subject = 'New Birthday Party Booking Request'
    html = buildBirthdayEmail(data)
  } else {
    return res.status(400).json({ error: 'Unknown formType' })
  }

  try {
    await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to: process.env.ADMIN_EMAIL,
      subject,
      html,
    })
    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('Resend error:', err)
    return res.status(500).json({ error: 'Failed to send email' })
  }
}
