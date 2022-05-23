import { getMockReq, getMockRes } from '@jest-mock/express'
import { getRelease } from '../../../../src/controllers/releases/getRelease'
import { prisma } from '../../../../src/prisma'
import { mockRelease } from '../../../mocks'

describe('getRelease', () => {
  it('should get release', async () => {
    jest.spyOn(prisma.release, 'findUnique').mockResolvedValue(mockRelease)
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await getRelease(req, res)
    expect(prisma.release.findUnique).toHaveBeenCalledWith({ where: { id: 1 } })
  })

  it('should return release', async () => {
    jest.spyOn(prisma.release, 'findUnique').mockResolvedValue(mockRelease)
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await getRelease(req, res)
    expect(res.json).toHaveBeenCalledWith(mockRelease)
  })

  it('should return 500 status when failure', async () => {
    jest.spyOn(prisma.release, 'findUnique').mockRejectedValue(new Error())
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await getRelease(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(500)
  })
})
