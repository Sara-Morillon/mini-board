import { getMockReq, getMockRes } from '@jest-mock/express'
import { patchProject } from '../../../../src/controllers/projects/patchProject'
import { prisma } from '../../../../src/prisma'
import { mockProject } from '../../../mocks'

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
