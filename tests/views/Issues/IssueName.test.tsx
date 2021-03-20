import { render, screen } from '@testing-library/react'
import React from 'react'
import { IssueName } from '../../../src/views/Issues/IssueName'
import { mockIssue1 } from '../../mocks/fixtures'

describe('IssueName', () => {
  it('should render issue key and name', () => {
    render(<IssueName projectId="projectId" issue={mockIssue1} />)
    expect(screen.getByText('[P1-1] title1')).toBeInTheDocument()
  })

  it('should render issue link', () => {
    render(<IssueName projectId="projectId" issue={mockIssue1} />)
    expect(screen.getByText('[P1-1] title1')).toHaveAttribute('href', '/project/projectId/issues/edit/1')
  })
})
