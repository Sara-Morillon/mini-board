import { getMockReq, getMockRes } from '@jest-mock/express'
import { getIssues, Req } from '../../../src/controllers/issues/getIssues'
import { Issue } from '../../../src/models/Issue'
import { mockRepository, RepoMock } from '../../mocks/repository'

jest.mock('../../../src/models/Release')
jest.mock('../../../src/models/Issue')

describe('getIssues', () => {
  const req = getMockReq<Req>({ params: { projectId: 'projectId' } })
  const { res, clearMockRes } = getMockRes()

  let issueMock: RepoMock<Issue>

  beforeEach(() => {
    clearMockRes()

    issueMock = mockRepository(Issue.getRepository as jest.Mock)
    issueMock.find.mockResolvedValue('issues')
  })

  it('should get issues', async () => {
    await getIssues(req, res)
    expect(issueMock.find).toHaveBeenCalledWith({
      where: { project: { id: 'projectId' } },
      order: { updatedAt: 'DESC' },
      relations: ['release', 'author'],
    })
  })

  it('should render issues page with issues', async () => {
    await getIssues(req, res)
    expect(res.render).toHaveBeenCalledWith('Issues/Issues', { issues: 'issues' })
  })
})
