import { getMockReq, getMockRes } from '@jest-mock/express'
import { getProject } from '../../../../src/controllers/projects/getProject'
import { prisma } from '../../../../src/prisma'
import { mockProject } from '../../../mocks'

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
