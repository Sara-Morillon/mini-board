import { render, screen } from '@testing-library/react'
import React from 'react'
import { Header, IHeaderProps } from '../../../src/views/Header/Header'
import { mockUser1 } from '../../mocks/fixtures'

describe('Header', () => {
  const props: IHeaderProps = {
    title: 'title',
    projectId: 'projectId',
    active: 'issues',
  }

  it('should show the header button if user is present', () => {
    render(<Header {...props} user={mockUser1} />)
    expect(screen.getByText('Admin')).toBeInTheDocument()
    expect(screen.getByText('Log out')).toBeInTheDocument()
  })

  it('should not show the header if user is missing', () => {
    render(<Header {...props} />)
    expect(screen.queryByText('Admin')).not.toBeInTheDocument()
    expect(screen.queryByText('Log out')).not.toBeInTheDocument()
  })

  it('should render title', () => {
    render(<Header {...props} />)
    expect(screen.queryByText('title')).toBeInTheDocument()
  })

  it('should render links', () => {
    render(<Header {...props} />)
    expect(screen.getByText('Issues')).toHaveAttribute('href', '/project/projectId/issues/list')
    expect(screen.getByText('Releases')).toHaveAttribute('href', '/project/projectId/releases/list')
    expect(screen.getByText('Board')).toHaveAttribute('href', '/project/projectId/board')
  })
})
