// @vitest-environment node
import { vi, describe, it, expect, beforeEach } from 'vitest'

const mockSend = vi.fn()
vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(function () {
    return { emails: { send: mockSend } }
  }),
}))

const { default: handler } = await import('./notify.js')

function makeRes() {
  const res = { status: vi.fn(), json: vi.fn() }
  res.status.mockReturnValue(res)
  res.json.mockReturnValue(res)
  return res
}

beforeEach(() => {
  mockSend.mockReset()
  process.env.ADMIN_EMAIL = 'admin@example.com'
  process.env.FROM_EMAIL = 'from@example.com'
})

describe('notify handler', () => {
  it('returns 405 for non-POST requests', async () => {
    const req = { method: 'GET', body: {} }
    const res = makeRes()
    await handler(req, res)
    expect(res.status).toHaveBeenCalledWith(405)
  })

  it('returns 400 for missing or invalid body', async () => {
    const req = { method: 'POST', body: null }
    const res = makeRes()
    await handler(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
  })

  it('returns 400 for unknown formType', async () => {
    const req = { method: 'POST', body: { formType: 'unknown' } }
    const res = makeRes()
    await handler(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
  })

  it('sends contact email with correct subject', async () => {
    mockSend.mockResolvedValue({ id: 'email-123' })
    const req = {
      method: 'POST',
      body: {
        formType: 'contact',
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        phone: '(804) 555-0000',
        interest: 'classes',
        message: 'Hello there',
      },
    }
    const res = makeRes()
    await handler(req, res)
    expect(mockSend).toHaveBeenCalledWith(expect.objectContaining({
      subject: 'New Contact Form Submission',
      to: 'admin@example.com',
      from: 'from@example.com',
    }))
    expect(res.status).toHaveBeenCalledWith(200)
  })

  it('includes contact form fields in email body', async () => {
    mockSend.mockResolvedValue({ id: 'email-123' })
    const req = {
      method: 'POST',
      body: {
        formType: 'contact',
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        phone: '',
        interest: 'classes',
        message: 'Hello there',
      },
    }
    const res = makeRes()
    await handler(req, res)
    const { html } = mockSend.mock.calls[0][0]
    expect(html).toContain('Jane')
    expect(html).toContain('Doe')
    expect(html).toContain('jane@example.com')
    expect(html).toContain('Hello there')
  })

  it('sends birthday email with correct subject', async () => {
    mockSend.mockResolvedValue({ id: 'email-456' })
    const req = {
      method: 'POST',
      body: {
        formType: 'birthday',
        parentName: 'Sarah Smith',
        email: 'sarah@example.com',
        phone: '(804) 555-1111',
        birthdayName: 'Emma',
        birthdayAge: '7',
        enrolled: 'Yes',
        dateFirst: '2026-05-10',
        dateSecond: '2026-05-17',
        timeSlot: 'Saturday 9:00 – 10:30 AM',
        guestCount: '12',
        theme: 'Princess & Fairytale Dance',
        customTheme: '',
        upgrades: ['Glow Dance Party – $40'],
        bringingFood: 'Yes',
        allergies: 'None',
        referral: 'Social Media',
        promoCode: '',
        notes: '',
      },
    }
    const res = makeRes()
    await handler(req, res)
    expect(mockSend).toHaveBeenCalledWith(expect.objectContaining({
      subject: 'New Birthday Party Booking Request',
      to: 'admin@example.com',
    }))
    expect(res.status).toHaveBeenCalledWith(200)
  })

  it('returns 500 and logs error when Resend throws', async () => {
    mockSend.mockRejectedValue(new Error('Resend API down'))
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const req = {
      method: 'POST',
      body: {
        formType: 'contact',
        firstName: 'Jane', lastName: 'Doe',
        email: 'jane@example.com', phone: '',
        interest: '', message: 'Hi',
      },
    }
    const res = makeRes()
    await handler(req, res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })
})
