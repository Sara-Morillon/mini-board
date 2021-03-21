import { Req, saveProject } from '@/controllers/projects/saveProject'
import { Project } from '@/models/Project'
import { User } from '@/models/User'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { mockRepository, RepoMock } from '../../mocks/repository'

jest.mock('@/models/Project')

describe('saveProject', () => {
  const body = { key: 'key', name: 'name', description: 'description' }
  const req = getMockReq<Req>({ params: { id: '8' }, body })
  const { res, clearMockRes } = getMockRes()

  let projectMock: RepoMock<Project>

  beforeEach(() => {
    clearMockRes()

    projectMock = mockRepository(Project.getRepository as jest.Mock)
    projectMock.update.mockResolvedValue(undefined)
    projectMock.save.mockResolvedValue({ id: 'id' })
  })

  it('should update project if id is present', async () => {
    await saveProject(req, res)
    expect(projectMock.update).toHaveBeenCalledWith('8', {
      key: 'key',
      name: 'name',
      description: 'description',
    })
  })

  it('should save project if id is not present', async () => {
    const req = getMockReq<Req>({ params: { projectId: '4' }, body })
    req.user = { id: 2 } as User
    await saveProject(req, res)
    expect(projectMock.save).toHaveBeenCalledWith({
      key: 'key',
      name: 'name',
      description: 'description',
    })
  })

  it('should redirect to project page', async () => {
    await saveProject(req, res)
    expect(res.redirect).toHaveBeenCalledWith('/projects/list')
  })
})
