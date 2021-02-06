import { render, screen } from '@testing-library/react'
import mockdate from 'mockdate'
import React from 'react'
import Issues, { IIssuesProps } from '../../../src/views/Issues/Issues'
import { mockIssue1 } from '../../mocks/fixtures'

mockdate.set('2020-12-31T00:00:00.000Z')

describe('Issues', () => {
  const props: IIssuesProps = {
    issues: [mockIssue1],
    projectId: 'projectId',
  }

  it('should render create button', () => {
    render(<Issues {...props} />)
    expect(screen.getByText('Create issue')).toHaveAttribute('href', '/project/projectId/issues/edit')
  })

  it('should render messages when no issues', () => {
    render(<Issues {...props} issues={[]} />)
    expect(screen.getByText('No issue found')).toBeInTheDocument()
  })

  it('should render issue title', () => {
    render(<Issues {...props} />)
    expect(screen.getByText('title1')).toBeInTheDocument()
  })

  it('should render issue link', () => {
    render(<Issues {...props} />)
    expect(screen.getByText('title1')).toHaveAttribute('href', '/project/projectId/issues/edit/1')
  })

  it('should render issue type', () => {
    render(<Issues {...props} />)
    expect(screen.getByText('title1').firstChild).toHaveClass('bg-danger')
  })

  it('should render issue author', () => {
    render(<Issues {...props} />)
    expect(screen.getByText('user1')).toBeInTheDocument()
  })

  it('should render issue due date', () => {
    render(<Issues {...props} />)
    expect(screen.getByText('January 1st, 2020')).toBeInTheDocument()
  })

  it('should color issue due date if due date is soon', () => {
    render(<Issues {...props} />)
    expect(screen.getByText('January 1st, 2020')).toHaveClass('text-danger')
  })

  it('should render issue creation date', () => {
    render(<Issues {...props} />)
    expect(screen.getByText('January 1st, 2018')).toBeInTheDocument()
  })

  it('should render issue points', () => {
    render(<Issues {...props} />)
    expect(screen.getByText('5')).toBeInTheDocument()
  })
})
