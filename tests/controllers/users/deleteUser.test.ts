import { deleteUser, Req } from '@/controllers/users/deleteUser'
import { User } from '@/models/User'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { mockRepository, RepoMock } from '../../mocks/repository'

jest.mock('@/models/User')

describe('deleteUser', () => {
  const req = getMockReq<Req>({ params: { id: 'id' } })
  const { res, clearMockRes } = getMockRes()

  let userMock: RepoMock<User>

  beforeEach(() => {
    clearMockRes()

    userMock = mockRepository(User.getRepository as jest.Mock)
    userMock.delete.mockResolvedValue(undefined)
  })

  it('should delete user', async () => {
    await deleteUser(req, res)
    expect(userMock.delete).toHaveBeenCalledWith('id')
  })

  it('should redirect to users page', async () => {
    await deleteUser(req, res)
    expect(res.redirect).toHaveBeenCalledWith('/users/list')
  })
})
