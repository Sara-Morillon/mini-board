import { IssuePoints } from '@/views/Issues/IssuePoints'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { mockIssue1 } from '../../mocks/fixtures'

describe('IssuePoints', () => {
  it('should render issue points', () => {
    render(<IssuePoints issue={mockIssue1} />)
    expect(screen.getByText('5')).toBeInTheDocument()
  })
})
