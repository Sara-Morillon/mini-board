import { getMockReq, getMockRes } from '@jest-mock/express'
import { getProjects } from '../../../../src/controllers/projects/getProjects'
import { prisma } from '../../../../src/prisma'
import { mockProject } from '../../../mocks'

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
