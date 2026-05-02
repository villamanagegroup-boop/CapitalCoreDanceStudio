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

function buildRecitalOrderEmail(data) {
  return `
    <h2>New Recital T-Shirt Order</h2>
    <p><strong>Contact Name:</strong> ${escapeHtml(data.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
    <p><strong>Items Ordered:</strong> ${escapeHtml(data.lineItems)}</p>
    <p><strong>Total Paid:</strong> $${escapeHtml(String(data.total))}</p>
    <p><strong>Promo Code:</strong> ${escapeHtml(data.promoCode) || 'None'}</p>
    <p><strong>PayPal Order ID:</strong> ${escapeHtml(data.paypalOrderId) || 'N/A (free order)'}</p>
  `
}

function buildRecitalTicketEmail(data) {
  return `
    <h2>New Recital Ticket Order</h2>
    <p><strong>Contact Name:</strong> ${escapeHtml(data.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
    <p><strong>Show:</strong> ${escapeHtml(data.show)}${data.showDate ? ` — ${escapeHtml(data.showDate)} at ${escapeHtml(data.showTime)}` : ''}</p>
    <p><strong>Adult Tickets:</strong> ${escapeHtml(String(data.adultQty))}</p>
    <p><strong>Child Tickets (3 &amp; under, free):</strong> ${escapeHtml(String(data.childQty))}</p>
    <p><strong>Subtotal:</strong> $${escapeHtml(String(data.subtotal))}</p>
    <p><strong>Discount:</strong> $${escapeHtml(String(data.discount))}</p>
    <p><strong>Total Paid:</strong> $${escapeHtml(String(data.total))}</p>
    <p><strong>Promo Code:</strong> ${escapeHtml(data.promoCode) || 'None'}</p>
    <p><strong>PayPal Order ID:</strong> ${escapeHtml(data.paypalOrderId) || 'N/A (free order)'}</p>
  `
}

function buildRecitalProgramEmail(data) {
  return `
    <h2>New Recital Program Order</h2>
    <p><strong>Contact Name:</strong> ${escapeHtml(data.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
    <p><strong>Quantity:</strong> ${escapeHtml(String(data.qty))}</p>
    <p><strong>Unit Price:</strong> $${escapeHtml(String(data.unitPrice))}</p>
    <p><strong>Subtotal:</strong> $${escapeHtml(String(data.subtotal))}</p>
    <p><strong>Discount:</strong> $${escapeHtml(String(data.discount))}</p>
    <p><strong>Total Paid:</strong> $${escapeHtml(String(data.total))}</p>
    <p><strong>Promo Code:</strong> ${escapeHtml(data.promoCode) || 'None'}</p>
    <p><strong>PayPal Order ID:</strong> ${escapeHtml(data.paypalOrderId) || 'N/A (free order)'}</p>
  `
}

function buildRecitalCombinedAdminEmail(data) {
  const ticketLine = (data.adultQty || 0) + (data.childQty || 0) > 0
    ? `<p><strong>Tickets:</strong> ${escapeHtml(String(data.adultQty))} adult${data.childQty ? ` + ${escapeHtml(String(data.childQty))} child (free)` : ''} for ${escapeHtml(data.showLabel || '')} (${escapeHtml(data.showDate || '')} ${escapeHtml(data.showTime || '')}) — $${escapeHtml(String(data.ticketSubtotal))}</p>`
    : ''
  const programLine = data.programQty > 0
    ? `<p><strong>Programs:</strong> ${escapeHtml(String(data.programQty))} × — $${escapeHtml(String(data.programSubtotal))}</p>`
    : ''
  const shirtLine = data.shirtLineItems
    ? `<p><strong>Shirts:</strong> ${escapeHtml(data.shirtLineItems)} — $${escapeHtml(String(data.shirtSubtotal))}</p>`
    : ''

  return `
    <h2>New Recital Order</h2>
    <p><strong>Contact:</strong> ${escapeHtml(data.name)} &lt;${escapeHtml(data.email)}&gt;</p>
    <hr />
    ${ticketLine}
    ${programLine}
    ${shirtLine}
    <hr />
    <p><strong>Subtotal:</strong> $${escapeHtml(String(data.subtotal))}</p>
    <p><strong>Discount:</strong> $${escapeHtml(String(data.discount))} ${data.promoCode ? `(${escapeHtml(data.promoCode)})` : ''}</p>
    <p><strong>Total Paid:</strong> $${escapeHtml(String(data.total))}</p>
    <p><strong>PayPal Order ID:</strong> ${escapeHtml(data.paypalOrderId) || 'N/A (free order)'}</p>
  `
}

