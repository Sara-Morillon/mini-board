import { getMockReq, getMockRes } from '@jest-mock/express'
import { deleteRelease } from '../../../../src/controllers/releases/deleteRelease'
import { prisma } from '../../../../src/prisma'
import { mockRelease } from '../../../mocks'

describe('deleteRelease', () => {
  it('should delete release', async () => {
    jest.spyOn(prisma.release, 'delete').mockResolvedValue(mockRelease)
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await deleteRelease(req, res)
    expect(prisma.release.delete).toHaveBeenCalledWith({ where: { id: 1 } })
  })

  it('should return 204 status', async () => {
    jest.spyOn(prisma.release, 'delete').mockResolvedValue(mockRelease)
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await deleteRelease(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(204)
  })

  it('should return 500 status when failure', async () => {
    jest.spyOn(prisma.release, 'delete').mockRejectedValue(new Error())
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await deleteRelease(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(500)
  })
})
