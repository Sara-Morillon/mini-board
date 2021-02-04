import { getMockReq, getMockRes } from '@jest-mock/express'
import { getReleases, Req } from '../../../src/controllers/releases/getReleases'
import { Release } from '../../../src/models/Release'
import { mockRepository, RepoMock } from '../../mocks/repository'

jest.mock('../../../src/models/Release')

describe('getReleases', () => {
  const req = getMockReq<Req>({ params: { projectId: 'projectId' } })
  const { res, clearMockRes } = getMockRes()

  let releaseMock: RepoMock<Release>

  beforeEach(() => {
    clearMockRes()

    releaseMock = mockRepository(Release.getRepository as jest.Mock)
    releaseMock.find.mockResolvedValue('releases')
  })

  it('should get releases', async () => {
    await getReleases(req, res)
    expect(releaseMock.find).toHaveBeenCalledWith({
      where: { project: { id: 'projectId' } },
      order: { dueDate: 'ASC' },
    })
  })

  it('should render releases page with releases', async () => {
    await getReleases(req, res)
    expect(res.render).toHaveBeenCalledWith('Releases/Releases', { releases: 'releases' })
  })
})
