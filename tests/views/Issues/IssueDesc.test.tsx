import { render, screen } from '@testing-library/react'
import React from 'react'
import { IssueDesc } from '../../../src/views/Issues/IssueDesc'
import { mockIssue1 } from '../../mocks/fixtures'

describe('IssueDesc', () => {
  it('should render issue date and author', () => {
    render(<IssueDesc issue={mockIssue1} />)
    expect(screen.getByText('Created on January 1st, 2018 by user1')).toBeInTheDocument()
  })
})
