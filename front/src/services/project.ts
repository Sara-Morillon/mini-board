import { IProject } from '../models/Project'
import { Axios } from './Axios'

export async function getProjects(): Promise<IProject[]> {
  const { data } = await Axios.get<IProject[]>('/api/projects')
  return data
}

export async function getProject(id?: string): Promise<IProject | null> {
  if (!id) return null
  const { data } = await Axios.get<IProject | null>(`/api/projects/${id}`)
  return data
}

export async function saveProject(project: IProject): Promise<string> {
  if (project.id) {
    await Axios.patch(`/api/projects/${project.id}`, project)
    return `/project/${project.id}`
  } else {
    const id = await Axios.post('/api/projects', project)
    return `/project/${id}`
  }
}

export async function deleteProject(project: IProject): Promise<string> {
  await Axios.delete(`/api/projects/${project.id}`)
  return `/projects`
}
