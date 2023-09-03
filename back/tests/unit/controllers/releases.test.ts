import mockdate from 'mockdate'
import { deleteRelease, getRelease, getReleases, patchRelease, postRelease } from '../../../src/controllers/releases'
import { prisma } from '../../../src/prisma'
import { getMockReq, getMockRes, mockAction, mockRelease } from '../../mocks'

mockdate.set('2023-01-01T00:00:00.000Z')

describe('getReleases', () => {
  beforeEach(() => {
    vi.spyOn(prisma.release, 'findMany').mockResolvedValue([mockRelease()])
  })

  it('should get open releases', async () => {
    const req = getMockReq()
    const { res } = getMockRes()
    await getReleases(req, res)
    expect(prisma.release.findMany).toHaveBeenCalledWith({
      where: { dueDate: { gte: new Date('2023-01-01T00:00:00.000Z') } },
      orderBy: { dueDate: 'desc' },
    })
  })

  it('should get all releases', async () => {
    const req = getMockReq({ query: { all: 'true' } })
    const { res } = getMockRes()
    await getReleases(req, res)
    expect(prisma.release.findMany).toHaveBeenCalledWith({ orderBy: { dueDate: 'desc' } })
  })

  it('should return releases', async () => {
    const req = getMockReq()
    const { res } = getMockRes()
    await getReleases(req, res)
    expect(res.json).toHaveBeenCalledWith([mockRelease()])
  })

  it('should return 500 status when failure', async () => {
    vi.spyOn(prisma.release, 'findMany').mockRejectedValue('Error')
    const req = getMockReq()
    const { res } = getMockRes()
    await getReleases(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(500)
  })

  it('should log success', async () => {
    const req = getMockReq()
    const { success } = mockAction(req.logger)
    const { res } = getMockRes()
    await getReleases(req, res)
    expect(success).toHaveBeenCalled()
  })

  it('should log failure', async () => {
    vi.spyOn(prisma.release, 'findMany').mockRejectedValue('Error')
    const req = getMockReq()
    const { failure } = mockAction(req.logger)
    const { res } = getMockRes()
    await getReleases(req, res)
    expect(failure).toHaveBeenCalledWith({ message: 'Error' })
  })
})

describe('postRelease', () => {
  beforeEach(() => {
    vi.spyOn(prisma.release, 'create').mockResolvedValue(mockRelease())
  })

  it('should create release', async () => {
    const req = getMockReq({ body: { projectId: 1, name: 'name', dueDate: 'dueDate' } })
    const { res } = getMockRes()
    await postRelease(req, res)
    expect(prisma.release.create).toHaveBeenCalledWith({ data: { name: 'name', dueDate: 'dueDate' } })
  })

  it('should return 201 status and created release id', async () => {
    const req = getMockReq({ body: { projectId: 1, name: 'name', dueDate: 'dueDate' } })
    const { res } = getMockRes()
    await postRelease(req, res)
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith(1)
  })

  it('should return 500 status when failure', async () => {
    vi.spyOn(prisma.release, 'create').mockRejectedValue('Error')
    const req = getMockReq({ body: { projectId: 1, name: 'name', dueDate: 'dueDate' } })
    const { res } = getMockRes()
    await postRelease(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(500)
  })

  it('should log success', async () => {
    const req = getMockReq({ body: { projectId: 1, name: 'name', dueDate: 'dueDate' } })
    const { success } = mockAction(req.logger)
    const { res } = getMockRes()
    await postRelease(req, res)
    expect(success).toHaveBeenCalled()
  })

  it('should log failure', async () => {
    vi.spyOn(prisma.release, 'create').mockRejectedValue('Error')
    const req = getMockReq({ body: { projectId: 1, name: 'name', dueDate: 'dueDate' } })
    const { failure } = mockAction(req.logger)
    const { res } = getMockRes()
    await postRelease(req, res)
    expect(failure).toHaveBeenCalledWith({ message: 'Error' })
  })
})

describe('getRelease', () => {
  beforeEach(() => {
    vi.spyOn(prisma.release, 'findUnique').mockResolvedValue(mockRelease())
  })

  it('should get release', async () => {
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await getRelease(req, res)
    expect(prisma.release.findUnique).toHaveBeenCalledWith({ where: { id: 1 } })
  })

  it('should return release', async () => {
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await getRelease(req, res)
    expect(res.json).toHaveBeenCalledWith(mockRelease())
  })

  it('should return 500 status when failure', async () => {
    vi.spyOn(prisma.release, 'findUnique').mockRejectedValue('Error')
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await getRelease(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(500)
  })

  it('should log success', async () => {
    const req = getMockReq({ params: { id: '1' } })
    const { success } = mockAction(req.logger)
    const { res } = getMockRes()
    await getRelease(req, res)
    expect(success).toHaveBeenCalled()
  })

  it('should log failure', async () => {
    vi.spyOn(prisma.release, 'findUnique').mockRejectedValue('Error')
    const req = getMockReq({ params: { id: '1' } })
    const { failure } = mockAction(req.logger)
    const { res } = getMockRes()
    await getRelease(req, res)
    expect(failure).toHaveBeenCalledWith({ message: 'Error' })
  })
})

describe('patchRelease', () => {
  beforeEach(() => {
    vi.spyOn(prisma.release, 'update').mockResolvedValue(mockRelease())
  })

  it('should update release', async () => {
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
    const req = getMockReq({ params: { id: '1' }, body: { name: 'name', dueDate: 'dueDate' } })
    const { res } = getMockRes()
    await patchRelease(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(1)
  })

  it('should return 500 status when failure', async () => {
    vi.spyOn(prisma.release, 'update').mockRejectedValue('Error')
    const req = getMockReq({ params: { id: '1' }, body: { name: 'name', dueDate: 'dueDate' } })
    const { res } = getMockRes()
    await patchRelease(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(500)
  })

  it('should log success', async () => {
    const req = getMockReq({ params: { id: '1' }, body: { name: 'name', dueDate: 'dueDate' } })
    const { success } = mockAction(req.logger)
    const { res } = getMockRes()
    await patchRelease(req, res)
    expect(success).toHaveBeenCalled()
  })

  it('should log failure', async () => {
    vi.spyOn(prisma.release, 'update').mockRejectedValue('Error')
    const req = getMockReq({ params: { id: '1' }, body: { name: 'name', dueDate: 'dueDate' } })
    const { failure } = mockAction(req.logger)
    const { res } = getMockRes()
    await patchRelease(req, res)
    expect(failure).toHaveBeenCalledWith({ message: 'Error' })
  })
})

describe('deleteRelease', () => {
  beforeEach(() => {
    vi.spyOn(prisma.release, 'delete').mockResolvedValue(mockRelease())
  })

  it('should delete release', async () => {
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await deleteRelease(req, res)
    expect(prisma.release.delete).toHaveBeenCalledWith({ where: { id: 1 } })
  })

  it('should return 204 status', async () => {
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await deleteRelease(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(204)
  })

  it('should return 500 status when failure', async () => {
    vi.spyOn(prisma.release, 'delete').mockRejectedValue('Error')
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await deleteRelease(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(500)
  })

  it('should log success', async () => {
    const req = getMockReq({ params: { id: '1' } })
    const { success } = mockAction(req.logger)
    const { res } = getMockRes()
    await deleteRelease(req, res)
    expect(success).toHaveBeenCalled()
  })

  it('should log failure', async () => {
    vi.spyOn(prisma.release, 'delete').mockRejectedValue('Error')
    const req = getMockReq({ params: { id: '1' } })
    const { failure } = mockAction(req.logger)
    const { res } = getMockRes()
    await deleteRelease(req, res)
    expect(failure).toHaveBeenCalledWith({ message: 'Error' })
  })
})
