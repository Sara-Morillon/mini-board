import Releases, { IReleasesProps } from '@/views/Releases/Releases'
import { render, screen } from '@testing-library/react'
import mockdate from 'mockdate'
import React from 'react'
import { mockRelease1, mockRelease2 } from '../../mocks/fixtures'

mockdate.set('2020-12-31T00:00:00.000Z')

describe('Releases', () => {
  const props: IReleasesProps = {
    releases: [mockRelease1],
    projectId: 'projectId',
  }

  it('should render create button', () => {
    render(<Releases {...props} />)
    expect(screen.getByText('Create release')).toHaveAttribute('href', '/project/projectId/releases/edit')
  })

  it('should render messages when no releases', () => {
    render(<Releases {...props} releases={[]} />)
    expect(screen.getByText('No release found')).toBeInTheDocument()
  })

  it('should render release name', () => {
    render(<Releases {...props} />)
    expect(screen.getByText('release1')).toBeInTheDocument()
  })

  it('should render release link', () => {
    render(<Releases {...props} />)
    expect(screen.getByText('release1')).toHaveAttribute('href', '/project/projectId/releases/edit/1')
  })

  it('should render release creation date', () => {
    render(<Releases {...props} />)
    expect(screen.getByText('January 1st, 2018')).toBeInTheDocument()
  })

  it('should render release due date', () => {
    render(<Releases {...props} />)
    expect(screen.getByText('January 1st, 2020')).toBeInTheDocument()
  })

  it('should color release due date if due date is soon', () => {
    render(<Releases {...props} />)
    expect(screen.getByText('January 1st, 2020')).toHaveClass('text-danger')
  })

  it('should render release points', () => {
    render(<Releases {...props} releases={[mockRelease2]} />)
    expect(screen.getByText('3/11 points')).toBeInTheDocument()
  })
})
