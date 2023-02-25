import { Axios } from '../../../src/services/Axios'
import { deleteProject, getProject, getProjects, saveProject } from '../../../src/services/project'
import { mockProject } from '../../mocks'

jest.mock('../../../src/services/Axios')

describe('getProjects', () => {
  beforeEach(() => {
    jest.mocked(Axios.get).mockResolvedValue({ data: 'projects' })
  })

  it('should get projects', async () => {
    await getProjects()
    expect(Axios.get).toHaveBeenCalledWith('/api/projects')
  })

  it('should return projects', async () => {
    const result = await getProjects()
    expect(result).toBe('projects')
  })
})

describe('getProject', () => {
  beforeEach(() => {
    jest.mocked(Axios.get).mockResolvedValue({ data: 'project' })
  })

  it('should return null without id', async () => {
    const result = await getProject()
    expect(result).toBeNull()
  })

  it('should get project', async () => {
    await getProject('1')
    expect(Axios.get).toHaveBeenCalledWith('/api/projects/1')
  })

  it('should return project', async () => {
    const result = await getProject('1')
    expect(result).toBe('project')
  })
})

describe('saveProject', () => {
  it('should post project without id', async () => {
    await saveProject(mockProject({ id: 0 }))
    expect(Axios.post).toHaveBeenCalledWith('/api/projects', mockProject({ id: 0 }))
  })

  it('should return created project path', async () => {
    jest.mocked(Axios.post).mockResolvedValue('2')
    const path = await saveProject(mockProject({ id: 0 }))
    expect(path).toBe('/project/2')
  })

  it('should patch project with id', async () => {
    await saveProject(mockProject())
    expect(Axios.patch).toHaveBeenCalledWith('/api/projects/1', mockProject())
  })

  it('should return edited project path', async () => {
    const path = await saveProject(mockProject())
    expect(path).toBe('/project/1')
  })
})

describe('deleteProject', () => {
  it('should delete project', async () => {
    await deleteProject(mockProject())
    expect(Axios.delete).toHaveBeenCalledWith('/api/projects/1')
  })

  it('should return projects path', async () => {
    const path = await deleteProject(mockProject())
    expect(path).toBe('/projects')
  })
})
