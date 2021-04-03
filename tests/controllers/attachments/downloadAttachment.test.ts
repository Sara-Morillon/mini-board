import { getMockReq, getMockRes } from '@jest-mock/express'
import fs from 'fs'
import { downloadAttachment, Req } from '../../../src/controllers/attachments/downloadAttachment'
import { Attachment } from '../../../src/models/Attachment'
import { mockRepository, RepoMock } from '../../mocks/repository'

jest.mock('../../../src/models/Attachment')

describe('downloadAttachment', () => {
  const req = getMockReq<Req>({ params: { id: 'id' } })
  const { res, clearMockRes } = getMockRes()

  let attachmentMock: RepoMock<Attachment>
  let createReadStreamSpy: jest.SpyInstance

  beforeEach(() => {
    clearMockRes()

    attachmentMock = mockRepository(Attachment.getRepository as jest.Mock)
    attachmentMock.findOne.mockResolvedValue(null)

    createReadStreamSpy = jest.spyOn(fs, 'createReadStream')
    createReadStreamSpy.mockReturnValue({ pipe: jest.fn() })
  })

  it('should fetch attachment', async () => {
    await downloadAttachment(req, res)
    expect(attachmentMock.findOne).toHaveBeenCalledWith('id')
  })

  it('should render 404 page if attachment is not found', async () => {
    await downloadAttachment(req, res)
    expect(res.render).toHaveBeenCalledWith('404')
  })

  it('should open attachment read stream', async () => {
    attachmentMock.findOne.mockResolvedValue({ filepath: 'filepath' })
    await downloadAttachment(req, res)
    expect(createReadStreamSpy).toHaveBeenCalledWith('upload/filepath')
  })

  it('should set attachment headers', async () => {
    attachmentMock.findOne.mockResolvedValue({ filename: 'filename', mime: 'mime', filepath: 'filepath' })
    await downloadAttachment(req, res)
    expect(res.set).toHaveBeenCalledWith('Content-disposition', 'filename=filename')
    expect(res.set).toHaveBeenCalledWith('Content-Type', 'mime')
  })

  it('should pipe read stream to res', async () => {
    attachmentMock.findOne.mockResolvedValue({ filename: 'filename', mime: 'mime', filepath: 'filepath' })
    const pipe = jest.fn()
    createReadStreamSpy.mockReturnValue({ pipe })
    await downloadAttachment(req, res)
    expect(pipe).toHaveBeenCalledWith(res)
  })
})
