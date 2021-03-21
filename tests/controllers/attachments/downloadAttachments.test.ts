import { downloadAttachments, Req } from '@/controllers/attachments/downloadAttachments'
import { Attachment } from '@/models/Attachment'
import { getMockReq, getMockRes } from '@jest-mock/express'
import archiver from 'archiver'
import fs from 'fs'
import { mockRepository, RepoMock } from '../../mocks/repository'

jest.mock('@/models/Attachment')
jest.mock('archiver')

const archiverMock = (archiver as unknown) as jest.Mock

describe('downloadAttachments', () => {
  const req = getMockReq<Req>({ query: { issueId: 'issueId' } })
  const { res, clearMockRes } = getMockRes()

  let attachmentMock: RepoMock<Attachment>
  let createReadStreamSpy: jest.SpyInstance

  beforeEach(() => {
    clearMockRes()

    attachmentMock = mockRepository(Attachment.getRepository as jest.Mock)
    attachmentMock.find.mockResolvedValue([])

    createReadStreamSpy = jest.spyOn(fs, 'createReadStream')
    createReadStreamSpy.mockReturnValue({ pipe: jest.fn() })
  })

  it('should fetch attachments', async () => {
    archiverMock.mockReturnValue({ pipe: jest.fn(), finalize: jest.fn() })
    await downloadAttachments(req, res)
    expect(attachmentMock.find).toHaveBeenCalledWith({ where: { issue: { id: 'issueId' } } })
  })

  it('should create archive', async () => {
    archiverMock.mockReturnValue({ pipe: jest.fn(), finalize: jest.fn() })
    await downloadAttachments(req, res)
    expect(archiverMock).toHaveBeenCalledWith('zip')
  })

  it('should add attachments to archive', async () => {
    const file = jest.fn()
    archiverMock.mockReturnValue({ pipe: jest.fn(), finalize: jest.fn(), file })
    attachmentMock.find.mockResolvedValue([
      { filename: 'filename1', mime: 'mime1', filepath: 'filepath1' },
      { filename: 'filename2', mime: 'mime2', filepath: 'filepath2' },
    ])
    await downloadAttachments(req, res)
    expect(file).toHaveBeenCalledWith('upload/filepath1', { name: 'filename1' })
    expect(file).toHaveBeenCalledWith('upload/filepath2', { name: 'filename2' })
  })

  it('should set attachment headers', async () => {
    archiverMock.mockReturnValue({ pipe: jest.fn(), finalize: jest.fn() })
    await downloadAttachments(req, res)
    expect(res.set).toHaveBeenCalledWith('Content-disposition', 'attachment; filename=attachments.zip')
    expect(res.set).toHaveBeenCalledWith('Content-Type', 'application/zip')
  })

  it('should pipe read stream to res', async () => {
    const pipe = jest.fn()
    archiverMock.mockReturnValue({ pipe, finalize: jest.fn() })
    await downloadAttachments(req, res)
    expect(pipe).toHaveBeenCalledWith(res)
  })

  it('should finalize archive', async () => {
    const finalize = jest.fn()
    archiverMock.mockReturnValue({ pipe: jest.fn(), finalize })
    await downloadAttachments(req, res)
    expect(finalize).toHaveBeenCalled()
  })
})
