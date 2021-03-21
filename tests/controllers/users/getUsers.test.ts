import { getUsers } from '@/controllers/users/getUsers'
import { User } from '@/models/User'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { mockRepository, RepoMock } from '../../mocks/repository'

jest.mock('@/models/User')

describe('getUsers', () => {
  const req = getMockReq()
  const { res, clearMockRes } = getMockRes()

  let userMock: RepoMock<User>

  beforeEach(() => {
    clearMockRes()

    userMock = mockRepository(User.getRepository as jest.Mock)
    userMock.find.mockResolvedValue('users')
  })

  it('should get users', async () => {
    await getUsers(req, res)
    expect(userMock.find).toHaveBeenCalledWith({ order: { username: 'ASC' } })
  })

  it('should render users page with users', async () => {
    await getUsers(req, res)
    expect(res.render).toHaveBeenCalledWith('Users/Users', { users: 'users', title: 'Users' })
  })
})
