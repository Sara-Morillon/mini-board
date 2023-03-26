import { getMockRes } from '@jest-mock/express'
import fs from 'fs'
import path from 'path'
import {
  deleteAttachment,
  downloadAttachment,
  downloadAttachments,
  getAttachments,
  postAttachments,
} from '../../../src/controllers/attachments'
import { prisma } from '../../../src/prisma'
import { getMockReq, mockAction, mockArchiveStream, mockAttachment, mockReadStream, mockUser } from '../../mocks'

jest.mock('archiver')
jest.mock('archiver')

describe('getAttachments', () => {
  beforeEach(() => {
    jest.spyOn(prisma.attachment, 'findMany').mockResolvedValue([mockAttachment])
  })

  it('should get attachments', async () => {
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await getAttachments(req, res)
    expect(prisma.attachment.findMany).toHaveBeenCalledWith({ where: { issueId: 1 }, orderBy: { createdAt: 'asc' } })
  })

  it('should return attachments', async () => {
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await getAttachments(req, res)
    expect(res.json).toHaveBeenCalledWith([mockAttachment])
  })

  it('should return 500 status when failure', async () => {
    jest.spyOn(prisma.attachment, 'findMany').mockRejectedValue('Error')
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await getAttachments(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(500)
  })

  it('should log success', async () => {
    const req = getMockReq({ params: { id: '1' } })
    const { success } = mockAction(req.logger)
    const { res } = getMockRes()
    await getAttachments(req, res)
    expect(success).toHaveBeenCalled()
  })

  it('should log failure', async () => {
    jest.spyOn(prisma.attachment, 'findMany').mockRejectedValue('Error')
    const req = getMockReq({ params: { id: '1' } })
    const { failure } = mockAction(req.logger)
    const { res } = getMockRes()
    await getAttachments(req, res)
    expect(failure).toHaveBeenCalledWith({ message: 'Error' })
  })
})

describe('postAttachments', () => {
  beforeEach(() => {
    jest.spyOn(prisma.attachment, 'create').mockResolvedValue(mockAttachment)
  })

  it('should create attachment', async () => {
    const req = getMockReq({
      params: { id: '1' },
      files: [{ originalname: 'filename', filename: 'filepath', mimetype: 'mimetype' }],
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
    const req = getMockReq({
      params: { id: '1' },
      files: [{ originalname: 'filename', filename: 'filepath', mimetype: 'mimetype' }],
      user: mockUser,
    })
    const { res } = getMockRes()
    await postAttachments(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(201)
  })

  it('should return 500 status when failure', async () => {
    jest.spyOn(prisma.attachment, 'create').mockRejectedValue('Error')
    const req = getMockReq({
      params: { id: '1' },
      files: [{ originalname: 'filename', filename: 'filepath', mimetype: 'mimetype' }],
      user: mockUser,
    })
    const { res } = getMockRes()
    await postAttachments(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(500)
  })

  it('should log success', async () => {
    const req = getMockReq({
      params: { id: '1' },
      files: [{ originalname: 'filename', filename: 'filepath', mimetype: 'mimetype' }],
      user: mockUser,
    })
    const { success } = mockAction(req.logger)
    const { res } = getMockRes()
    await postAttachments(req, res)
    expect(success).toHaveBeenCalled()
  })

  it('should log failure', async () => {
    jest.spyOn(prisma.attachment, 'create').mockRejectedValue('Error')
    const req = getMockReq({
      params: { id: '1' },
      files: [{ originalname: 'filename', filename: 'filepath', mimetype: 'mimetype' }],
      user: mockUser,
    })
    const { failure } = mockAction(req.logger)
    const { res } = getMockRes()
    await postAttachments(req, res)
    expect(failure).toHaveBeenCalledWith({ message: 'Error' })
  })
})

describe('deleteAttachment', () => {
  beforeEach(() => {
    jest.spyOn(prisma.attachment, 'delete').mockResolvedValue(mockAttachment)
  })

  it('should delete attachment', async () => {
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await deleteAttachment(req, res)
    expect(prisma.attachment.delete).toHaveBeenCalledWith({ where: { id: 1 } })
  })

  it('should return 204 status', async () => {
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await deleteAttachment(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(204)
  })

  it('should return 500 status when failure', async () => {
    jest.spyOn(prisma.attachment, 'delete').mockRejectedValue('Error')
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await deleteAttachment(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(500)
  })

  it('should log success', async () => {
    const req = getMockReq({ params: { id: '1' } })
    const { success } = mockAction(req.logger)
    const { res } = getMockRes()
    await deleteAttachment(req, res)
    expect(success).toHaveBeenCalled()
  })

  it('should log failure', async () => {
    jest.spyOn(prisma.attachment, 'delete').mockRejectedValue('Error')
    const req = getMockReq({ params: { id: '1' } })
    const { failure } = mockAction(req.logger)
    const { res } = getMockRes()
    await deleteAttachment(req, res)
    expect(failure).toHaveBeenCalledWith({ message: 'Error' })
  })
})

describe('downloadAttachments', () => {
  beforeEach(() => {
    jest.spyOn(prisma.attachment, 'findMany').mockResolvedValue([mockAttachment])
    mockArchiveStream()
  })

  it('should get attachments', async () => {
    const req = getMockReq({ query: { issueId: '1' } })
    const { res } = getMockRes()
    await downloadAttachments(req, res)
    expect(prisma.attachment.findMany).toHaveBeenCalledWith({ where: { issueId: 1 } })
  })

  it('should return 404 if not attachment was found', async () => {
    jest.spyOn(prisma.attachment, 'findMany').mockResolvedValue([])
    const req = getMockReq({ query: { issueId: '1' } })
    const { res } = getMockRes()
    await downloadAttachments(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(404)
  })

  it('should stream archive content', async () => {
    const archive = mockArchiveStream()
    const req = getMockReq({ query: { issueId: '1' } })
    const { res } = getMockRes()
    await downloadAttachments(req, res)
    expect(res.set).toHaveBeenCalledWith('Content-disposition', 'attachment; filename=1_attachments.zip')
    expect(res.set).toHaveBeenCalledWith('Content-Type', 'application/zip')
    expect(archive.pipe).toHaveBeenCalledWith(res)
  })

  it('should add attachments to archive', async () => {
    const archive = mockArchiveStream()
    const req = getMockReq({ query: { issueId: '1' } })
    const { res } = getMockRes()
    await downloadAttachments(req, res)
    expect(archive.file).toHaveBeenCalledWith(path.join('upload_dir', 'filepath'), { name: 'filename' })
    expect(archive.finalize).toHaveBeenCalled()
  })

  it('should return 500 status when failure', async () => {
    jest.spyOn(prisma.attachment, 'findMany').mockRejectedValue('Error')
    const req = getMockReq({ query: { issueId: '1' } })
    const { res } = getMockRes()
    await downloadAttachments(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(500)
  })

  it('should log success', async () => {
    const req = getMockReq({ query: { issueId: '1' } })
    const { success } = mockAction(req.logger)
    const { res } = getMockRes()
    await downloadAttachments(req, res)
    expect(success).toHaveBeenCalled()
  })

  it('should log failure', async () => {
    jest.spyOn(prisma.attachment, 'findMany').mockRejectedValue('Error')
    const req = getMockReq({ query: { issueId: '1' } })
    const { failure } = mockAction(req.logger)
    const { res } = getMockRes()
    await downloadAttachments(req, res)
    expect(failure).toHaveBeenCalledWith({ message: 'Error' })
  })
})

describe('downloadAttachment', () => {
  beforeEach(() => {
    jest.spyOn(prisma.attachment, 'findUnique').mockResolvedValue(mockAttachment)
    jest.spyOn(fs.promises, 'access').mockResolvedValue(undefined)
    mockReadStream()
  })

  it('should get attachment', async () => {
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

  it('should try to access attachement file', async () => {
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await downloadAttachment(req, res)
    expect(fs.promises.access).toHaveBeenCalledWith(path.join('upload_dir', 'filepath'), fs.constants.R_OK)
  })

  it('should return 404 if attachement file cannot be read', async () => {
    jest.spyOn(fs.promises, 'access').mockRejectedValue(new Error('500'))
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await downloadAttachment(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(404)
  })

  it('should get attachment content stream', async () => {
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await downloadAttachment(req, res)
    expect(fs.createReadStream).toHaveBeenCalledWith(path.join('upload_dir', 'filepath'))
  })

  it('should stream attachment content', async () => {
    const stream = mockReadStream()
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await downloadAttachment(req, res)
    expect(res.set).toHaveBeenCalledWith('Content-disposition', 'attachment; filename=filename')
    expect(res.set).toHaveBeenCalledWith('Content-Type', 'mime')
    expect(stream.pipe).toHaveBeenCalledWith(res)
  })

  it('should stream attachment content without content disposition for images', async () => {
    jest.spyOn(prisma.attachment, 'findUnique').mockResolvedValue({ ...mockAttachment, mime: 'image/' })
    const stream = mockReadStream()
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await downloadAttachment(req, res)
    expect(res.set).not.toHaveBeenCalledWith('Content-disposition', 'attachment; filename=filename')
    expect(res.set).toHaveBeenCalledWith('Content-Type', 'image/')
    expect(stream.pipe).toHaveBeenCalledWith(res)
  })

  it('should return 500 status when failure', async () => {
    jest.spyOn(prisma.attachment, 'findUnique').mockRejectedValue('Error')
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await downloadAttachment(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(500)
  })

  it('should log success', async () => {
    const req = getMockReq({ params: { id: '1' } })
    const { success } = mockAction(req.logger)
    const { res } = getMockRes()
    await downloadAttachment(req, res)
    expect(success).toHaveBeenCalled()
  })

  it('should log failure', async () => {
    jest.spyOn(prisma.attachment, 'findUnique').mockRejectedValue('Error')
    const req = getMockReq({ params: { id: '1' } })
    const { failure } = mockAction(req.logger)
    const { res } = getMockRes()
    await downloadAttachment(req, res)
    expect(failure).toHaveBeenCalledWith({ message: 'Error' })
  })
})
