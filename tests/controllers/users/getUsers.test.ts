import { getMockReq, getMockRes } from '@jest-mock/express'
import { getUsers } from '../../../src/controllers/users/getUsers'
import { User } from '../../../src/models/User'
import { mockRepository, RepoMock } from '../../mocks/repository'

jest.mock('../../../src/models/User')

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
