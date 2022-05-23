import { getMockReq, getMockRes } from '@jest-mock/express'
import { postAttachments } from '../../../../src/controllers/attachments/postAttachments'
import { prisma } from '../../../../src/prisma'
import { mockAttachment, mockUser } from '../../../mocks'

describe('postAttachments', () => {
  it('should return 401 status if no user', async () => {
    const req = getMockReq({
      params: { id: '1' },
      body: { files: [{ originalname: 'filename', filename: 'filepath', mimetype: 'mimetype' }] },
    })
    const { res } = getMockRes()
    await postAttachments(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(401)
  })

  it('should create attachment', async () => {
    jest.spyOn(prisma.attachment, 'create').mockResolvedValue(mockAttachment)
    const req = getMockReq({
      params: { id: '1' },
      body: { files: [{ originalname: 'filename', filename: 'filepath', mimetype: 'mimetype' }] },
      user: mockUser,
    })
    const { res } = getMockRes()
    await postAttachments(req, res)
    expect(prisma.attachment.create).toHaveBeenCalledWith({
      data: {
        issueId: 1,
        filename: 'filename',
        filepath: 'filepath',
        mime: 'mimetype',
      },
    })
  })

  it('should return 201 status and created attachment id', async () => {
    jest.spyOn(prisma.attachment, 'create').mockResolvedValue(mockAttachment)
    const req = getMockReq({
      params: { id: '1' },
      body: { files: [{ originalname: 'filename', filename: 'filepath', mimetype: 'mimetype' }] },
      user: mockUser,
    })
    const { res } = getMockRes()
    await postAttachments(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(201)
  })

  it('should return 500 status when failure', async () => {
    jest.spyOn(prisma.attachment, 'create').mockRejectedValue(new Error())
    const req = getMockReq({
      params: { id: '1' },
      body: { files: [{ originalname: 'filename', filename: 'filepath', mimetype: 'mimetype' }] },
      user: mockUser,
    })
    const { res } = getMockRes()
    await postAttachments(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(500)
  })
})
