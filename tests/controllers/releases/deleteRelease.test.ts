import { deleteRelease, Req } from '@/controllers/releases/deleteRelease'
import { Release } from '@/models/Release'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { mockRepository, RepoMock } from '../../mocks/repository'

jest.mock('@/models/Release')

describe('deleteRelease', () => {
  const req = getMockReq<Req>({ params: { projectId: 'projectId', id: 'id' } })
  const { res, clearMockRes } = getMockRes()

  let releaseMock: RepoMock<Release>

  beforeEach(() => {
    clearMockRes()

    releaseMock = mockRepository(Release.getRepository as jest.Mock)
    releaseMock.delete.mockResolvedValue(undefined)
  })

  it('should delete release', async () => {
    await deleteRelease(req, res)
    expect(releaseMock.delete).toHaveBeenCalledWith('id')
  })

  it('should redirect to releases page', async () => {
    await deleteRelease(req, res)
    expect(res.redirect).toHaveBeenCalledWith('/project/projectId/releases/list')
  })
})
