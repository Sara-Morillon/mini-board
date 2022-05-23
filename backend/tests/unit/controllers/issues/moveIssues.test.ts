import { getMockReq, getMockRes } from '@jest-mock/express'
import { moveIssues } from '../../../../src/controllers/issues/moveIssues'
import { prisma } from '../../../../src/prisma'
import { mockIssue } from '../../../mocks'

describe('moveIssue', () => {
  beforeEach(() => {
    jest.spyOn(prisma.issue, 'findUnique').mockResolvedValue(null)
    jest.spyOn(prisma.issue, 'findMany').mockResolvedValue([])
    jest.spyOn(prisma.issue, 'update').mockResolvedValue(mockIssue)
  })

  it('should get source issue', async () => {
    const req = getMockReq({ body: { sourceId: 1, targetId: 2 } })
    const { res } = getMockRes()
    await moveIssues(req, res)
    expect(prisma.issue.findUnique).toHaveBeenCalledWith({ where: { id: 1 } })
  })

  it('should get target issue', async () => {
    const req = getMockReq({ body: { sourceId: 1, targetId: 2 } })
    const { res } = getMockRes()
    await moveIssues(req, res)
    expect(prisma.issue.findUnique).toHaveBeenCalledWith({ where: { id: 2 } })
  })

  it('should do nothing if source issue is not found', async () => {
    const req = getMockReq({ body: { sourceId: 1, targetId: 2 } })
    const { res } = getMockRes()
    await moveIssues(req, res)
    expect(prisma.issue.update).not.toHaveBeenCalled()
  })

  it('should do nothing if target issue is not found', async () => {
    jest.spyOn(prisma.issue, 'findUnique').mockResolvedValueOnce(mockIssue)
    const req = getMockReq({ body: { sourceId: 1, targetId: 2 } })
    const { res } = getMockRes()
    await moveIssues(req, res)
    expect(prisma.issue.update).not.toHaveBeenCalled()
  })

  it('should save all issues with updated release and priority', async () => {
    const issues = [
      mockIssue,
      { ...mockIssue, id: 2, releaseId: 1, priority: 1 },
      { ...mockIssue, id: 3, releaseId: 2 },
      { ...mockIssue, id: 4, releaseId: 2, priority: 1 },
    ]
    jest.spyOn(prisma.issue, 'findUnique').mockResolvedValueOnce(issues[0])
    jest.spyOn(prisma.issue, 'findUnique').mockResolvedValueOnce(issues[2])
    jest.spyOn(prisma.issue, 'findMany').mockResolvedValueOnce(issues)
    const req = getMockReq({ body: { sourceId: 1, targetId: 3 } })
    const { res } = getMockRes()
    await moveIssues(req, res)
    expect(prisma.issue.update).toHaveBeenCalledWith({ where: { id: 1 }, data: { priority: 1, releaseId: 2 } })
    expect(prisma.issue.update).toHaveBeenCalledWith({ where: { id: 2 }, data: { priority: 0, releaseId: 1 } })
    expect(prisma.issue.update).toHaveBeenCalledWith({ where: { id: 3 }, data: { priority: 0, releaseId: 2 } })
    expect(prisma.issue.update).toHaveBeenCalledWith({ where: { id: 4 }, data: { priority: 2, releaseId: 2 } })
  })

  it('should return 204 status', async () => {
    const req = getMockReq({ body: { sourceId: 1, targetId: 2 } })
    const { res } = getMockRes()
    await moveIssues(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(204)
  })

  it('should return 500 status when failure', async () => {
    jest.spyOn(prisma.issue, 'findUnique').mockRejectedValue(new Error())
    const req = getMockReq({ body: { sourceId: 1, targetId: 2 } })
    const { res } = getMockRes()
    await moveIssues(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(500)
  })
})
