import { getMockRes } from '@jest-mock/express'
import mockdate from 'mockdate'
import { getBoard } from '../../../src/controllers/board'
import { prisma } from '../../../src/prisma'
import { getMockReq, mockIssue } from '../../mocks'

mockdate.set('2023-01-01T00:00:00.000Z')

describe('getBoard', () => {
  it('should get issues', async () => {
    jest.spyOn(prisma.issue, 'findMany').mockResolvedValue([mockIssue])
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await getBoard(req, res)
    expect(prisma.issue.findMany).toHaveBeenCalledWith({
      where: { release: { dueDate: { gt: new Date('2023-01-01T00:00:00.000Z') } } },
      orderBy: [{ priority: 'asc' }],
      include: { author: true, project: true, release: true },
    })
  })

  it('should return issues', async () => {
    jest.spyOn(prisma.issue, 'findMany').mockResolvedValue([mockIssue])
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await getBoard(req, res)
    expect(res.json).toHaveBeenCalledWith([mockIssue])
  })

  it('should return 500 status when failure', async () => {
    jest.spyOn(prisma.issue, 'findMany').mockRejectedValue(new Error())
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await getBoard(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(500)
  })
})
