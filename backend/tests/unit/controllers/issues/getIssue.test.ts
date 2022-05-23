import { getMockReq, getMockRes } from '@jest-mock/express'
import { getIssue } from '../../../../src/controllers/issues/getIssue'
import { prisma } from '../../../../src/prisma'
import { mockIssue } from '../../../mocks'

describe('getIssue', () => {
  it('should get issue', async () => {
    jest.spyOn(prisma.issue, 'findUnique').mockResolvedValue(mockIssue)
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await getIssue(req, res)
    expect(prisma.issue.findUnique).toHaveBeenCalledWith({ where: { id: 1 } })
  })

  it('should return issue', async () => {
    jest.spyOn(prisma.issue, 'findUnique').mockResolvedValue(mockIssue)
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await getIssue(req, res)
    expect(res.json).toHaveBeenCalledWith(mockIssue)
  })

  it('should return 500 status when failure', async () => {
    jest.spyOn(prisma.issue, 'findUnique').mockRejectedValue(new Error())
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await getIssue(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(500)
  })
})
