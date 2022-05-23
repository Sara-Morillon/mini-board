import { getMockReq, getMockRes } from '@jest-mock/express'
import { getComments } from '../../../../src/controllers/comments/getComments'
import { prisma } from '../../../../src/prisma'
import { mockComment } from '../../../mocks'

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
