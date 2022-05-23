import { getMockReq, getMockRes } from '@jest-mock/express'
import { patchRelease } from '../../../../src/controllers/releases/patchRelease'
import { prisma } from '../../../../src/prisma'
import { mockRelease } from '../../../mocks'

describe('patchRelease', () => {
  it('should update release', async () => {
    jest.spyOn(prisma.release, 'update').mockResolvedValue(mockRelease)
    const req = getMockReq({ params: { id: '1' }, body: { name: 'name', dueDate: 'dueDate' } })
    const { res } = getMockRes()
    await patchRelease(req, res)
    expect(prisma.release.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: {
        name: 'name',
        dueDate: 'dueDate',
      },
    })
  })

  it('should return 200 status and updated release id', async () => {
    jest.spyOn(prisma.release, 'update').mockResolvedValue(mockRelease)
    const req = getMockReq({ params: { id: '1' }, body: { name: 'name', dueDate: 'dueDate' } })
    const { res } = getMockRes()
    await patchRelease(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(1)
  })

  it('should return 500 status when failure', async () => {
    jest.spyOn(prisma.release, 'update').mockRejectedValue(new Error())
    const req = getMockReq({ params: { id: '1' }, body: { name: 'name', dueDate: 'dueDate' } })
    const { res } = getMockRes()
    await patchRelease(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(500)
  })
})
