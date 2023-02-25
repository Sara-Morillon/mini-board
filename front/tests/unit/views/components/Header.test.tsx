import { render, screen } from '@testing-library/react'
import React from 'react'
import { useCurrentTitle } from '../../../../src/hooks/useTitle'
import { Header } from '../../../../src/views/components/Header'

jest.mock('../../../../src/services/session')
jest.mock('../../../../src/hooks/useTitle')

describe('Header', () => {
  it('should render brand and logo', () => {
    render(<Header />)
    expect(screen.getByRole('link', { name: 'Mini Board' })).toHaveAttribute('href', '/')
    expect(screen.queryByRole('img')).toHaveAttribute('src', '/favicon.svg')
  })

  it('should render title', () => {
    jest.mocked(useCurrentTitle).mockReturnValue('title')
    render(<Header />)
    expect(screen.getByText('title')).toBeInTheDocument()
  })
})
