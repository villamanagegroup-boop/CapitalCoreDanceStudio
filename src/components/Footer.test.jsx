import { render, screen } from '@testing-library/react'
import Footer from './Footer'

test('renders studio name', () => {
  render(<Footer />)
  expect(screen.getByText('CAPITAL CORE DANCE STUDIO')).toBeInTheDocument()
})

test('renders location placeholder', () => {
  render(<Footer />)
  expect(screen.getByText(/Midlothian, Virginia/)).toBeInTheDocument()
})

test('renders copyright', () => {
  render(<Footer />)
  expect(screen.getByText(/© 2026 Capital Core Dance Studio/)).toBeInTheDocument()
})
