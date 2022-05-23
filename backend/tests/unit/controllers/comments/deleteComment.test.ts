import { getMockReq, getMockRes } from '@jest-mock/express'
import { deleteComment } from '../../../../src/controllers/comments/deleteComment'
import { prisma } from '../../../../src/prisma'
import { mockComment } from '../../../mocks'

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
