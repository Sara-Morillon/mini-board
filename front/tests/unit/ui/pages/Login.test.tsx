import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { login } from '../../../../src/services/session'
import { Login } from '../../../../src/ui/pages/Login'
import { mock, mockLocation, restoreLocation, wait } from '../../../mocks'

jest.mock('../../../../src/services/session')

describe('Login', () => {
  beforeEach(() => {
    mockLocation({ reload: jest.fn() })
    mock(login).mockResolvedValue(undefined)
  })

  afterEach(() => {
    restoreLocation()
  })

  it('should login when submitting form', () => {
    render(<Login />)
    fireEvent.change(screen.getByLabelText('Username *'), { target: { value: 'username' } })
    fireEvent.change(screen.getByLabelText('Password *'), { target: { value: 'password' } })
    fireEvent.click(screen.getByRole('button', { name: 'Log in' }))
    expect(login).toHaveBeenCalledWith('username', 'password')
  })

  it('should reload page after login', async () => {
    render(<Login />)
    fireEvent.change(screen.getByLabelText('Username *'), { target: { value: 'username' } })
    fireEvent.change(screen.getByLabelText('Password *'), { target: { value: 'password' } })
    fireEvent.click(screen.getByRole('button', { name: 'Log in' }))
    await wait()
    expect(window.location.reload).toHaveBeenCalled()
  })
})
