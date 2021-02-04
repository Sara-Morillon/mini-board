import { render, screen } from '@testing-library/react'
import React from 'react'
import Projects, { IProjectsProps } from '../../../src/views/Projects/Projects'
import { mockProject1 } from '../../mocks/fixtures'

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
})
