import { getMockReq, getMockRes } from '@jest-mock/express'
import { Req, saveIssue } from '../../../src/controllers/issues/saveIssue'
import { Attachment } from '../../../src/models/Attachment'
import { Issue } from '../../../src/models/Issue'
import { User } from '../../../src/models/User'
import { mockRepository, RepoMock } from '../../mocks/repository'

jest.mock('../../../src/models/Release')
jest.mock('../../../src/models/Issue')
jest.mock('../../../src/models/Attachment')

describe('saveIssue', () => {
  const body = { title: 'title', type: 'bug', description: 'description', points: 5, release: 1 }
  const req = getMockReq<Req>({ params: { projectId: 'projectId', id: '8' }, body })
  req.files = [{ originalname: 'originalname', filename: 'filename', mimetype: 'mimetype' } as Express.Multer.File]
  const { res, clearMockRes } = getMockRes()

  let issueMock: RepoMock<Issue>
  let attachmentMock: RepoMock<Issue>

  beforeEach(() => {
    clearMockRes()

    issueMock = mockRepository(Issue.getRepository as jest.Mock)
    issueMock.update.mockResolvedValue(undefined)
    issueMock.save.mockResolvedValue({ id: 'id' })

    attachmentMock = mockRepository(Attachment.getRepository as jest.Mock)
    attachmentMock.save.mockResolvedValue(undefined)
  })

  it('should update release for all issues', async () => {
    await saveIssue(req, res)
    expect(issueMock.update).toHaveBeenCalledWith({ release: { id: 1 } }, { priority: expect.any(Function) })
  })

  it('should update issue if id is present', async () => {
    await saveIssue(req, res)
    expect(issueMock.update).toHaveBeenCalledWith('8', {
      title: 'title',
      type: 'bug',
      description: 'description',
      points: 5,
      release: { id: 1 },
    })
  })

  it('should save issue if id is not present', async () => {
    const req = getMockReq<Req>({ params: { projectId: '4' }, body })
    req.files = []
    req.user = { id: 2 } as User
    await saveIssue(req, res)
    expect(issueMock.save).toHaveBeenCalledWith({
      project: { id: 4 },
      title: 'title',
      type: 'bug',
      description: 'description',
      points: 5,
      author: { id: 2 },
      release: { id: 1 },
    })
  })

  it('should redirect to issue page if id is present', async () => {
    await saveIssue(req, res)
    expect(res.redirect).toHaveBeenCalledWith('/project/projectId/issues/edit/8')
  })

  it('should redirect to issue page if id is not present', async () => {
    const req = getMockReq<Req>({ params: { projectId: 'projectId' }, body })
    req.files = []
    req.user = { id: 2 } as User
    await saveIssue(req, res)
    expect(res.redirect).toHaveBeenCalledWith('/project/projectId/issues/edit/id')
  })

  it('should save attachments', async () => {
    await saveIssue(req, res)
    expect(attachmentMock.save).toHaveBeenCalledWith([
      {
        filename: 'originalname',
        filepath: 'filename',
        issue: { id: 8 },
        mime: 'mimetype',
      },
    ])
  })
})
