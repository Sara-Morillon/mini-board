import { getMockReq, getMockRes } from '@jest-mock/express'
import { getIssues } from '../../../../src/controllers/issues/getIssues'
import { prisma } from '../../../../src/prisma'
import { mockIssue } from '../../../mocks'

describe('getIssues', () => {
  it('should get issues', async () => {
    jest.spyOn(prisma.issue, 'findMany').mockResolvedValue([mockIssue])
    jest.spyOn(prisma.issue, 'count').mockResolvedValue(1)
    const req = getMockReq({ query: { projectId: '1', releaseId: '1', page: '2', limit: '10' } })
    const { res } = getMockRes()
    await getIssues(req, res)
    expect(prisma.issue.findMany).toHaveBeenCalledWith({
      where: { projectId: 1, releaseId: 1 },
      orderBy: [{ release: { dueDate: 'desc' } }, { priority: 'asc' }],
      include: { author: true, project: true, release: true },
      take: 10,
      skip: 10,
    })
  })

  it('should count issues', async () => {
    jest.spyOn(prisma.issue, 'findMany').mockResolvedValue([mockIssue])
    jest.spyOn(prisma.issue, 'count').mockResolvedValue(1)
    const req = getMockReq({ query: { projectId: '1', releaseId: '1', page: '2', limit: '10' } })
    const { res } = getMockRes()
    await getIssues(req, res)
    expect(prisma.issue.count).toHaveBeenCalledWith({ where: { projectId: 1, releaseId: 1 } })
  })

  it('should return issues', async () => {
    jest.spyOn(prisma.issue, 'findMany').mockResolvedValue([mockIssue])
    jest.spyOn(prisma.issue, 'count').mockResolvedValue(1)
    const req = getMockReq({ query: { projectId: '1', releaseId: '1', page: '2', limit: '10' } })
    const { res } = getMockRes()
    await getIssues(req, res)
    expect(res.json).toHaveBeenCalledWith({ issues: [mockIssue], total: 1 })
  })

  it('should return 500 status when failure', async () => {
    jest.spyOn(prisma.issue, 'findMany').mockRejectedValue(new Error())
    const req = getMockReq({ query: { projectId: '1', releaseId: '1', page: '2', limit: '10' } })
    const { res } = getMockRes()
    await getIssues(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(500)
  })
})
