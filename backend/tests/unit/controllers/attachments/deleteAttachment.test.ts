import { getMockReq, getMockRes } from '@jest-mock/express'
import { deleteAttachment } from '../../../../src/controllers/attachments/deleteAttachment'
import { prisma } from '../../../../src/prisma'
import { mockAttachment } from '../../../mocks'

describe('deleteAttachment', () => {
  it('should delete attachment', async () => {
    jest.spyOn(prisma.attachment, 'delete').mockResolvedValue(mockAttachment)
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await deleteAttachment(req, res)
    expect(prisma.attachment.delete).toHaveBeenCalledWith({ where: { id: 1 } })
  })

  it('should return 204 status', async () => {
    jest.spyOn(prisma.attachment, 'delete').mockResolvedValue(mockAttachment)
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await deleteAttachment(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(204)
  })

  it('should return 500 status when failure', async () => {
    jest.spyOn(prisma.attachment, 'delete').mockRejectedValue(new Error())
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await deleteAttachment(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(500)
  })
})
