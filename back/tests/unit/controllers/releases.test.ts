import { getMockReq, getMockRes } from '@jest-mock/express'
import { deleteRelease, getRelease, getReleases, patchRelease, postRelease } from '../../../src/controllers/releases'
import { prisma } from '../../../src/prisma'
import { mockRelease } from '../../mocks'

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
