import { getMockReq, getMockRes } from '@jest-mock/express'
import { getAttachments } from '../../../../src/controllers/attachments/getAttachments'
import { prisma } from '../../../../src/prisma'
import { mockAttachment } from '../../../mocks'

describe('getAttachments', () => {
  it('should get attachments', async () => {
    jest.spyOn(prisma.attachment, 'findMany').mockResolvedValue([mockAttachment])
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await getAttachments(req, res)
    expect(prisma.attachment.findMany).toHaveBeenCalledWith({ where: { issueId: 1 }, orderBy: { createdAt: 'asc' } })
  })

  it('should return attachments', async () => {
    jest.spyOn(prisma.attachment, 'findMany').mockResolvedValue([mockAttachment])
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await getAttachments(req, res)
    expect(res.json).toHaveBeenCalledWith([mockAttachment])
  })

  it('should return 500 status when failure', async () => {
    jest.spyOn(prisma.attachment, 'findMany').mockRejectedValue(new Error())
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await getAttachments(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(500)
  })
})
