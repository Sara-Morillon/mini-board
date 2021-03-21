import { Req, saveComment } from '@/controllers/comments/saveComment'
import { Comment } from '@/models/Comment'
import { User } from '@/models/User'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { mockRepository, RepoMock } from '../../mocks/repository'

jest.mock('@/models/Release')
jest.mock('@/models/Comment')
jest.mock('@/models/Attachment')

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
