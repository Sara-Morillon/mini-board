import { render, screen } from '@testing-library/react'
import mockdate from 'mockdate'
import React from 'react'
import { IIssuesTableProps, IssuesTable } from '../../../src/views/Issues/IssuesTable'
import { mockRelease2 } from '../../mocks/fixtures'

mockdate.set('2020-12-31T00:00:00.000Z')

describe('IssuesTable', () => {
  const props: IIssuesTableProps = {
    release: mockRelease2,
    projectId: 'projectId',
  }

  it('should render issue title', () => {
    render(<IssuesTable {...props} />)
    expect(screen.getByText('[P1-1] title1')).toBeInTheDocument()
  })

  it('should render issue link', () => {
    render(<IssuesTable {...props} />)
    expect(screen.getByText('[P1-1] title1')).toHaveAttribute('href', '/project/projectId/issues/edit/1')
  })

  it('should render issue type', () => {
    render(<IssuesTable {...props} />)
    expect(screen.getByText('[P1-1] title1').firstChild).toHaveClass('bg-danger')
  })

  it('should render issue author', () => {
    render(<IssuesTable {...props} />)
    expect(screen.getByText('user1')).toBeInTheDocument()
  })

  it('should render issue creation date', () => {
    render(<IssuesTable {...props} />)
    expect(screen.getAllByText('January 1st, 2018')).toHaveLength(3)
  })

  it('should render issue points', () => {
    render(<IssuesTable {...props} />)
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('should render release total points', () => {
    render(<IssuesTable {...props} />)
    expect(screen.getByText('3/11 points')).toBeInTheDocument()
  })

  it('should render release due date', () => {
    render(<IssuesTable {...props} />)
    expect(screen.getByText('January 1st, 2021')).toBeInTheDocument()
  })

  it('should color release due date if due date is soon', () => {
    render(<IssuesTable {...props} />)
    expect(screen.getByText('January 1st, 2021')).toHaveClass('text-danger')
  })
})
