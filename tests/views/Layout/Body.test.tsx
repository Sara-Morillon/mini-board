import { Body, IBodyProps } from '@/views/Layout/Body'
import { render, screen } from '@testing-library/react'
import React from 'react'

describe('Body', () => {
  const props: IBodyProps = {
    title: 'title',
    projectId: 'projectId',
    active: 'issues',
  }

  it('should render children in main container', () => {
    render(<Body {...props}>Page content</Body>)
    expect(screen.getByText('Page content')).toBeInTheDocument()
  })
})
