import { getMockReq, getMockRes } from '@jest-mock/express'
import { promises as fs } from 'fs'
import { deleteIssue, Req } from '../../../src/controllers/issues/deleteIssue'
import { Attachment } from '../../../src/models/Attachment'
import { Issue } from '../../../src/models/Issue'
import { mockRepository, RepoMock } from '../../mocks/repository'

jest.mock('../../../src/models/Issue')
jest.mock('../../../src/models/Attachment')

describe('deleteIssue', () => {
  const req = getMockReq<Req>({ params: { projectId: 'projectId', id: 'id' } })
  const { res, clearMockRes } = getMockRes()

  let issueMock: RepoMock<Issue>
  let attachmentMock: RepoMock<Issue>
  let unlinkSpy: jest.SpyInstance

  beforeEach(() => {
    clearMockRes()

    issueMock = mockRepository(Issue.getRepository as jest.Mock)
    issueMock.delete.mockResolvedValue(undefined)

    attachmentMock = mockRepository(Attachment.getRepository as jest.Mock)
    attachmentMock.find.mockResolvedValue([])

    unlinkSpy = jest.spyOn(fs, 'unlink')
    unlinkSpy.mockResolvedValue(undefined)
  })

  it('should delete issue', async () => {
    await deleteIssue(req, res)
    expect(issueMock.delete).toHaveBeenCalledWith('id')
  })

  it('should fetch attachments', async () => {
    await deleteIssue(req, res)
    expect(attachmentMock.find).toHaveBeenCalledWith({ where: { issue: { id: 'id' } } })
  })

  it('should not unlink file if there is no attachment', async () => {
    await deleteIssue(req, res)
    expect(unlinkSpy).not.toHaveBeenCalled()
  })

  it('should unlink attachments files', async () => {
    attachmentMock.find.mockResolvedValue([{ filepath: 'filepath1' }, { filepath: 'filepath2' }])
    await deleteIssue(req, res)
    expect(unlinkSpy).toHaveBeenCalledWith('upload/filepath1')
    expect(unlinkSpy).toHaveBeenCalledWith('upload/filepath2')
  })

  it('should redirect to issues page', async () => {
    await deleteIssue(req, res)
    expect(res.redirect).toHaveBeenCalledWith('/project/projectId/issues/list')
  })
})
