import { getMockRes } from '@jest-mock/express'
import { deleteIssue, getIssue, getIssues, moveIssues, patchIssue, postIssue } from '../../../src/controllers/issues'
import { prisma } from '../../../src/prisma'
import { getMockReq, mockIssue, mockUser } from '../../mocks'

describe('getIssues', () => {
  it('should get issues', async () => {
    jest.spyOn(prisma.issue, 'findMany').mockResolvedValue([mockIssue])
    jest.spyOn(prisma.issue, 'count').mockResolvedValue(1)
    const req = getMockReq({ query: { projectId: '1', releaseId: '1', page: '2', limit: '10' } })
    const { res } = getMockRes()
    await getIssues(req, res)
    expect(prisma.issue.findMany).toHaveBeenCalledWith({
      where: { projectId: 1, releaseId: 1 },
      orderBy: [{ release: { dueDate: 'desc' } }, { priority: 'asc' }],
      include: { author: true, project: true, release: true },
      take: 10,
      skip: 10,
    })
  })

  it('should count issues', async () => {
    jest.spyOn(prisma.issue, 'findMany').mockResolvedValue([mockIssue])
    jest.spyOn(prisma.issue, 'count').mockResolvedValue(1)
    const req = getMockReq({ query: { projectId: '1', releaseId: '1', page: '2', limit: '10' } })
    const { res } = getMockRes()
    await getIssues(req, res)
    expect(prisma.issue.count).toHaveBeenCalledWith({ where: { projectId: 1, releaseId: 1 } })
  })

  it('should return issues', async () => {
    jest.spyOn(prisma.issue, 'findMany').mockResolvedValue([mockIssue])
    jest.spyOn(prisma.issue, 'count').mockResolvedValue(1)
    const req = getMockReq({ query: { projectId: '1', releaseId: '1', page: '2', limit: '10' } })
    const { res } = getMockRes()
    await getIssues(req, res)
    expect(res.json).toHaveBeenCalledWith({ issues: [mockIssue], total: 1 })
  })

  it('should return 500 status when failure', async () => {
    jest.spyOn(prisma.issue, 'findMany').mockRejectedValue(new Error())
    const req = getMockReq({ query: { projectId: '1', releaseId: '1', page: '2', limit: '10' } })
    const { res } = getMockRes()
    await getIssues(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(500)
  })
})

describe('postIssue', () => {
  it('should create issue with max priority', async () => {
    jest.spyOn(prisma.issue, 'create').mockResolvedValue(mockIssue)
    jest.spyOn(prisma.issue, 'aggregate').mockResolvedValue({ _max: { priority: 7 } } as never)
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
        priority: 8,
        type: 'bug',
        status: 'todo',
        points: 1,
        title: 'title',
        description: 'description',
      },
    })
  })

  it('should create issue with default 0 priority', async () => {
    jest.spyOn(prisma.issue, 'create').mockResolvedValue(mockIssue)
    jest.spyOn(prisma.issue, 'aggregate').mockResolvedValue({ _max: { priority: null } } as never)
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

describe('getIssue', () => {
  it('should get issue', async () => {
    jest.spyOn(prisma.issue, 'findUnique').mockResolvedValue(mockIssue)
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await getIssue(req, res)
    expect(prisma.issue.findUnique).toHaveBeenCalledWith({ where: { id: 1 } })
  })

  it('should return issue', async () => {
    jest.spyOn(prisma.issue, 'findUnique').mockResolvedValue(mockIssue)
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await getIssue(req, res)
    expect(res.json).toHaveBeenCalledWith(mockIssue)
  })

  it('should return 500 status when failure', async () => {
    jest.spyOn(prisma.issue, 'findUnique').mockRejectedValue(new Error())
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await getIssue(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(500)
  })
})

describe('patchIssue', () => {
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

describe('deleteIssue', () => {
  it('should delete issue', async () => {
    jest.spyOn(prisma.issue, 'delete').mockResolvedValue(mockIssue)
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await deleteIssue(req, res)
    expect(prisma.issue.delete).toHaveBeenCalledWith({ where: { id: 1 } })
  })

  it('should return 204 status', async () => {
    jest.spyOn(prisma.issue, 'delete').mockResolvedValue(mockIssue)
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await deleteIssue(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(204)
  })

  it('should return 500 status when failure', async () => {
    jest.spyOn(prisma.issue, 'delete').mockRejectedValue(new Error())
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await deleteIssue(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(500)
  })
})

describe('moveIssue', () => {
  beforeEach(() => {
    jest.spyOn(prisma.issue, 'findUnique').mockResolvedValue(null)
    jest.spyOn(prisma.issue, 'findMany').mockResolvedValue([])
    jest.spyOn(prisma.issue, 'update').mockResolvedValue(mockIssue)
  })

  it('should get source issue', async () => {
    const req = getMockReq({ body: { sourceId: 1, targetId: 2 } })
    const { res } = getMockRes()
    await moveIssues(req, res)
    expect(prisma.issue.findUnique).toHaveBeenCalledWith({ where: { id: 1 } })
  })

  it('should get target issue', async () => {
    const req = getMockReq({ body: { sourceId: 1, targetId: 2 } })
    const { res } = getMockRes()
    await moveIssues(req, res)
    expect(prisma.issue.findUnique).toHaveBeenCalledWith({ where: { id: 2 } })
  })

  it('should do nothing if source issue is not found', async () => {
    const req = getMockReq({ body: { sourceId: 1, targetId: 2 } })
    const { res } = getMockRes()
    await moveIssues(req, res)
    expect(prisma.issue.update).not.toHaveBeenCalled()
  })

  it('should do nothing if target issue is not found', async () => {
    jest.spyOn(prisma.issue, 'findUnique').mockResolvedValueOnce(mockIssue)
    const req = getMockReq({ body: { sourceId: 1, targetId: 2 } })
    const { res } = getMockRes()
    await moveIssues(req, res)
    expect(prisma.issue.update).not.toHaveBeenCalled()
  })

  it('should save all issues with updated release and priority', async () => {
    const issues = [
      mockIssue,
      { ...mockIssue, id: 2, releaseId: 1, priority: 1 },
      { ...mockIssue, id: 3, releaseId: 2 },
      { ...mockIssue, id: 4, releaseId: 2, priority: 1 },
    ]
    jest.spyOn(prisma.issue, 'findUnique').mockResolvedValueOnce(issues[0])
    jest.spyOn(prisma.issue, 'findUnique').mockResolvedValueOnce(issues[2])
    jest.spyOn(prisma.issue, 'findMany').mockResolvedValueOnce(issues)
    const req = getMockReq({ body: { sourceId: 1, targetId: 3 } })
    const { res } = getMockRes()
    await moveIssues(req, res)
    expect(prisma.issue.update).toHaveBeenCalledWith({ where: { id: 1 }, data: { priority: 1, releaseId: 2 } })
    expect(prisma.issue.update).toHaveBeenCalledWith({ where: { id: 2 }, data: { priority: 0, releaseId: 1 } })
    expect(prisma.issue.update).toHaveBeenCalledWith({ where: { id: 3 }, data: { priority: 0, releaseId: 2 } })
    expect(prisma.issue.update).toHaveBeenCalledWith({ where: { id: 4 }, data: { priority: 2, releaseId: 2 } })
  })

  it('should return 204 status', async () => {
    const req = getMockReq({ body: { sourceId: 1, targetId: 2 } })
    const { res } = getMockRes()
    await moveIssues(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(204)
  })

  it('should return 500 status when failure', async () => {
    jest.spyOn(prisma.issue, 'findUnique').mockRejectedValue(new Error())
    const req = getMockReq({ body: { sourceId: 1, targetId: 2 } })
    const { res } = getMockRes()
    await moveIssues(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(500)
  })
})
