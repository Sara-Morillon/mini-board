import { getMockReq, getMockRes } from '@jest-mock/express'
import { postRelease } from '../../../../src/controllers/releases/postRelease'
import { prisma } from '../../../../src/prisma'
import { mockRelease } from '../../../mocks'

describe('postRelease', () => {
  it('should create release', async () => {
    jest.spyOn(prisma.release, 'create').mockResolvedValue(mockRelease)
    const req = getMockReq({ body: { projectId: 1, name: 'name', dueDate: 'dueDate' } })
    const { res } = getMockRes()
    await postRelease(req, res)
    expect(prisma.release.create).toHaveBeenCalledWith({
      data: {
        projectId: 1,
        name: 'name',
        dueDate: 'dueDate',
      },
    })
  })

  it('should return 201 status and created release id', async () => {
    jest.spyOn(prisma.release, 'create').mockResolvedValue(mockRelease)
    const req = getMockReq({ body: { projectId: 1, name: 'name', dueDate: 'dueDate' } })
    const { res } = getMockRes()
    await postRelease(req, res)
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith(1)
  })

  it('should return 500 status when failure', async () => {
    jest.spyOn(prisma.release, 'create').mockRejectedValue(new Error())
    const req = getMockReq({ body: { projectId: 1, name: 'name', dueDate: 'dueDate' } })
    const { res } = getMockRes()
    await postRelease(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(500)
  })
})
