import { getMockReq, getMockRes } from '@jest-mock/express'
import fs, { ReadStream } from 'fs'
import path from 'path'
import { downloadAttachment } from '../../../../src/controllers/attachments/downloadAttachment'
import { prisma } from '../../../../src/prisma'
import { mockAttachment } from '../../../mocks'

describe('downloadAttachment', () => {
  it('should get attachment', async () => {
    jest.spyOn(prisma.attachment, 'findUnique').mockResolvedValue(mockAttachment)
    jest.spyOn(fs, 'createReadStream').mockReturnValue({} as ReadStream)
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await downloadAttachment(req, res)
    expect(prisma.attachment.findUnique).toHaveBeenCalledWith({ where: { id: 1 } })
  })

  it('should return 404 if attachment was not found', async () => {
    jest.spyOn(prisma.attachment, 'findUnique').mockResolvedValue(null)
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await downloadAttachment(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(404)
  })

  it('should get attachment content stream', async () => {
    jest.spyOn(prisma.attachment, 'findUnique').mockResolvedValue(mockAttachment)
    jest.spyOn(fs, 'createReadStream').mockReturnValue({} as ReadStream)
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await downloadAttachment(req, res)
    expect(fs.createReadStream).toHaveBeenCalledWith(path.join('upload_dir', 'filepath'))
  })

  it('should stream attachment content', async () => {
    jest.spyOn(prisma.attachment, 'findUnique').mockResolvedValue(mockAttachment)
    const stream = { pipe: jest.fn() } as unknown as ReadStream
    jest.spyOn(fs, 'createReadStream').mockReturnValue(stream)
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await downloadAttachment(req, res)
    expect(res.set).toHaveBeenCalledWith('Content-disposition', 'attachment; filename=filename')
    expect(res.set).toHaveBeenCalledWith('Content-Type', 'mime')
    expect(stream.pipe).toHaveBeenCalledWith(res)
  })

  it('should stream attachment content without content disposition for images', async () => {
    jest.spyOn(prisma.attachment, 'findUnique').mockResolvedValue({ ...mockAttachment, mime: 'image/' })
    const stream = { pipe: jest.fn() } as unknown as ReadStream
    jest.spyOn(fs, 'createReadStream').mockReturnValue(stream)
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await downloadAttachment(req, res)
    expect(res.set).not.toHaveBeenCalledWith('Content-disposition', 'attachment; filename=filename')
    expect(res.set).toHaveBeenCalledWith('Content-Type', 'image/')
    expect(stream.pipe).toHaveBeenCalledWith(res)
  })

  it('should return 500 status when failure', async () => {
    jest.spyOn(prisma.attachment, 'findUnique').mockRejectedValue(new Error())
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await downloadAttachment(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(500)
  })
})
