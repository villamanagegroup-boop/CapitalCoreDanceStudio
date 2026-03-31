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

test('renders day group headers', () => {
  renderClasses()
  expect(screen.getByText('Monday')).toBeInTheDocument()
  expect(screen.getByText('Tuesday')).toBeInTheDocument()
  expect(screen.getByText('Wednesday')).toBeInTheDocument()
  expect(screen.getByText('Thursday')).toBeInTheDocument()
  expect(screen.getByText('Friday')).toBeInTheDocument()
})

test('renders real class names', () => {
  renderClasses()
  expect(screen.getAllByText('Tiny Ballet + Tumble').length).toBeGreaterThan(0)
  expect(screen.getAllByText('Irish Dance').length).toBeGreaterThan(0)
  expect(screen.getByText('Hip Hop + Breakdancing')).toBeInTheDocument()
  expect(screen.getByText('Musical Theatre')).toBeInTheDocument()
  expect(screen.getByText('Tumble Techniques')).toBeInTheDocument()
})

test('renders Enroll Now CTA', () => {
  renderClasses()
  expect(screen.getByRole('link', { name: 'Enroll Now' })).toBeInTheDocument()
})
