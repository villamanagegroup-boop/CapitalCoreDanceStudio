import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Home from './Home'

function renderHome() {
  return render(<MemoryRouter><Home /></MemoryRouter>)
}

test('renders hero headline', () => {
  renderHome()
  expect(screen.getByText('MOVE WITH')).toBeInTheDocument()
  expect(screen.getByText('PURPOSE')).toBeInTheDocument()
})

test('renders hero subtext', () => {
  renderHome()
  expect(screen.getByText(/Classes, camps, and birthday parties/)).toBeInTheDocument()
})

test('renders all 4 section card titles', () => {
  renderHome()
  expect(screen.getAllByRole('link', { name: /Classes/ })[0]).toBeInTheDocument()
  expect(screen.getAllByRole('link', { name: /Camps/ })[0]).toBeInTheDocument()
  expect(screen.getAllByRole('link', { name: /Birthdays/ })[0]).toBeInTheDocument()
  expect(screen.getAllByRole('link', { name: /Contact Us/ })[0]).toBeInTheDocument()
})

test('renders What We Offer section heading', () => {
  renderHome()
  expect(screen.getByText('Everything your dancer needs')).toBeInTheDocument()
})
