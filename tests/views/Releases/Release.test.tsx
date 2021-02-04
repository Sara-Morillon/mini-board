import { render, screen } from '@testing-library/react'
import React from 'react'
import Release, { IReleaseProps } from '../../../src/views/Releases/Release'
import { mockRelease1 } from '../../mocks/fixtures'

describe('Release', () => {
  const props: IReleaseProps = {
    release: mockRelease1,
    projectId: 'projectId',
  }

  it('should set action url with release id', () => {
    const { baseElement } = render(<Release {...props} />)
    expect(baseElement.querySelector('form')).toHaveAttribute('action', '/project/projectId/releases/edit/1')
  })

  it('should set action url without release id', () => {
    const { baseElement } = render(<Release {...props} release={undefined} />)
    expect(baseElement.querySelector('form')).toHaveAttribute('action', '/project/projectId/releases/edit')
  })

  it('should set release name', () => {
    render(<Release {...props} />)
    expect(screen.getByLabelText('Name')).toHaveValue('release1')
  })

  it('should set release date', () => {
    render(<Release {...props} />)
    expect(screen.getByLabelText('Due date')).toHaveValue('2020-01-01')
  })

  it('should render delete release button', () => {
    render(<Release {...props} />)
    expect(screen.getByText('Delete')).toBeInTheDocument()
  })

  it('should set delete release button link', () => {
    render(<Release {...props} />)
    expect(screen.getByText('Delete')).toHaveAttribute('href', '/project/projectId/releases/delete/1')
  })

  it('should not render delete release button without release', () => {
    render(<Release {...props} release={undefined} />)
    expect(screen.queryByText('Delete')).not.toBeInTheDocument()
  })
})
