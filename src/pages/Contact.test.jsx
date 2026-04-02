import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, afterEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Contact from './Contact'

vi.mock('../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: vi.fn(() => Promise.resolve({ error: null })),
    })),
  },
}))

afterEach(() => {
  vi.restoreAllMocks()
  delete global.fetch
})

function renderContact() {
  return render(<MemoryRouter initialEntries={['/contact']}><Contact /></MemoryRouter>)
}

test('renders page title', () => {
  renderContact()
  expect(screen.getByRole('heading', { name: 'Contact Us' })).toBeInTheDocument()
})

test('renders first and last name fields', () => {
  renderContact()
  expect(screen.getByPlaceholderText('First name')).toBeInTheDocument()
  expect(screen.getByPlaceholderText('Last name')).toBeInTheDocument()
})

test('renders email field', () => {
  renderContact()
  expect(screen.getByPlaceholderText('your@email.com')).toBeInTheDocument()
})

test('renders phone field', () => {
  renderContact()
  expect(screen.getByPlaceholderText('(000) 000-0000')).toBeInTheDocument()
})

test('renders interest dropdown', () => {
  renderContact()
  expect(screen.getByRole('combobox')).toBeInTheDocument()
})

test('renders message textarea', () => {
  renderContact()
  expect(screen.getByPlaceholderText('How can we help?')).toBeInTheDocument()
})

test('renders submit button', () => {
  renderContact()
  expect(screen.getByRole('button', { name: 'Send Message' })).toBeInTheDocument()
})

test('calls /api/notify with contact formType after successful submission', async () => {
  global.fetch = vi.fn(() => Promise.resolve({ ok: true }))

  renderContact()

  fireEvent.change(screen.getByPlaceholderText('First name'), { target: { value: 'Jane' } })
  fireEvent.change(screen.getByPlaceholderText('Last name'), { target: { value: 'Doe' } })
  fireEvent.change(screen.getByPlaceholderText('your@email.com'), { target: { value: 'jane@example.com' } })
  fireEvent.change(screen.getByPlaceholderText('How can we help?'), { target: { value: 'Hello' } })
  fireEvent.click(screen.getByRole('button', { name: 'Send Message' }))

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith('/api/notify', expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: expect.stringContaining('"formType":"contact"'),
    }))
  })
})
