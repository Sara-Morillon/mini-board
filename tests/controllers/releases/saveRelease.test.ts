import { getMockReq, getMockRes } from '@jest-mock/express'
import { Req, saveRelease } from '../../../src/controllers/releases/saveRelease'
import { Release } from '../../../src/models/Release'
import { User } from '../../../src/models/User'
import { mockRepository, RepoMock } from '../../mocks/repository'

jest.mock('../../../src/models/Release')

describe('saveRelease', () => {
  const body = { name: 'name', dueDate: '2020-01-01' }
  const req = getMockReq<Req>({ params: { projectId: 'projectId', id: '8' }, body })
  const { res, clearMockRes } = getMockRes()

  let releaseMock: RepoMock<Release>

  beforeEach(() => {
    clearMockRes()

    releaseMock = mockRepository(Release.getRepository as jest.Mock)
    releaseMock.update.mockResolvedValue(undefined)
    releaseMock.save.mockResolvedValue(undefined)
  })

  it('should update release if id is present', async () => {
    await saveRelease(req, res)
    expect(releaseMock.update).toHaveBeenCalledWith('8', {
      name: 'name',
      dueDate: new Date('2020-01-01T00:00:00.000Z'),
    })
  })

  it('should save release if id is not present', async () => {
    const req = getMockReq<Req>({ params: { projectId: '4' }, body })
    req.user = { id: 2 } as User
    await saveRelease(req, res)
    expect(releaseMock.save).toHaveBeenCalledWith({
      project: { id: 4 },
      name: 'name',
      dueDate: new Date('2020-01-01T00:00:00.000Z'),
    })
  })

  it('should redirect to releases list', async () => {
    await saveRelease(req, res)
    expect(res.redirect).toHaveBeenCalledWith('/project/projectId/releases/list')
  })
})
