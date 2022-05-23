import { getMockReq, getMockRes } from '@jest-mock/express'
import { deleteProject } from '../../../../src/controllers/projects/deleteProject'
import { prisma } from '../../../../src/prisma'
import { mockProject } from '../../../mocks'

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
