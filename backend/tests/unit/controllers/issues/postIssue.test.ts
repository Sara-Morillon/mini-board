import { getMockReq, getMockRes } from '@jest-mock/express'
import { postIssue } from '../../../../src/controllers/issues/postIssue'
import { prisma } from '../../../../src/prisma'
import { mockIssue, mockUser } from '../../../mocks'

describe('postIssue', () => {
  it('should return 401 status if no user', async () => {
    const req = getMockReq({
      body: { projectId: 1, releaseId: 1, type: 'bug', points: 1, title: 'title', description: 'description' },
    })
    const { res } = getMockRes()
    await postIssue(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(401)
  })

  it('should create issue', async () => {
    jest.spyOn(prisma.issue, 'create').mockResolvedValue(mockIssue)
    const req = getMockReq({
      body: { projectId: 1, releaseId: 1, type: 'bug', points: 1, title: 'title', description: 'description' },
      user: mockUser,
    })
    const { res } = getMockRes()
    await postIssue(req, res)
    expect(prisma.issue.create).toHaveBeenCalledWith({
      data: {
        authorId: 1,
        projectId: 1,
        releaseId: 1,
        priority: 0,
        type: 'bug',
        status: 'todo',
        points: 1,
        title: 'title',
        description: 'description',
      },
    })
  })

  it('should return 201 status and created issue id', async () => {
    jest.spyOn(prisma.issue, 'create').mockResolvedValue(mockIssue)
    const req = getMockReq({
      body: { projectId: 1, releaseId: 1, type: 'bug', points: 1, title: 'title', description: 'description' },
      user: mockUser,
    })
    const { res } = getMockRes()
    await postIssue(req, res)
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith(1)
  })

  it('should return 500 status when failure', async () => {
    jest.spyOn(prisma.issue, 'create').mockRejectedValue(new Error())
    const req = getMockReq({
      body: { projectId: 1, releaseId: 1, type: 'bug', points: 1, title: 'title', description: 'description' },
      user: mockUser,
    })
    const { res } = getMockRes()
    await postIssue(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(500)
  })
})
