import { getMockReq, getMockRes } from '@jest-mock/express'
import { postUser, Req } from '../../../src/controllers/users/postUser'
import { User } from '../../../src/models/User'
import { mockRepository, RepoMock } from '../../mocks/repository'

jest.mock('../../../src/models/User')

describe('postUser', () => {
  const body = { username: 'username', password: 'password' }
  const req = getMockReq<Req>({ params: { id: '8' }, body })
  const { res, clearMockRes } = getMockRes()

  let userMock: RepoMock<User>

  beforeEach(() => {
    clearMockRes()

    userMock = mockRepository(User.getRepository as jest.Mock)
    userMock.save.mockResolvedValue(undefined)
  })

  it('should save user', async () => {
    await postUser(req, res)
    expect(userMock.save).toHaveBeenCalledWith({
      username: 'username',
      password: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    })
  })

  it('should redirect to users list', async () => {
    await postUser(req, res)
    expect(res.redirect).toHaveBeenCalledWith('/users/list')
  })
})
