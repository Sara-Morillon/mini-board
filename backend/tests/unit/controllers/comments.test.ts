import { getMockReq, getMockRes } from '@jest-mock/express'
import { deleteComment, getComments, postComment } from '../../../src/controllers/comments'
import { prisma } from '../../../src/prisma'
import { mockComment, mockUser } from '../../mocks'

describe('getComments', () => {
  it('should get comments', async () => {
    jest.spyOn(prisma.comment, 'findMany').mockResolvedValue([mockComment])
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await getComments(req, res)
    expect(prisma.comment.findMany).toHaveBeenCalledWith({
      where: { issueId: 1 },
      orderBy: { createdAt: 'asc' },
      include: { author: true },
    })
  })

  it('should return comments', async () => {
    jest.spyOn(prisma.comment, 'findMany').mockResolvedValue([mockComment])
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await getComments(req, res)
    expect(res.json).toHaveBeenCalledWith([mockComment])
  })

  it('should return 500 status when failure', async () => {
    jest.spyOn(prisma.comment, 'findMany').mockRejectedValue(new Error())
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await getComments(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(500)
  })
})

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

describe('deleteComment', () => {
  it('should delete comment', async () => {
    jest.spyOn(prisma.comment, 'delete').mockResolvedValue(mockComment)
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await deleteComment(req, res)
    expect(prisma.comment.delete).toHaveBeenCalledWith({ where: { id: 1 } })
  })

  it('should return 204 status', async () => {
    jest.spyOn(prisma.comment, 'delete').mockResolvedValue(mockComment)
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await deleteComment(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(204)
  })

  it('should return 500 status when failure', async () => {
    jest.spyOn(prisma.comment, 'delete').mockRejectedValue(new Error())
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await deleteComment(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(500)
  })
})
