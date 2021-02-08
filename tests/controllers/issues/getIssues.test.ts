import { getMockReq, getMockRes } from '@jest-mock/express'
import mockdate from 'mockdate'
import { MoreThan } from 'typeorm'
import { getIssues, Req } from '../../../src/controllers/issues/getIssues'
import { Release } from '../../../src/models/Release'
import { mockRelease1 } from '../../mocks/fixtures'
import { mockRepository, RepoMock } from '../../mocks/repository'

mockdate.set('2020-01-01T00:00:00.000Z')

jest.mock('../../../src/models/Release')

describe('getIssues', () => {
  const req = getMockReq<Req>({ params: { projectId: 'projectId' }, query: { all: '' } })
  const { res, clearMockRes } = getMockRes()

  let releaseMock: RepoMock<Release>

  beforeEach(() => {
    clearMockRes()

    releaseMock = mockRepository(Release.getRepository as jest.Mock)
    releaseMock.find.mockResolvedValue([mockRelease1])
  })

  it('should get issues', async () => {
    await getIssues(req, res)
    expect(releaseMock.find).toHaveBeenCalledWith({
      where: { project: { id: 'projectId' }, dueDate: MoreThan('2020-01-01T00:00:00.000Z') },
      order: { dueDate: 'ASC' },
      relations: ['issues', 'issues.author'],
    })
  })

  it('should get all issues when all is not true', async () => {
    const req = getMockReq<Req>({ params: { projectId: 'projectId' }, query: { all: 'true' } })
    await getIssues(req, res)
    expect(releaseMock.find).toHaveBeenCalledWith({
      where: { project: { id: 'projectId' } },
      order: { dueDate: 'ASC' },
      relations: ['issues', 'issues.author'],
    })
  })

  it('should render issues page with issues', async () => {
    await getIssues(req, res)
    expect(res.render).toHaveBeenCalledWith('Issues/Issues', { all: '', releases: [mockRelease1] })
  })
})
