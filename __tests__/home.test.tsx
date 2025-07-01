/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'

// Simple component test without NextAuth dependencies
describe('Basic Component Tests', () => {
  it('renders a simple div', () => {
    const TestComponent = () => <div>Test Component</div>
    render(<TestComponent />)
    expect(screen.getByText('Test Component')).toBeTruthy()
  })

  it('checks if document object is available', () => {
    expect(document).toBeDefined()
    expect(window).toBeDefined()
  })
})
