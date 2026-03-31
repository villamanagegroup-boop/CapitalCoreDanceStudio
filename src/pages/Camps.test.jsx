import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Camps from './Camps'

function renderCamps() {
  return render(<MemoryRouter initialEntries={['/camps']}><Camps /></MemoryRouter>)
}

test('renders page title', () => {
  renderCamps()
  expect(screen.getByRole('heading', { name: 'Camps' })).toBeInTheDocument()
})

test('renders camp listing cards', () => {
  renderCamps()
  expect(screen.getByText('Summer Intensive')).toBeInTheDocument()
  expect(screen.getByText('Holiday Camp')).toBeInTheDocument()
  expect(screen.getByText('Spring Break Camp')).toBeInTheDocument()
})

test('renders Register CTA', () => {
  renderCamps()
  expect(screen.getByRole('link', { name: 'Register Now' })).toBeInTheDocument()
})
