import { render, screen } from '@testing-library/react'
import React from 'react'
import { Header } from '../../../../src/views/components/Header'

vi.mock('../../../../src/services/session')

describe('Header', () => {
  it('should render brand and logo', () => {
    render(<Header />)
    expect(screen.getByRole('link', { name: 'Mini Board' })).toHaveAttribute('href', '/')
    expect(screen.queryByRole('img')).toHaveAttribute('src', '/favicon.svg')
  })
})
