import { Axios } from '../../../src/services/Axios'
import { deleteUser, getUsers, postUser } from '../../../src/services/user'
import { mockUser } from '../../mocks'

vi.mock('../../../src/services/Axios')

describe('getUsers', () => {
  beforeEach(() => {
    vi.mocked(Axios.get).mockResolvedValue({ data: 'users' })
  })

  it('should get users', async () => {
    await getUsers()
    expect(Axios.get).toHaveBeenCalledWith('/api/users')
  })

  it('should return users', async () => {
    const result = await getUsers()
    expect(result).toBe('users')
  })
})

describe('postUser', () => {
  it('should post user', async () => {
    await postUser('username', 'password')
    expect(Axios.post).toHaveBeenCalledWith('/api/users', { password: 'password', username: 'username' })
  })
})

describe('deleteUser', () => {
  it('should delete user', async () => {
    await deleteUser(mockUser())
    expect(Axios.delete).toHaveBeenCalledWith('/api/users/1')
  })
})
