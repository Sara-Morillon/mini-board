import { getMockReq, getMockRes } from '@jest-mock/express'
import { Req, saveComment } from '../../../src/controllers/comments/saveComment'
import { Comment } from '../../../src/models/Comment'
import { User } from '../../../src/models/User'
import { mockRepository, RepoMock } from '../../mocks/repository'

jest.mock('../../../src/models/Release')
jest.mock('../../../src/models/Comment')
jest.mock('../../../src/models/Attachment')

describe('saveComment', () => {
  const body = { content: 'content' }
  const req = getMockReq<Req>({ params: { projectId: 'projectId' }, body, query: { issueId: '1' } })
  req.user = { id: 2 } as User
  const { res, clearMockRes } = getMockRes()

  let commentMock: RepoMock<Comment>

  beforeEach(() => {
    clearMockRes()

    commentMock = mockRepository(Comment.getRepository as jest.Mock)
    commentMock.save.mockResolvedValue({ id: 'id' })
  })

  it('should save comment', async () => {
    await saveComment(req, res)
    expect(commentMock.save).toHaveBeenCalledWith({
      content: 'content',
      author: { id: 2 },
      issue: { id: 1 },
    })
  })

  it('should redirect to issue page', async () => {
    await saveComment(req, res)
    expect(res.redirect).toHaveBeenCalledWith('/project/projectId/issues/edit/1')
  })
})
