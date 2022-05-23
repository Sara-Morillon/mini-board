import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useCurrentTitle } from '../../../../src/hooks/useTitle'
import { logout } from '../../../../src/services/session'
import { Header } from '../../../../src/ui/components/Header'
import { mock } from '../../../mocks'

jest.mock('react-router-dom')
jest.mock('../../../../src/services/session')
jest.mock('../../../../src/hooks/useTitle')

describe('Header', () => {
  it('should go to home when clicking on navbar brand', () => {
    const navigate = jest.fn()
    mock(useNavigate).mockReturnValue(navigate)
    render(<Header />)
    fireEvent.click(screen.getByText('Mini Board'))
    expect(navigate).toHaveBeenCalledWith('/')
  })

  it('should go to users page when clicking on admin button', () => {
    const navigate = jest.fn()
    mock(useNavigate).mockReturnValue(navigate)
    render(<Header />)
    fireEvent.click(screen.getByText('Admin'))
    expect(navigate).toHaveBeenCalledWith('/users')
  })

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
