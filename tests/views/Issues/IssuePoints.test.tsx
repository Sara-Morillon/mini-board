import { render, screen } from '@testing-library/react'
import React from 'react'
import { IssuePoints } from '../../../src/views/Issues/IssuePoints'
import { mockIssue1 } from '../../mocks/fixtures'

describe('IssuePoints', () => {
  it('should render issue points', () => {
    render(<IssuePoints issue={mockIssue1} />)
    expect(screen.getByText('5')).toBeInTheDocument()
  })
})