function buildRecitalCombinedCustomerEmail(data) {
  const venue = escapeHtml(data.showVenue || 'Richmond Christian School')
  const address = escapeHtml(data.showAddress || '6511 Belmont Rd, Chesterfield, VA 23832')
  const showDate = escapeHtml(data.showDate || 'Saturday, June 13, 2026')
  const showTime = escapeHtml(data.showTime || '2:00 PM')

  const items = []
  if ((data.adultQty || 0) + (data.childQty || 0) > 0) {
    let line = `${data.adultQty} adult ticket${data.adultQty === 1 ? '' : 's'}`
    if (data.childQty > 0) line += ` + ${data.childQty} child${data.childQty === 1 ? '' : 'ren'} (3 & under, free)`
    items.push(`<li>🎟 <strong>${escapeHtml(line)}</strong> — ${showDate} at ${showTime}</li>`)
  }
  if (data.programQty > 0) {
    items.push(`<li>📖 <strong>${escapeHtml(String(data.programQty))} show program${data.programQty === 1 ? '' : 's'}</strong> — pickup at the show</li>`)
  }
  if (data.shirtLineItems) {
    items.push(`<li>👕 <strong>T-shirts:</strong> ${escapeHtml(data.shirtLineItems)} — pickup at the studio (date TBA)</li>`)
  }

  const ticketBox = (data.adultQty || 0) + (data.childQty || 0) > 0 ? `
    <div style="margin:24px 0;border:2px solid #C9A84C;border-radius:12px;overflow:hidden;">
      <img src="https://capitalcoredance.com/ticket-banner.png" alt="A Night at the Cinema — Spring Show Ticket" style="display:block;width:100%;height:auto;" />
      <div style="background:#fdf8f0;padding:20px;">
        <p style="margin:0 0 8px 0;color:#C9A84C;font-size:11px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;">Your Ticket Confirmation</p>
        <p style="margin:0 0 4px 0;font-size:18px;font-weight:bold;color:#0B1F3A;">${escapeHtml(data.name)}</p>
        <p style="margin:0 0 12px 0;font-size:14px;color:#555;">${escapeHtml(String(data.adultQty))} adult${data.adultQty === 1 ? '' : 's'}${data.childQty ? ` + ${escapeHtml(String(data.childQty))} child${data.childQty === 1 ? '' : 'ren'}` : ''}</p>
        <p style="margin:0;font-size:14px;color:#0B1F3A;"><strong>${showDate} · ${showTime}</strong></p>
        <p style="margin:4px 0 12px 0;font-size:13px;color:#666;">${venue} · ${address}</p>
        <p style="margin:0;padding-top:12px;border-top:1px solid #C9A84C;font-size:13px;color:#0B1F3A;font-weight:bold;">Show this email at the door for entry.</p>
        ${data.paypalOrderId ? `<p style="margin:6px 0 0 0;font-size:11px;color:#999;">Order ID: ${escapeHtml(data.paypalOrderId)}</p>` : ''}
      </div>
    </div>
  ` : ''

  return `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#333;">
      <div style="text-align:center;padding:24px 0;border-bottom:3px solid #C9A84C;">
        <h1 style="margin:0;color:#0B1F3A;font-size:24px;">Capital Core Dance Studio</h1>
        <p style="margin:6px 0 0 0;color:#C9A84C;font-style:italic;font-size:14px;">A Night at the Cinema · Annual Recital 2026</p>
      </div>

      <div style="padding:24px 0;">
        <h2 style="color:#0B1F3A;margin:0 0 12px 0;">Thank you, ${escapeHtml(data.name)}!</h2>
        <p style="font-size:15px;line-height:1.6;margin:0 0 16px 0;">
          Your recital order has been confirmed. Here's everything you ordered:
        </p>
        <ul style="font-size:14px;line-height:1.8;padding-left:20px;">
          ${items.join('\n')}
        </ul>

        ${ticketBox}

        <table style="width:100%;border-collapse:collapse;margin:20px 0;font-size:14px;">
          <tr><td style="padding:6px 0;color:#666;">Subtotal</td><td style="padding:6px 0;text-align:right;">$${escapeHtml(String(data.subtotal))}</td></tr>
          ${data.discount > 0 ? `<tr><td style="padding:6px 0;color:#0a7c3e;">Discount${data.promoCode ? ` (${escapeHtml(data.promoCode)})` : ''}</td><td style="padding:6px 0;text-align:right;color:#0a7c3e;">−$${escapeHtml(String(data.discount))}</td></tr>` : ''}
          <tr style="border-top:2px solid #0B1F3A;"><td style="padding:10px 0 6px 0;font-weight:bold;color:#0B1F3A;">Total Paid</td><td style="padding:10px 0 6px 0;text-align:right;font-weight:bold;color:#0B1F3A;font-size:18px;">$${escapeHtml(String(data.total))}</td></tr>
        </table>

        <h3 style="color:#0B1F3A;margin:24px 0 8px 0;font-size:16px;">What's next?</h3>
        <ul style="font-size:14px;line-height:1.8;padding-left:20px;color:#555;">
          ${(data.adultQty || 0) + (data.childQty || 0) > 0 ? `<li><strong>Tickets:</strong> Show this email at the door on show day. Children 3 &amp; under are free and don't need a ticket.</li>` : ''}
          ${data.programQty > 0 ? `<li><strong>Programs:</strong> Pick up your program at the show — ${venue}.</li>` : ''}
          ${data.shirtLineItems ? `<li><strong>T-shirts:</strong> Made to order. We'll email you when they're ready for pickup at the studio.</li>` : ''}
        </ul>

        <p style="font-size:13px;color:#888;margin:24px 0 0 0;line-height:1.6;">
          Questions? Reply to this email or contact us at
          <a href="mailto:info@capitalcoredance.com" style="color:#C9A84C;">info@capitalcoredance.com</a>
          or call (804) 234-4014.
        </p>
      </div>

      <div style="text-align:center;padding:16px 0;border-top:1px solid #eee;color:#999;font-size:12px;">
        Capital Core Dance Studio · 13110 Midlothian Turnpike, Midlothian, VA 23113
      </div>
    </div>
  `
}

function buildBirthdayDepositEmail(data) {
  return `
    <h2>Birthday Party Deposit Received</h2>
    <p><strong>Parent:</strong> ${escapeHtml(data.parentName)} &lt;${escapeHtml(data.email)}&gt;</p>
    <p><strong>Birthday Person:</strong> ${escapeHtml(data.birthdayName) || 'N/A'}</p>
    <p><strong>Requested Date:</strong> ${escapeHtml(data.dateFirst) || 'N/A'}</p>
    <p><strong>Amount Paid:</strong> $${escapeHtml(String(data.amount))}</p>
    <p><strong>PayPal Order ID:</strong> ${escapeHtml(data.paypalOrderId)}</p>
    <p><strong>Booking Record ID:</strong> ${escapeHtml(data.bookingId) || 'N/A'}</p>
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
  } else if (formType === 'birthday_deposit') {
    subject = 'Birthday Party Deposit Received'
    html = buildBirthdayDepositEmail(data)
  } else if (formType === 'recital_order') {
    subject = 'New Recital T-Shirt Order'
    html = buildRecitalOrderEmail(data)
  } else if (formType === 'recital_ticket') {
    subject = 'New Recital Ticket Order'
    html = buildRecitalTicketEmail(data)
  } else if (formType === 'recital_program') {
    subject = 'New Recital Program Order'
    html = buildRecitalProgramEmail(data)
  } else if (formType === 'recital_combined') {
    subject = 'New Recital Order'
    html = buildRecitalCombinedAdminEmail(data)
  } else {
    return res.status(400).json({ error: 'Unknown formType' })
  }

  try {
    // Notify admin
    await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to: process.env.ADMIN_EMAIL,
      subject,
      html,
    })

    // Send customer confirmation for combined recital orders
    if (formType === 'recital_combined' && data.email) {
      try {
        await resend.emails.send({
          from: process.env.FROM_EMAIL,
          to: data.email,
          subject: 'Your Recital Order Confirmation – Capital Core Dance Studio',
          html: buildRecitalCombinedCustomerEmail(data),
        })
      } catch (custErr) {
        console.error('Customer email error (non-fatal):', custErr)
      }
    }

    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('Resend error:', err)
    return res.status(500).json({ error: 'Failed to send email' })
  }
}
