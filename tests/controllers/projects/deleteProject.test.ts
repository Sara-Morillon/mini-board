import { getMockReq, getMockRes } from '@jest-mock/express'
import { deleteProject, Req } from '../../../src/controllers/projects/deleteProject'
import { Project } from '../../../src/models/Project'
import { mockRepository, RepoMock } from '../../mocks/repository'

jest.mock('../../../src/models/Project')

describe('deleteProject', () => {
  const req = getMockReq<Req>({ params: { id: 'id' } })
  const { res, clearMockRes } = getMockRes()

  let projectMock: RepoMock<Project>

  beforeEach(() => {
    clearMockRes()

    projectMock = mockRepository(Project.getRepository as jest.Mock)
    projectMock.delete.mockResolvedValue(undefined)
  })

  it('should delete project', async () => {
    await deleteProject(req, res)
    expect(projectMock.delete).toHaveBeenCalledWith('id')
  })

  it('should redirect to projects page', async () => {
    await deleteProject(req, res)
    expect(res.redirect).toHaveBeenCalledWith('/projects/list')
  })
})
