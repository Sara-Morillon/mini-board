import { getMockReq, getMockRes } from '@jest-mock/express'
import { postProject } from '../../../../src/controllers/projects/postProject'
import { prisma } from '../../../../src/prisma'
import { mockProject } from '../../../mocks'

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
