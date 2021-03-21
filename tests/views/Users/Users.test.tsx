import ListUsers from '@/views/Users/Users'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { mockUser1, mockUser2 } from '../../mocks/fixtures'

describe('ListUsers', () => {
  it('should render each user', () => {
    render(<ListUsers user={mockUser1} users={[mockUser1, mockUser2]} />)
    expect(screen.getByText('user1')).toBeInTheDocument()
    expect(screen.getByText('user2')).toBeInTheDocument()
  })

  it('should disabled delete if user is the same as session user', () => {
    render(<ListUsers user={mockUser1} users={[mockUser1]} />)
    expect(screen.getByRole('button', { name: /Delete/i })).toBeDisabled()
  })

  it('should enable delete if user is the same as session user', () => {
    render(<ListUsers user={mockUser1} users={[mockUser2]} />)
    expect(screen.getByRole('link', { name: /Delete/i })).toHaveAttribute('href', '/users/delete/2')
  })
})
