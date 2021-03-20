import { getMockReq, getMockRes } from '@jest-mock/express'
import { Between } from 'typeorm'
import { moveIssue, Req } from '../../../src/controllers/issues/moveIssue'
import { Issue } from '../../../src/models/Issue'
import { mockRepository, RepoMock } from '../../mocks/repository'

jest.mock('../../../src/models/Issue')

describe('moveIssue', () => {
  const req = getMockReq<Req>({
    params: { projectId: 'projectId', id: '8' },
    body: { status: 'doing', priority: 7, release: 5 },
  })
  const { res, clearMockRes } = getMockRes()

  let issueMock: RepoMock<Issue>

  beforeEach(() => {
    clearMockRes()
    issueMock = mockRepository(Issue.getRepository as jest.Mock)
    issueMock.findOne.mockResolvedValue({ release: { id: 1 }, priority: 2 })
    issueMock.update.mockResolvedValue(undefined)
  })

  it('should fetch issue', async () => {
    await moveIssue(req, res)
    expect(issueMock.findOne).toHaveBeenCalledWith('8', { relations: ['release'] })
  })

  it('should do nothing if issue is not found', async () => {
    issueMock.findOne.mockResolvedValue(null)
    await moveIssue(req, res)
    expect(issueMock.update).not.toHaveBeenCalled()
  })

  it('should update other issues priority', async () => {
    await moveIssue(req, res)
    expect(issueMock.update).toHaveBeenCalledWith(
      { priority: Between(2, 7), release: { id: 5 } },
      { priority: expect.any(Function) }
    )
  })

  it('should update issue priority', async () => {
    await moveIssue(req, res)
    expect(issueMock.update).toHaveBeenCalledWith('8', { priority: 7, status: 'doing', release: { id: 5 } })
  })

  it('should update priority', async () => {
    await moveIssue(req, res)
    expect(issueMock.findOne).toHaveBeenCalledWith('8', { relations: ['release'] })
  })

  it('should update status if status is in body', async () => {
    await moveIssue(req, res)
    expect(issueMock.update).toHaveBeenCalledWith('8', { status: 'doing', priority: 7, release: { id: 5 } })
  })

  it('should not update status if status is not in body', async () => {
    const req = getMockReq<Req>({ params: { projectId: 'projectId', id: '8' }, body: { priority: 7, release: 5 } })
    await moveIssue(req, res)
    expect(issueMock.update).toHaveBeenCalledWith('8', { priority: 7, release: { id: 5 } })
  })

  it('should return 204 status', async () => {
    await moveIssue(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(204)
  })
})
