import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Birthdays from './Birthdays'

function renderBirthdays() {
  return render(<MemoryRouter initialEntries={['/birthdays']}><Birthdays /></MemoryRouter>)
}

test('renders page title', () => {
  renderBirthdays()
  expect(screen.getByRole('heading', { name: 'Birthdays' })).toBeInTheDocument()
})

test('renders party package cards', () => {
  renderBirthdays()
  expect(screen.getByText('Mini Dancer Party')).toBeInTheDocument()
  expect(screen.getByText('Studio Star Party')).toBeInTheDocument()
  expect(screen.getByText('VIP Dance Bash')).toBeInTheDocument()
})

test('renders Book a Party CTA', () => {
  renderBirthdays()
  expect(screen.getByRole('link', { name: 'Book a Party' })).toBeInTheDocument()
})
