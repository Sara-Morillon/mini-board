import { render, screen } from '@testing-library/react'
import React from 'react'
import { Body, IBodyProps } from '../../../src/views/Layout/Body'

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
