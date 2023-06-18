import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { useSession } from '../../../../src/contexts/SessionContext'
import { deleteUser, getUsers } from '../../../../src/services/user'
import { Users } from '../../../../src/views/pages/Users'
import { mockSession, mockUser, wait } from '../../../mocks'

jest.mock('../../../../src/services/user')
jest.mock('../../../../src/contexts/SessionContext')

describe('Users', () => {
  beforeEach(() => {
    jest.mocked(useSession).mockReturnValue(mockSession())
    jest.mocked(getUsers).mockResolvedValue([mockUser()])
    jest.mocked(deleteUser).mockResolvedValue(undefined)
  })

  it('should render create button', async () => {
    render(<Users />)
    await wait()
    expect(screen.getByText('Create user')).toHaveAttribute('href', '/user')
  })

  it('should render not found message when no user is found', async () => {
    jest.mocked(getUsers).mockResolvedValue([])
    render(<Users />)
    await wait()
    expect(screen.getByText('No user found')).toBeInTheDocument()
  })

  it('should render user name', async () => {
    render(<Users />)
    await wait()
    expect(screen.getByText('user1')).toBeInTheDocument()
  })

  it('should render user created date', async () => {
    render(<Users />)
    await wait()
    expect(screen.getByText('Created at 01/01/2018, 1:00 AM')).toBeInTheDocument()
  })

  it('should not render delete button if user is current user', async () => {
    render(<Users />)
    await wait()
    expect(screen.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument()
  })

  it('should enable delete button if user is not current user', async () => {
    jest.mocked(getUsers).mockResolvedValue([mockUser({ id: 2 })])
    render(<Users />)
    await wait()
    expect(screen.getByRole('button', { name: 'Delete' })).toBeEnabled()
  })

  it('should delete user when clicking on delete button', async () => {
    jest.mocked(getUsers).mockResolvedValue([mockUser({ id: 2 })])
    render(<Users />)
    await wait()
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }))
    await wait()
    expect(deleteUser).toHaveBeenCalledWith(mockUser({ id: 2 }))
  })

  it('should show loader when deleting', async () => {
    jest.mocked(getUsers).mockResolvedValue([mockUser({ id: 2 })])
    render(<Users />)
    await wait()
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }))
    expect(screen.getByRole('button', { name: 'Delete' })).toHaveAttribute('aria-busy', 'true')
    await wait()
  })

  it('should refresh users after deleting', async () => {
    jest.mocked(getUsers).mockResolvedValue([mockUser({ id: 2 })])
    render(<Users />)
    await wait()
    jest.mocked(getUsers).mockClear()
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }))
    await wait()
    expect(getUsers).toHaveBeenCalled()
  })
})
