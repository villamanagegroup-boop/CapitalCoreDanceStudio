import { render, screen } from '@testing-library/react'
import PageHeader from './PageHeader'

test('renders eyebrow text', () => {
  render(<PageHeader eyebrow="Capital Core Dance" title="Classes" subtitle="Year-round instruction" />)
  expect(screen.getByText('Capital Core Dance')).toBeInTheDocument()
})

test('renders title', () => {
  render(<PageHeader eyebrow="Capital Core Dance" title="Classes" subtitle="Year-round instruction" />)
  expect(screen.getByRole('heading', { name: 'Classes' })).toBeInTheDocument()
})

test('renders subtitle', () => {
  render(<PageHeader eyebrow="Capital Core Dance" title="Classes" subtitle="Year-round instruction" />)
  expect(screen.getByText('Year-round instruction')).toBeInTheDocument()
})

test('renders without subtitle', () => {
  render(<PageHeader eyebrow="Capital Core Dance" title="Classes" />)
  expect(screen.getByRole('heading', { name: 'Classes' })).toBeInTheDocument()
})
