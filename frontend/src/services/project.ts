import { IProject } from '../models/Project'
import { request } from './wrapper'

function makeUrl(id?: string | number) {
  return id ? `/api/projects/${id}` : '/api/projects'
}

export async function getProjects(): Promise<IProject[]> {
  return request<IProject[]>({ url: makeUrl() }, [])
}

export async function getProject(id?: string | number): Promise<IProject | null> {
  if (!id) return null
  return request<IProject | null>({ url: makeUrl(id) }, null)
}

export async function saveProject(data: IProject): Promise<string> {
  const id = await request<string | null>({ url: makeUrl(data.id), method: data.id ? 'PATCH' : 'POST', data }, null)
  return `/project/${id}`
}

export async function deleteProject(project: IProject): Promise<string> {
  await request({ url: makeUrl(project.id), method: 'DELETE' }, undefined)
  return '/projects'
}
