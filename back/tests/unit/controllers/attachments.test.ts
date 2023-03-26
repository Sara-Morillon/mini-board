import { getMockRes } from '@jest-mock/express'
import archiver from 'archiver'
import fs, { ReadStream } from 'fs'
import path from 'path'
import {
  deleteAttachment,
  downloadAttachment,
  downloadAttachments,
  getAttachments,
  postAttachments,
} from '../../../src/controllers/attachments'
import { prisma } from '../../../src/prisma'
import { getMockReq, mockAttachment, mockUser } from '../../mocks'

jest.mock('archiver')
jest.mock('archiver')

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

describe('postAttachments', () => {
  it('should create attachment', async () => {
    jest.spyOn(prisma.attachment, 'create').mockResolvedValue(mockAttachment)
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
    jest.spyOn(prisma.attachment, 'create').mockResolvedValue(mockAttachment)
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
    jest.spyOn(prisma.attachment, 'create').mockRejectedValue(new Error())
    const req = getMockReq({
      params: { id: '1' },
      files: [{ originalname: 'filename', filename: 'filepath', mimetype: 'mimetype' }],
      user: mockUser,
    })
    const { res } = getMockRes()
    await postAttachments(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(500)
  })
})

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

describe('downloadAttachments', () => {
  it('should get attachments', async () => {
    jest.spyOn(prisma.attachment, 'findMany').mockResolvedValue([mockAttachment])
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
    jest.spyOn(prisma.attachment, 'findMany').mockResolvedValue([mockAttachment])
    const archive = { pipe: jest.fn(), file: jest.fn(), finalize: jest.fn() }
    jest.mocked(archiver).mockReturnValue(archive as never)
    const req = getMockReq({ query: { issueId: '1' } })
    const { res } = getMockRes()
    await downloadAttachments(req, res)
    expect(res.set).toHaveBeenCalledWith('Content-disposition', 'attachment; filename=1_attachments.zip')
    expect(res.set).toHaveBeenCalledWith('Content-Type', 'application/zip')
    expect(archive.pipe).toHaveBeenCalledWith(res)
  })

  it('should add attachments to archive', async () => {
    jest.spyOn(prisma.attachment, 'findMany').mockResolvedValue([mockAttachment])
    const archive = { pipe: jest.fn(), file: jest.fn(), finalize: jest.fn() }
    jest.mocked(archiver).mockReturnValue(archive as never)
    const req = getMockReq({ query: { issueId: '1' } })
    const { res } = getMockRes()
    await downloadAttachments(req, res)
    expect(archive.file).toHaveBeenCalledWith(path.join('upload_dir', 'filepath'), { name: 'filename' })
    expect(archive.finalize).toHaveBeenCalled()
  })

  it('should return 500 status when failure', async () => {
    jest.spyOn(prisma.attachment, 'findMany').mockRejectedValue(new Error())
    const req = getMockReq({ query: { issueId: '1' } })
    const { res } = getMockRes()
    await downloadAttachments(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(500)
  })
})

describe('downloadAttachment', () => {
  beforeEach(() => {
    jest.spyOn(prisma.attachment, 'findUnique').mockResolvedValue(mockAttachment)
    jest.spyOn(fs.promises, 'access').mockResolvedValue(undefined)
    jest.spyOn(fs, 'createReadStream').mockReturnValue({} as ReadStream)
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
