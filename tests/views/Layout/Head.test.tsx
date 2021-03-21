import { Head } from '@/views/Layout/Head'
import { render, screen } from '@testing-library/react'
import React from 'react'

describe('Head', () => {
  it('should render title in page title', () => {
    render(<Head title="Title" />)
    expect(screen.getByText('Mini board - Title')).toBeInTheDocument()
  })
})
