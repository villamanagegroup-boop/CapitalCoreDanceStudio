import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Classes from './Classes'

function renderClasses() {
  return render(<MemoryRouter initialEntries={['/classes']}><Classes /></MemoryRouter>)
}

test('renders page title', () => {
  renderClasses()
  expect(screen.getByRole('heading', { name: 'Classes' })).toBeInTheDocument()
})

test('renders day group headers by default', () => {
  renderClasses()
  // Days appear in both filter buttons and section headers — check at least one exists
  expect(screen.getAllByText('Monday').length).toBeGreaterThan(0)
  expect(screen.getAllByText('Tuesday').length).toBeGreaterThan(0)
  expect(screen.getAllByText('Wednesday').length).toBeGreaterThan(0)
  expect(screen.getAllByText('Thursday').length).toBeGreaterThan(0)
  expect(screen.getAllByText('Friday').length).toBeGreaterThan(0)
})

test('renders real class names', () => {
  renderClasses()
  expect(screen.getAllByText('Tiny Ballet + Tumble').length).toBeGreaterThan(0)
  expect(screen.getAllByText('Irish Dance').length).toBeGreaterThan(0)
  expect(screen.getByText('Hip Hop + Breakdancing')).toBeInTheDocument()
  // Musical Theatre appears as both a filter chip and class name
  expect(screen.getAllByText('Musical Theatre').length).toBeGreaterThan(0)
  expect(screen.getByText('Tumble Techniques')).toBeInTheDocument()
})

test('does not render Private Lessons', () => {
  renderClasses()
  expect(screen.queryByText('Private Lessons')).not.toBeInTheDocument()
})

test('renders filter bar with day, age, and style filters', () => {
  renderClasses()
  expect(screen.getByText('Monday', { selector: 'button' })).toBeInTheDocument()
  expect(screen.getByText('Tiny (2–5)')).toBeInTheDocument()
  expect(screen.getByText('Hip Hop')).toBeInTheDocument()
})

test('day filter shows only selected day', () => {
  renderClasses()
  fireEvent.click(screen.getByText('Wednesday', { selector: 'button' }))
  expect(screen.getByText('Wednesday', { selector: 'div' })).toBeInTheDocument()
  expect(screen.queryByText('Monday', { selector: 'div' })).not.toBeInTheDocument()
})

test('renders Enroll Now CTA', () => {
  renderClasses()
  expect(screen.getByRole('link', { name: 'Enroll Now' })).toBeInTheDocument()
})
