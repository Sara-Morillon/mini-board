import { render, screen } from '@testing-library/react'
import React from 'react'
import { ITicketProps, Ticket } from '../../../src/views/Board/Ticket'
import { mockIssue1, mockIssue2, mockIssue3 } from '../../mocks/fixtures'

describe('Ticket', () => {
  const props: ITicketProps = {
    status: 'doing',
    issue: mockIssue1,
    projectId: 'projectId',
  }

  it('should render nothing when status does not fit', () => {
    const { baseElement } = render(<Ticket {...props} issue={mockIssue2} />)
    expect(baseElement.firstChild).toBeEmptyDOMElement()
  })

  it('should render issue points', () => {
    render(<Ticket {...props} />)
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('should render issue title', () => {
    render(<Ticket {...props} />)
    expect(screen.getByText('title1')).toBeInTheDocument()
  })

  it('should render first 50 characters of issue description', () => {
    render(<Ticket {...props} issue={mockIssue3} />)
    expect(screen.getByText('a'.repeat(50))).toBeInTheDocument()
  })

  it('should render open link', () => {
    render(<Ticket {...props} />)
    expect(screen.getByText('Open')).toHaveAttribute('href', '/project/projectId/issues/edit/1')
  })
})
