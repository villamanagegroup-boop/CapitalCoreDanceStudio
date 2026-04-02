import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, afterEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import BirthdayForm from './BirthdayForm'

vi.mock('../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: vi.fn(() => Promise.resolve({ error: null })),
    })),
  },
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => vi.fn() }
})

afterEach(() => {
  vi.restoreAllMocks()
})

function renderForm() {
  return render(<MemoryRouter><BirthdayForm /></MemoryRouter>)
}

test('renders page heading', () => {
  renderForm()
  expect(screen.getByRole('heading', { name: 'Birthday Party Request' })).toBeInTheDocument()
})

test('calls /api/notify with birthday formType after successful submission', async () => {
  global.fetch = vi.fn(() => Promise.resolve({ ok: true }))

  renderForm()

  // Fill required fields
  fireEvent.change(screen.getByPlaceholderText('Full name'), { target: { value: 'Sarah Smith' } })
  fireEvent.change(screen.getByPlaceholderText('your@email.com'), { target: { value: 'sarah@example.com' } })
  fireEvent.change(screen.getByPlaceholderText('(000) 000-0000'), { target: { value: '8045550000' } })
  fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'Emma' } })
  fireEvent.change(screen.getByPlaceholderText('e.g. 7'), { target: { value: '7' } })
  fireEvent.change(screen.getByPlaceholderText('e.g. 12'), { target: { value: '10' } })
  fireEvent.change(screen.getByPlaceholderText("List any allergies, or write 'None'"), { target: { value: 'None' } })

  // Date inputs
  fireEvent.change(screen.getByLabelText('First Choice Party Date'), { target: { value: '2026-05-10' } })
  fireEvent.change(screen.getByLabelText('Second Choice Party Date'), { target: { value: '2026-05-17' } })

  // Radio groups — pick first option in each
  const enrolledRadios = screen.getAllByRole('radio').filter(r => r.name === 'enrolled')
  fireEvent.click(enrolledRadios[0])
  const timeSlotRadios = screen.getAllByRole('radio').filter(r => r.name === 'timeSlot')
  fireEvent.click(timeSlotRadios[0])
  const themeRadios = screen.getAllByRole('radio').filter(r => r.name === 'theme')
  fireEvent.click(themeRadios[0])
  const foodRadios = screen.getAllByRole('radio').filter(r => r.name === 'bringingFood')
  fireEvent.click(foodRadios[0])
  const referralRadios = screen.getAllByRole('radio').filter(r => r.name === 'referral')
  fireEvent.click(referralRadios[0])

  // Policy checkboxes
  fireEvent.click(screen.getByLabelText(/non-refundable deposit/))
  fireEvent.click(screen.getByLabelText(/remaining balance/))
  fireEvent.click(screen.getByLabelText(/not confirmed until the deposit/))
  fireEvent.click(screen.getByLabelText(/waiver/))

  fireEvent.click(screen.getByRole('button', { name: 'Submit Booking Request' }))

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith('/api/notify', expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: expect.stringContaining('"formType":"birthday"'),
    }))
  })
})
