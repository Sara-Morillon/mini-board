import { getMockReq, getMockRes } from '@jest-mock/express'
import archiver from 'archiver'
import path from 'path'
import { downloadAttachments } from '../../../../src/controllers/attachments/downloadAttachments'
import { prisma } from '../../../../src/prisma'
import { mock, mockAttachment } from '../../../mocks'

jest.mock('archiver')

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
    mock(archiver).mockReturnValue(archive)
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
    mock(archiver).mockReturnValue(archive)
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
