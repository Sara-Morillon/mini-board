import Issues, { IIssuesProps } from '@/views/Issues/Issues'
import { render, screen } from '@testing-library/react'
import mockdate from 'mockdate'
import React from 'react'
import { mockRelease2 } from '../../mocks/fixtures'

mockdate.set('2020-12-31T00:00:00.000Z')

describe('Issues', () => {
  const props: IIssuesProps = {
    all: '',
    releases: [mockRelease2],
    projectId: 'projectId',
  }

  it('should render create button', () => {
    render(<Issues {...props} />)
    expect(screen.getByText('Create issue')).toHaveAttribute('href', '/project/projectId/issues/edit')
  })

  it('should render issues toggle', () => {
    render(<Issues {...props} />)
    expect(screen.getByText('All issues')).toBeInTheDocument()
  })

  it('should render messages when no issues', () => {
    render(<Issues {...props} releases={[]} />)
    expect(screen.getByText('No issue found')).toBeInTheDocument()
  })

  it('should render issues title', () => {
    render(<Issues {...props} />)
    expect(screen.getByText('[P1-1] title1')).toBeInTheDocument()
    expect(screen.getByText('[P1-2] title2')).toBeInTheDocument()
  })
})
