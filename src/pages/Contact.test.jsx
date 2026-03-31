import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Contact from './Contact'

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
