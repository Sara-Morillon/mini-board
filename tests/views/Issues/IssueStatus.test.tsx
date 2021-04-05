import { IssueStatus } from '@/views/Issues/IssueStatus'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { mockIssue1 } from '../../mocks/fixtures'

describe('IssueStatus', () => {
  it('should render issue status', () => {
    render(<IssueStatus issue={mockIssue1} />)
    expect(screen.getByText('DOING')).toBeInTheDocument()
  })

  it('should render issue status with correct color', () => {
    render(<IssueStatus issue={mockIssue1} />)
    expect(screen.getByText('DOING')).toHaveClass('badge-primary')
  })
})
