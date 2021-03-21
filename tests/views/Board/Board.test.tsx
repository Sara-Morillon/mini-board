import Board, { IBoardProps } from '@/views/Board/Board'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { mockIssue1, mockIssue2, mockRelease1 } from '../../mocks/fixtures'

describe('Board', () => {
  const props: IBoardProps = {
    release: mockRelease1,
    issues: [mockIssue1, mockIssue2],
    projectId: 'projectId',
  }

  it('should render message when no release', () => {
    render(<Board {...props} release={undefined} />)
    expect(screen.getByText('No suitable release found')).toBeInTheDocument()
  })

  it('should render release name', () => {
    render(<Board {...props} />)
    expect(screen.getByText('release1')).toBeInTheDocument()
  })

  it('should render release date', () => {
    render(<Board {...props} />)
    expect(screen.getByText('January 1st, 2020')).toBeInTheDocument()
  })

  it('should render tickets', () => {
    render(<Board {...props} />)
    expect(screen.getByText('[P1-1] title1')).toBeInTheDocument()
    expect(screen.getByText('[P1-2] title2')).toBeInTheDocument()
  })
})
