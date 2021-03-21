import { IssueType } from '@/views/Issues/IssueType'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { mockIssue1 } from '../../mocks/fixtures'

describe('IssueType', () => {
  it('should render correct color', () => {
    render(<IssueType issue={mockIssue1} />)
    expect(screen.getByText('•')).toHaveClass('text-danger')
  })
})
