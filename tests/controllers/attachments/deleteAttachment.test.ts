import { getMockReq, getMockRes } from '@jest-mock/express'
import { promises as fs } from 'fs'
import { deleteAttachment, Req } from '../../../src/controllers/attachments/deleteAttachment'
import { Attachment } from '../../../src/models/Attachment'
import { mockRepository, RepoMock } from '../../mocks/repository'

jest.mock('../../../src/models/Attachment')

describe('deleteAttachment', () => {
  const req = getMockReq<Req>({ params: { projectId: 'projectId', id: 'id' }, query: { issueId: 'issueId' } })
  const { res, clearMockRes } = getMockRes()

  let attachmentMock: RepoMock<Attachment>
  let unlinkSpy: jest.SpyInstance

  beforeEach(() => {
    clearMockRes()

    attachmentMock = mockRepository(Attachment.getRepository as jest.Mock)
    attachmentMock.findOne.mockResolvedValue(null)
    attachmentMock.delete.mockResolvedValue(undefined)

    unlinkSpy = jest.spyOn(fs, 'unlink')
    unlinkSpy.mockResolvedValue(undefined)
  })

  it('should fetch attachment', async () => {
    await deleteAttachment(req, res)
    expect(attachmentMock.findOne).toHaveBeenCalledWith('id')
  })

  it('should not unlink file if attachment is not found', async () => {
    await deleteAttachment(req, res)
    expect(unlinkSpy).not.toHaveBeenCalled()
  })

  it('should unlink file if attachment is found', async () => {
    attachmentMock.findOne.mockResolvedValue({ filepath: 'filepath' })
    await deleteAttachment(req, res)
    expect(unlinkSpy).toHaveBeenCalledWith('upload/filepath')
  })

  it('should delete attachment', async () => {
    await deleteAttachment(req, res)
    expect(attachmentMock.delete).toHaveBeenCalledWith('id')
  })

  it('should redirect to issue page', async () => {
    await deleteAttachment(req, res)
    expect(res.redirect).toHaveBeenCalledWith('/project/projectId/issues/edit/issueId')
  })
})
