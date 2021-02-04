import { getMockReq, getMockRes } from '@jest-mock/express'
import { getProjects } from '../../../src/controllers/projects/getProjects'
import { Project } from '../../../src/models/Project'
import { mockRepository, RepoMock } from '../../mocks/repository'

jest.mock('../../../src/models/Project')

describe('getProjects', () => {
  const req = getMockReq()
  const { res, clearMockRes } = getMockRes()

  let projectMock: RepoMock<Project>

  beforeEach(() => {
    clearMockRes()

    projectMock = mockRepository(Project.getRepository as jest.Mock)
    projectMock.find.mockResolvedValue('projects')
  })

  it('should get projects', async () => {
    await getProjects(req, res)
    expect(projectMock.find).toHaveBeenCalledWith({ order: { name: 'ASC' } })
  })

  it('should render projects page with projects', async () => {
    await getProjects(req, res)
    expect(res.render).toHaveBeenCalledWith('Projects/Projects', { projects: 'projects', title: 'Projects' })
  })
})
