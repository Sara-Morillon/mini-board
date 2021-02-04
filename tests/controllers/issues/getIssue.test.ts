import { getMockReq, getMockRes } from '@jest-mock/express'
import { Request } from 'express'
import mockdate from 'mockdate'
import { MoreThan } from 'typeorm'
import { getIssue, Req } from '../../../src/controllers/issues/getIssue'
import { Issue } from '../../../src/models/Issue'
import { Release } from '../../../src/models/Release'
import { mockRepository, RepoMock } from '../../mocks/repository'

mockdate.set('2020-01-01T00:00:00.000Z')

jest.mock('../../../src/models/Release')
jest.mock('../../../src/models/Issue')

describe('getIssue', () => {
  const req = getMockReq<Req>({ params: { projectId: 'projectId', id: 'id' } })
  const { res, clearMockRes } = getMockRes()

  let releaseMock: RepoMock<Release>
  let issueMock: RepoMock<Issue>

  beforeEach(() => {
    clearMockRes()

    releaseMock = mockRepository(Release.getRepository as jest.Mock)
    releaseMock.find.mockResolvedValue([{ id: 'releaseId' }])

    issueMock = mockRepository(Issue.getRepository as jest.Mock)
    issueMock.findOne.mockResolvedValue({ release: { id: 'releaseId' } })
  })

  it('should get releases', async () => {
    await getIssue(req, res)
    expect(releaseMock.find).toHaveBeenCalledWith({
      where: { project: { id: 'projectId' }, dueDate: MoreThan('2020-01-01T00:00:00.000Z') },
    })
  })

  it('should get issue', async () => {
    await getIssue(req, res)
    expect(issueMock.findOne).toHaveBeenCalledWith('id', {
      relations: ['release', 'attachments', 'comments', 'comments.author'],
    })
  })

  it('should add issue release in releases array', async () => {
    await getIssue(req, res)
    expect(res.render).toHaveBeenCalledWith('Issues/Issue', {
      releases: [{ id: 'releaseId' }],
      issue: { release: { id: 'releaseId' } },
    })
  })

  it('should render issue page with release and issue', async () => {
    releaseMock.find.mockResolvedValue([{ id: 'releaseId2' }])
    await getIssue(req, res)
    expect(res.render).toHaveBeenCalledWith('Issues/Issue', {
      releases: [{ id: 'releaseId2' }, { id: 'releaseId' }],
      issue: { release: { id: 'releaseId' } },
    })
  })

  it('should render issue page with releases if id is not present', async () => {
    const req = getMockReq<Request<{ projectId: string; id: string }>>({ params: { projectId: 'projectId' } })
    await getIssue(req, res)
    expect(res.render).toHaveBeenCalledWith('Issues/Issue', { releases: [{ id: 'releaseId' }] })
  })
})
