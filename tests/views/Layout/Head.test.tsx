import { render, screen } from '@testing-library/react'
import React from 'react'
import { Head } from '../../../src/views/Layout/Head'

describe('Head', () => {
  it('should render title in page title', () => {
    render(<Head title="Title" />)
    expect(screen.getByText('Scrum board - Title')).toBeInTheDocument()
  })
})
