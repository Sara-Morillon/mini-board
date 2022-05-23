import { deleteUser, getUsers, postUser } from '../../../src/services/user'
import { request } from '../../../src/services/wrapper'
import { mock, mockUser } from '../../mocks'

jest.mock('../../../src/services/wrapper')

describe('getUsers', () => {
  it('should get users', async () => {
    await getUsers()
    expect(request).toHaveBeenCalledWith({ url: '/api/users' }, [])
  })

  it('should return users', async () => {
    mock(request).mockResolvedValue('users')
    const result = await getUsers()
    expect(result).toBe('users')
  })
})

describe('postUser', () => {
  it('should post user', async () => {
    await postUser('username', 'password')
    expect(request).toHaveBeenCalledWith(
      { url: '/api/users', method: 'POST', data: { password: 'password', username: 'username' } },
      undefined
    )
  })
})

describe('deleteUser', () => {
  it('should delete user', async () => {
    await deleteUser(mockUser())
    expect(request).toHaveBeenCalledWith({ url: '/api/users/user1', method: 'DELETE' }, undefined)
  })
})
