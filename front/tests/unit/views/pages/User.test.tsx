import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { postUser } from '../../../../src/services/user'
import { User } from '../../../../src/views/pages/User'
import { mockNavigate, wait } from '../../../mocks'

vi.mock('../../../../src/services/user')

describe('User', () => {
  beforeEach(() => {
    mockNavigate()
    vi.mocked(postUser).mockResolvedValue(undefined)
  })

  it('should render save user when submitting form', () => {
    render(<User />)
    fireEvent.change(screen.getByLabelText('Username *'), { target: { value: 'username' } })
    fireEvent.change(screen.getByLabelText('Password *'), { target: { value: 'password' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))
    expect(postUser).toHaveBeenCalledWith('username', 'password')
  })

  it('should redirect to users list after saving user', async () => {
    const navigate = mockNavigate()
    render(<User />)
    fireEvent.change(screen.getByLabelText('Username *'), { target: { value: 'username' } })
    fireEvent.change(screen.getByLabelText('Password *'), { target: { value: 'password' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))
    await wait()
    expect(navigate).toHaveBeenCalledWith('/users')
  })
})
