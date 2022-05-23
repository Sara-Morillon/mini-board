import { getMockReq, getMockRes } from '@jest-mock/express'
import { deleteIssue } from '../../../../src/controllers/issues/deleteIssue'
import { prisma } from '../../../../src/prisma'
import { mockIssue } from '../../../mocks'

describe('deleteIssue', () => {
  it('should delete issue', async () => {
    jest.spyOn(prisma.issue, 'delete').mockResolvedValue(mockIssue)
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await deleteIssue(req, res)
    expect(prisma.issue.delete).toHaveBeenCalledWith({ where: { id: 1 } })
  })

  it('should return 204 status', async () => {
    jest.spyOn(prisma.issue, 'delete').mockResolvedValue(mockIssue)
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await deleteIssue(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(204)
  })

  it('should return 500 status when failure', async () => {
    jest.spyOn(prisma.issue, 'delete').mockRejectedValue(new Error())
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await deleteIssue(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(500)
  })
})
