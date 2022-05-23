import { getMockReq, getMockRes } from '@jest-mock/express'
import { postComment } from '../../../../src/controllers/comments/postComment'
import { prisma } from '../../../../src/prisma'
import { mockComment, mockUser } from '../../../mocks'

describe('postComment', () => {
  it('should return 401 status if no user', async () => {
    const req = getMockReq({ params: { id: '1' }, body: { content: 'content' } })
    const { res } = getMockRes()
    await postComment(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(401)
  })

  it('should create comment', async () => {
    jest.spyOn(prisma.comment, 'create').mockResolvedValue(mockComment)
    const req = getMockReq({ params: { id: '1' }, body: { content: 'content' }, user: mockUser })
    const { res } = getMockRes()
    await postComment(req, res)
    expect(prisma.comment.create).toHaveBeenCalledWith({
      data: {
        authorId: 1,
        issueId: 1,
        content: 'content',
      },
    })
  })

  it('should return 201 status and created comment id', async () => {
    jest.spyOn(prisma.comment, 'create').mockResolvedValue(mockComment)
    const req = getMockReq({ params: { id: '1' }, body: { content: 'content' }, user: mockUser })
    const { res } = getMockRes()
    await postComment(req, res)
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith(1)
  })

  it('should return 500 status when failure', async () => {
    jest.spyOn(prisma.comment, 'create').mockRejectedValue(new Error())
    const req = getMockReq({ params: { id: '1' }, body: { content: 'content' }, user: mockUser })
    const { res } = getMockRes()
    await postComment(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(500)
  })
})
