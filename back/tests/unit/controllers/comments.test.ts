import { deleteComment, getComments, postComment } from '../../../src/controllers/comments'
import { prisma } from '../../../src/prisma'
import { getMockReq, getMockRes, mockAction, mockComment } from '../../mocks'

describe('getComments', () => {
  beforeEach(() => {
    vi.spyOn(prisma.comment, 'findMany').mockResolvedValue([mockComment()])
  })

  it('should get comments', async () => {
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
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await getComments(req, res)
    expect(res.json).toHaveBeenCalledWith([mockComment()])
  })

  it('should return 500 status when failure', async () => {
    vi.spyOn(prisma.comment, 'findMany').mockRejectedValue('Error')
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await getComments(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(500)
  })

  it('should log success', async () => {
    const req = getMockReq({ params: { id: '1' } })
    const { success } = mockAction(req.logger)
    const { res } = getMockRes()
    await getComments(req, res)
    expect(success).toHaveBeenCalled()
  })

  it('should log failure', async () => {
    vi.spyOn(prisma.comment, 'findMany').mockRejectedValue('Error')
    const req = getMockReq({ params: { id: '1' } })
    const { failure } = mockAction(req.logger)
    const { res } = getMockRes()
    await getComments(req, res)
    expect(failure).toHaveBeenCalledWith({ message: 'Error' })
  })
})

describe('postComment', () => {
  beforeEach(() => {
    vi.spyOn(prisma.comment, 'create').mockResolvedValue(mockComment())
  })

  it('should create comment', async () => {
    const req = getMockReq({ params: { id: '1' }, body: { content: 'content' } })
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
    const req = getMockReq({ params: { id: '1' }, body: { content: 'content' } })
    const { res } = getMockRes()
    await postComment(req, res)
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith(1)
  })

  it('should return 500 status when failure', async () => {
    vi.spyOn(prisma.comment, 'create').mockRejectedValue('Error')
    const req = getMockReq({ params: { id: '1' }, body: { content: 'content' } })
    const { res } = getMockRes()
    await postComment(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(500)
  })

  it('should log success', async () => {
    const req = getMockReq({ params: { id: '1' }, body: { content: 'content' } })
    const { success } = mockAction(req.logger)
    const { res } = getMockRes()
    await postComment(req, res)
    expect(success).toHaveBeenCalled()
  })

  it('should log failure', async () => {
    vi.spyOn(prisma.comment, 'create').mockRejectedValue('Error')
    const req = getMockReq({ params: { id: '1' }, body: { content: 'content' } })
    const { failure } = mockAction(req.logger)
    const { res } = getMockRes()
    await postComment(req, res)
    expect(failure).toHaveBeenCalledWith({ message: 'Error' })
  })
})

describe('deleteComment', () => {
  beforeEach(() => {
    vi.spyOn(prisma.comment, 'delete').mockResolvedValue(mockComment())
  })

  it('should delete comment', async () => {
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await deleteComment(req, res)
    expect(prisma.comment.delete).toHaveBeenCalledWith({ where: { id: 1 } })
  })

  it('should return 204 status', async () => {
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await deleteComment(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(204)
  })

  it('should return 500 status when failure', async () => {
    vi.spyOn(prisma.comment, 'delete').mockRejectedValue('Error')
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await deleteComment(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(500)
  })

  it('should log success', async () => {
    const req = getMockReq({ params: { id: '1' } })
    const { success } = mockAction(req.logger)
    const { res } = getMockRes()
    await deleteComment(req, res)
    expect(success).toHaveBeenCalled()
  })

  it('should log failure', async () => {
    vi.spyOn(prisma.comment, 'delete').mockRejectedValue('Error')
    const req = getMockReq({ params: { id: '1' } })
    const { failure } = mockAction(req.logger)
    const { res } = getMockRes()
    await deleteComment(req, res)
    expect(failure).toHaveBeenCalledWith({ message: 'Error' })
  })
})
