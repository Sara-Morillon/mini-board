import { getProject, Req } from '@/controllers/projects/getProject'
import { Project } from '@/models/Project'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { mockRepository, RepoMock } from '../../mocks/repository'

jest.mock('@/models/Project')

describe('getProject', () => {
  const req = getMockReq<Req>({ params: { projectId: 'projectId', id: 'id' } })
  const { res, clearMockRes } = getMockRes()

  let projectMock: RepoMock<Project>

  beforeEach(() => {
    clearMockRes()

    projectMock = mockRepository(Project.getRepository as jest.Mock)
    projectMock.findOne.mockResolvedValue({ name: 'project' })
  })

  it('should get project', async () => {
    await getProject(req, res)
    expect(projectMock.findOne).toHaveBeenCalledWith('id')
  })

  it('should render 404 page if project is missing', async () => {
    projectMock.findOne.mockResolvedValue(undefined)
    await getProject(req, res)
    expect(res.render).toHaveBeenCalledWith('404')
  })

  it('should render project page', async () => {
    await getProject(req, res)
    expect(res.render).toHaveBeenCalledWith('Projects/Project', { project: { name: 'project' }, title: 'project' })
  })

  it('should render project page if id is not present', async () => {
    const req = getMockReq<Req>({ params: { projectId: 'projectId' } })
    await getProject(req, res)
    expect(res.render).toHaveBeenCalledWith('Projects/Project', { title: 'Add project' })
  })
})
