import Projects, { IProjectsProps } from '@/views/Projects/Projects'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { mockProject1, mockProject2 } from '../../mocks/fixtures'

describe('Projects', () => {
  const props: IProjectsProps = {
    projects: [mockProject1],
  }

  it('should render create button', () => {
    render(<Projects {...props} />)
    expect(screen.getByText('Create project')).toHaveAttribute('href', '/projects/edit')
  })

  it('should render project name', () => {
    render(<Projects {...props} />)
    expect(screen.getByText('project1')).toBeInTheDocument()
  })

  it('should render project link', () => {
    render(<Projects {...props} />)
    expect(screen.getByText('Edit')).toHaveAttribute('href', '/projects/edit/1')
  })

  it('should render issues link', () => {
    render(<Projects {...props} />)
    expect(screen.getByText('Issues')).toHaveAttribute('href', '/project/1/issues/list')
  })

  it('should not render release if there are no release', () => {
    render(<Projects {...props} />)
    expect(screen.queryByText('Next release:')).not.toBeInTheDocument()
  })

  it('should render next release if there is a release', () => {
    render(<Projects {...props} projects={[mockProject2]} />)
    expect(screen.getByText('Next release: release1')).toBeInTheDocument()
  })

  it('should render next release date if there is a release', () => {
    render(<Projects {...props} projects={[mockProject2]} />)
    expect(screen.getByText('January 1st, 2020')).toBeInTheDocument()
  })
})
