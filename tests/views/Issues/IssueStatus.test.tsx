import { render, screen } from '@testing-library/react'
import React from 'react'
import { IssueStatus } from '../../../src/views/Issues/IssueStatus'
import { mockIssue1 } from '../../mocks/fixtures'

describe('IssueStatus', () => {
  it('should render issue status', () => {
    render(<IssueStatus issue={mockIssue1} />)
    expect(screen.getByText('doing')).toBeInTheDocument()
  })

  it('should render issue status with correct color', () => {
    render(<IssueStatus issue={mockIssue1} />)
    expect(screen.getByText('doing')).toHaveClass('badge-primary')
  })
})
