import { deleteProject, getProject, getProjects, saveProject } from '../../../src/services/project'
import { request } from '../../../src/services/wrapper'
import { mock, mockProject } from '../../mocks'

jest.mock('../../../src/services/wrapper')

describe('getProjects', () => {
  it('should get projects', async () => {
    await getProjects()
    expect(request).toHaveBeenCalledWith({ url: '/api/projects' }, [])
  })

  it('should return projects', async () => {
    mock(request).mockResolvedValue('projects')
    const result = await getProjects()
    expect(result).toBe('projects')
  })
})

describe('getProject', () => {
  it('should return null without id', async () => {
    const result = await getProject()
    expect(result).toBeNull()
  })

  it('should get project', async () => {
    await getProject('1')
    expect(request).toHaveBeenCalledWith({ url: '/api/projects/1' }, null)
  })

  it('should return project', async () => {
    mock(request).mockResolvedValue('project')
    const result = await getProject('1')
    expect(result).toBe('project')
  })
})

describe('saveProject', () => {
  it('should post project without id', async () => {
    await saveProject(mockProject({ id: 0 }))
    expect(request).toHaveBeenCalledWith({ url: '/api/projects', method: 'POST', data: mockProject({ id: 0 }) }, null)
  })

  it('should patch project with id', async () => {
    await saveProject(mockProject())
    expect(request).toHaveBeenCalledWith({ url: '/api/projects/1', method: 'PATCH', data: mockProject() }, null)
  })

  it('should return project path', async () => {
    mock(request).mockResolvedValue('2')
    const path = await saveProject(mockProject())
    expect(path).toBe('/project/2')
  })
})

describe('deleteProject', () => {
  it('should delete project', async () => {
    await deleteProject(mockProject())
    expect(request).toHaveBeenCalledWith({ url: '/api/projects/1', method: 'DELETE' }, undefined)
  })

  it('should return projects path', async () => {
    const path = await deleteProject(mockProject())
    expect(path).toBe('/projects')
  })
})
