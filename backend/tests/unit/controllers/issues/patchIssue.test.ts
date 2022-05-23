import { getMockReq, getMockRes } from '@jest-mock/express'
import { patchIssue } from '../../../../src/controllers/issues/patchIssue'
import { prisma } from '../../../../src/prisma'
import { mockIssue, mockUser } from '../../../mocks'

describe('patchIssue', () => {
  it('should return 401 status if no user', async () => {
    const req = getMockReq({
      params: { id: '1' },
      body: { releaseId: 1, type: 'bug', status: 'todo', points: 1, title: 'title', description: 'description' },
    })
    const { res } = getMockRes()
    await patchIssue(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(401)
  })

  it('should update issue', async () => {
    jest.spyOn(prisma.issue, 'update').mockResolvedValue(mockIssue)
    const req = getMockReq({
      params: { id: '1' },
      body: { releaseId: 1, type: 'bug', status: 'todo', points: 1, title: 'title', description: 'description' },
      user: mockUser,
    })
    const { res } = getMockRes()
    await patchIssue(req, res)
    expect(prisma.issue.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: {
        authorId: 1,
        releaseId: 1,
        type: 'bug',
        status: 'todo',
        points: 1,
        title: 'title',
        description: 'description',
      },
    })
  })

  it('should return 200 status and updated issue id', async () => {
    jest.spyOn(prisma.issue, 'update').mockResolvedValue(mockIssue)
    const req = getMockReq({
      params: { id: '1' },
      body: { releaseId: 1, type: 'bug', status: 'todo', points: 1, title: 'title', description: 'description' },
      user: mockUser,
    })
    const { res } = getMockRes()
    await patchIssue(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(1)
  })

  it('should return 500 status when failure', async () => {
    jest.spyOn(prisma.issue, 'update').mockRejectedValue(new Error())
    const req = getMockReq({
      params: { id: '1' },
      body: { releaseId: 1, type: 'bug', status: 'todo', points: 1, title: 'title', description: 'description' },
      user: mockUser,
    })
    const { res } = getMockRes()
    await patchIssue(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(500)
  })
})
