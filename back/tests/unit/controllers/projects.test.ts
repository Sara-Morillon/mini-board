import { getMockReq, getMockRes } from '@jest-mock/express'
import { deleteProject, getProject, getProjects, patchProject, postProject } from '../../../src/controllers/projects'
import { prisma } from '../../../src/prisma'
import { mockProject } from '../../mocks'

describe('getProjects', () => {
  it('should get projects', async () => {
    jest.spyOn(prisma.project, 'findMany').mockResolvedValue([mockProject])
    const req = getMockReq()
    const { res } = getMockRes()
    await getProjects(req, res)
    expect(prisma.project.findMany).toHaveBeenCalledWith({ orderBy: { updatedAt: 'desc' } })
  })

  it('should return projects', async () => {
    jest.spyOn(prisma.project, 'findMany').mockResolvedValue([mockProject])
    const req = getMockReq()
    const { res } = getMockRes()
    await getProjects(req, res)
    expect(res.json).toHaveBeenCalledWith([mockProject])
  })

  it('should return 500 status when failure', async () => {
    jest.spyOn(prisma.project, 'findMany').mockRejectedValue(new Error())
    const req = getMockReq()
    const { res } = getMockRes()
    await getProjects(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(500)
  })
})

describe('postProject', () => {
  it('should create project', async () => {
    jest.spyOn(prisma.project, 'create').mockResolvedValue(mockProject)
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
    jest.spyOn(prisma.project, 'create').mockResolvedValue(mockProject)
    const req = getMockReq({ body: { key: 'key', name: 'name', description: 'description' } })
    const { res } = getMockRes()
    await postProject(req, res)
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith(1)
  })

  it('should return 500 status when failure', async () => {
    jest.spyOn(prisma.project, 'create').mockRejectedValue(new Error())
    const req = getMockReq({ body: { key: 'key', name: 'name', description: 'description' } })
    const { res } = getMockRes()
    await postProject(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(500)
  })
})

describe('getProject', () => {
  it('should get project', async () => {
    jest.spyOn(prisma.project, 'findUnique').mockResolvedValue(mockProject)
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await getProject(req, res)
    expect(prisma.project.findUnique).toHaveBeenCalledWith({ where: { id: 1 } })
  })

  it('should return project', async () => {
    jest.spyOn(prisma.project, 'findUnique').mockResolvedValue(mockProject)
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await getProject(req, res)
    expect(res.json).toHaveBeenCalledWith(mockProject)
  })

  it('should return 500 status when failure', async () => {
    jest.spyOn(prisma.project, 'findUnique').mockRejectedValue(new Error())
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await getProject(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(500)
  })
})

describe('patchProject', () => {
  it('should update project', async () => {
    jest.spyOn(prisma.project, 'update').mockResolvedValue(mockProject)
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
    jest.spyOn(prisma.project, 'update').mockResolvedValue(mockProject)
    const req = getMockReq({ params: { id: '1' }, body: { name: 'name', description: 'description' } })
    const { res } = getMockRes()
    await patchProject(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(1)
  })

  it('should return 500 status when failure', async () => {
    jest.spyOn(prisma.project, 'update').mockRejectedValue(new Error())
    const req = getMockReq({ params: { id: '1' }, body: { name: 'name', description: 'description' } })
    const { res } = getMockRes()
    await patchProject(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(500)
  })
})

describe('deleteProject', () => {
  it('should delete project', async () => {
    jest.spyOn(prisma.project, 'delete').mockResolvedValue(mockProject)
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await deleteProject(req, res)
    expect(prisma.project.delete).toHaveBeenCalledWith({ where: { id: 1 } })
  })

  it('should return 204 status', async () => {
    jest.spyOn(prisma.project, 'delete').mockResolvedValue(mockProject)
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await deleteProject(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(204)
  })

  it('should return 500 status when failure', async () => {
    jest.spyOn(prisma.project, 'delete').mockRejectedValue(new Error())
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await deleteProject(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(500)
  })
})
