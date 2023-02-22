import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { useCurrentTitle } from '../../../../src/hooks/useTitle'
import { logout } from '../../../../src/services/session'
import { Header } from '../../../../src/ui/components/Header'
import { mock } from '../../../mocks'

jest.mock('../../../../src/services/session')
jest.mock('../../../../src/hooks/useTitle')

describe('Header', () => {
  it('should logout when clicking on logout button', () => {
    render(<Header />)
    fireEvent.click(screen.getByText('Log out'))
    expect(logout).toHaveBeenCalled()
  })

  it('should render title', () => {
    mock(useCurrentTitle).mockReturnValue('title')
    render(<Header />)
    expect(screen.getByText('title')).toBeInTheDocument()
  })
})
