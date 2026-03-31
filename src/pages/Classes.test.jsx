import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Classes from './Classes'

function renderClasses() {
  return render(<MemoryRouter initialEntries={['/classes']}><Classes /></MemoryRouter>)
}

test('renders page title', () => {
  renderClasses()
  expect(screen.getByRole('heading', { name: 'Classes' })).toBeInTheDocument()
})

test('renders class listing cards', () => {
  renderClasses()
  expect(screen.getByText('Ballet')).toBeInTheDocument()
  expect(screen.getByText('Hip Hop')).toBeInTheDocument()
  expect(screen.getByText('Jazz')).toBeInTheDocument()
})

test('renders Enroll Now CTA', () => {
  renderClasses()
  expect(screen.getByRole('link', { name: 'Enroll Now' })).toBeInTheDocument()
})
