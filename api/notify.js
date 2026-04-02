import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

function buildContactEmail({ firstName, lastName, email, phone, interest, message }) {
  return `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${firstName} ${lastName}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
    <p><strong>Interest:</strong> ${interest || 'Not specified'}</p>
    <p><strong>Message:</strong></p>
    <p>${message}</p>
  `
}

function buildBirthdayEmail(data) {
  return `
    <h2>New Birthday Party Booking Request</h2>
    <p><strong>Parent Name:</strong> ${data.parentName}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Phone:</strong> ${data.phone}</p>
    <p><strong>Birthday Person:</strong> ${data.birthdayName}, turning ${data.birthdayAge}</p>
    <p><strong>Currently Enrolled:</strong> ${data.enrolled}</p>
    <p><strong>1st Choice Date:</strong> ${data.dateFirst}</p>
    <p><strong>2nd Choice Date:</strong> ${data.dateSecond}</p>
    <p><strong>Time Slot:</strong> ${data.timeSlot}</p>
    <p><strong>Estimated Guests:</strong> ${data.guestCount}</p>
    <p><strong>Theme:</strong> ${data.theme}${data.customTheme ? ` — ${data.customTheme}` : ''}</p>
    <p><strong>Upgrades:</strong> ${data.upgrades?.length ? data.upgrades.join(', ') : 'None'}</p>
    <p><strong>Bringing Food:</strong> ${data.bringingFood}</p>
    <p><strong>Allergies:</strong> ${data.allergies || 'None'}</p>
    <p><strong>Referral:</strong> ${data.referral}</p>
    <p><strong>Promo Code:</strong> ${data.promoCode || 'None'}</p>
    <p><strong>Notes:</strong> ${data.notes || 'None'}</p>
  `
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
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
