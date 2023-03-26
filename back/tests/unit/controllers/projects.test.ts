import { getMockRes } from '@jest-mock/express'
import { deleteProject, getProject, getProjects, patchProject, postProject } from '../../../src/controllers/projects'
import { prisma } from '../../../src/prisma'
import { getMockReq, mockAction, mockProject } from '../../mocks'

describe('getProjects', () => {
  beforeEach(() => {
    jest.spyOn(prisma.project, 'findMany').mockResolvedValue([mockProject()])
  })

  it('should get projects', async () => {
    const req = getMockReq()
    const { res } = getMockRes()
    await getProjects(req, res)
    expect(prisma.project.findMany).toHaveBeenCalledWith({ orderBy: { updatedAt: 'desc' } })
  })

  it('should return projects', async () => {
    const req = getMockReq()
    const { res } = getMockRes()
    await getProjects(req, res)
    expect(res.json).toHaveBeenCalledWith([mockProject()])
  })

  it('should return 500 status when failure', async () => {
    jest.spyOn(prisma.project, 'findMany').mockRejectedValue('Error')
    const req = getMockReq()
    const { res } = getMockRes()
    await getProjects(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(500)
  })

  it('should log success', async () => {
    const req = getMockReq()
    const { success } = mockAction(req.logger)
    const { res } = getMockRes()
    await getProjects(req, res)
    expect(success).toHaveBeenCalled()
  })

  it('should log failure', async () => {
    jest.spyOn(prisma.project, 'findMany').mockRejectedValue('Error')
    const req = getMockReq()
    const { failure } = mockAction(req.logger)
    const { res } = getMockRes()
    await getProjects(req, res)
    expect(failure).toHaveBeenCalledWith({ message: 'Error' })
  })
})

describe('postProject', () => {
  beforeEach(() => {
    jest.spyOn(prisma.project, 'create').mockResolvedValue(mockProject())
  })

  it('should create project', async () => {
    const req = getMockReq({ body: { key: 'key', name: 'name', description: 'description' } })
    const { res } = getMockRes()
    await postProject(req, res)
    expect(prisma.project.create).toHaveBeenCalledWith({
      data: {
        key: 'key',
        name: 'name',
        description: 'description',
      },
    })
  })

  it('should return 201 status and created project id', async () => {
    const req = getMockReq({ body: { key: 'key', name: 'name', description: 'description' } })
    const { res } = getMockRes()
    await postProject(req, res)
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith(1)
  })

  it('should return 500 status when failure', async () => {
    jest.spyOn(prisma.project, 'create').mockRejectedValue('Error')
    const req = getMockReq({ body: { key: 'key', name: 'name', description: 'description' } })
    const { res } = getMockRes()
    await postProject(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(500)
  })

  it('should log success', async () => {
    const req = getMockReq({ body: { key: 'key', name: 'name', description: 'description' } })
    const { success } = mockAction(req.logger)
    const { res } = getMockRes()
    await postProject(req, res)
    expect(success).toHaveBeenCalled()
  })

  it('should log failure', async () => {
    jest.spyOn(prisma.project, 'create').mockRejectedValue('Error')
    const req = getMockReq({ body: { key: 'key', name: 'name', description: 'description' } })
    const { failure } = mockAction(req.logger)
    const { res } = getMockRes()
    await postProject(req, res)
    expect(failure).toHaveBeenCalledWith({ message: 'Error' })
  })
})

describe('getProject', () => {
  beforeEach(() => {
    jest.spyOn(prisma.project, 'findUnique').mockResolvedValue(mockProject())
  })

  it('should get project', async () => {
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await getProject(req, res)
    expect(prisma.project.findUnique).toHaveBeenCalledWith({ where: { id: 1 } })
  })

  it('should return project', async () => {
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await getProject(req, res)
    expect(res.json).toHaveBeenCalledWith(mockProject())
  })

  it('should return 500 status when failure', async () => {
    jest.spyOn(prisma.project, 'findUnique').mockRejectedValue('Error')
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await getProject(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(500)
  })

  it('should log success', async () => {
    const req = getMockReq({ params: { id: '1' } })
    const { success } = mockAction(req.logger)
    const { res } = getMockRes()
    await getProject(req, res)
    expect(success).toHaveBeenCalled()
  })

  it('should log failure', async () => {
    jest.spyOn(prisma.project, 'findUnique').mockRejectedValue('Error')
    const req = getMockReq({ params: { id: '1' } })
    const { failure } = mockAction(req.logger)
    const { res } = getMockRes()
    await getProject(req, res)
    expect(failure).toHaveBeenCalledWith({ message: 'Error' })
  })
})

describe('patchProject', () => {
  beforeEach(() => {
    jest.spyOn(prisma.project, 'update').mockResolvedValue(mockProject())
  })

  it('should update project', async () => {
    const req = getMockReq({ params: { id: '1' }, body: { name: 'name', description: 'description' } })
    const { res } = getMockRes()
    await patchProject(req, res)
    expect(prisma.project.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: {
        name: 'name',
        description: 'description',
      },
    })
  })

  it('should return 200 status and updated project id', async () => {
    const req = getMockReq({ params: { id: '1' }, body: { name: 'name', description: 'description' } })
    const { res } = getMockRes()
    await patchProject(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(1)
  })

  it('should return 500 status when failure', async () => {
    jest.spyOn(prisma.project, 'update').mockRejectedValue('Error')
    const req = getMockReq({ params: { id: '1' }, body: { name: 'name', description: 'description' } })
    const { res } = getMockRes()
    await patchProject(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(500)
  })

  it('should log success', async () => {
    const req = getMockReq({ params: { id: '1' }, body: { name: 'name', description: 'description' } })
    const { success } = mockAction(req.logger)
    const { res } = getMockRes()
    await patchProject(req, res)
    expect(success).toHaveBeenCalled()
  })

  it('should log failure', async () => {
    jest.spyOn(prisma.project, 'update').mockRejectedValue('Error')
    const req = getMockReq({ params: { id: '1' }, body: { name: 'name', description: 'description' } })
    const { failure } = mockAction(req.logger)
    const { res } = getMockRes()
    await patchProject(req, res)
    expect(failure).toHaveBeenCalledWith({ message: 'Error' })
  })
})

describe('deleteProject', () => {
  beforeEach(() => {
    jest.spyOn(prisma.project, 'delete').mockResolvedValue(mockProject())
  })

  it('should delete project', async () => {
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await deleteProject(req, res)
    expect(prisma.project.delete).toHaveBeenCalledWith({ where: { id: 1 } })
  })

  it('should return 204 status', async () => {
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await deleteProject(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(204)
  })

  it('should return 500 status when failure', async () => {
    jest.spyOn(prisma.project, 'delete').mockRejectedValue('Error')
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await deleteProject(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(500)
  })

  it('should log success', async () => {
    const req = getMockReq({ params: { id: '1' } })
    const { success } = mockAction(req.logger)
    const { res } = getMockRes()
    await deleteProject(req, res)
    expect(success).toHaveBeenCalled()
  })

  it('should log failure', async () => {
    jest.spyOn(prisma.project, 'delete').mockRejectedValue('Error')
    const req = getMockReq({ params: { id: '1' } })
    const { failure } = mockAction(req.logger)
    const { res } = getMockRes()
    await deleteProject(req, res)
    expect(failure).toHaveBeenCalledWith({ message: 'Error' })
  })
})
