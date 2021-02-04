import { render, screen } from '@testing-library/react'
import React from 'react'
import Project, { IProjectProps } from '../../../src/views/Projects/Project'
import { mockProject1 } from '../../mocks/fixtures'

describe('Project', () => {
  const props: IProjectProps = {
    project: mockProject1,
  }

  it('should set action url with project id', () => {
    const { baseElement } = render(<Project {...props} />)
    expect(baseElement.querySelector('form')).toHaveAttribute('action', '/projects/edit/1')
  })

  it('should set action url without project id', () => {
    const { baseElement } = render(<Project {...props} project={undefined} />)
    expect(baseElement.querySelector('form')).toHaveAttribute('action', '/projects/edit')
  })

  it('should set project name', () => {
    render(<Project {...props} />)
    expect(screen.getByLabelText('Name')).toHaveValue('project1')
  })

  it('should set project description', () => {
    render(<Project {...props} />)
    expect(screen.getByLabelText('Description')).toHaveValue('description1')
  })

  it('should render delete project button', () => {
    render(<Project {...props} />)
    expect(screen.getByText('Delete')).toBeInTheDocument()
  })

  it('should set delete project button link', () => {
    render(<Project {...props} />)
    expect(screen.getByText('Delete')).toHaveAttribute('href', '/projects/delete/1')
  })

  it('should not render delete project button without project', () => {
    render(<Project {...props} project={undefined} />)
    expect(screen.queryByText('Delete')).not.toBeInTheDocument()
  })
})
