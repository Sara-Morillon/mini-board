import { getMockReq, getMockRes } from '@jest-mock/express'
import { deleteComment, Req } from '../../../src/controllers/comments/deleteComment'
import { Comment } from '../../../src/models/Comment'
import { mockRepository, RepoMock } from '../../mocks/repository'

jest.mock('../../../src/models/Comment')

describe('deleteComment', () => {
  const req = getMockReq<Req>({ params: { projectId: 'projectId', id: 'id' }, query: { issueId: 'issueId' } })
  const { res, clearMockRes } = getMockRes()

  let commentMock: RepoMock<Comment>

  beforeEach(() => {
    clearMockRes()

    commentMock = mockRepository(Comment.getRepository as jest.Mock)
    commentMock.delete.mockResolvedValue(undefined)
  })

  it('should delete comment', async () => {
    await deleteComment(req, res)
    expect(commentMock.delete).toHaveBeenCalledWith('id')
  })

  it('should redirect to issue page', async () => {
    await deleteComment(req, res)
    expect(res.redirect).toHaveBeenCalledWith('/project/projectId/issues/edit/issueId')
  })
})
