import { getMockReq, getMockRes } from '@jest-mock/express'
import { getReleases } from '../../../../src/controllers/releases/getReleases'
import { prisma } from '../../../../src/prisma'
import { mockRelease } from '../../../mocks'

describe('getReleases', () => {
  it('should get releases', async () => {
    jest.spyOn(prisma.release, 'findMany').mockResolvedValue([mockRelease])
    const req = getMockReq({ query: { projectId: '1' } })
    const { res } = getMockRes()
    await getReleases(req, res)
    expect(prisma.release.findMany).toHaveBeenCalledWith({
      where: { projectId: 1 },
      orderBy: { dueDate: 'desc' },
    })
  })

  it('should return releases', async () => {
    jest.spyOn(prisma.release, 'findMany').mockResolvedValue([mockRelease])
    const req = getMockReq({ query: { projectId: '1' } })
    const { res } = getMockRes()
    await getReleases(req, res)
    expect(res.json).toHaveBeenCalledWith([mockRelease])
  })

  it('should return 500 status when failure', async () => {
    jest.spyOn(prisma.release, 'findMany').mockRejectedValue(new Error())
    const req = getMockReq({ query: { projectId: '1' } })
    const { res } = getMockRes()
    await getReleases(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(500)
  })
})
