import { IRelease } from '../models/Release'
import { request } from './wrapper'

function makeUrl(id?: string | number) {
  return id ? `/api/releases/${id}` : '/api/releases'
}

export function getReleases(projectId: number): Promise<IRelease[]> {
  return request<IRelease[]>({ url: makeUrl(), params: { projectId } }, [])
}

export function getRelease(id?: string): Promise<IRelease | null> {
  if (!id) return Promise.resolve(null)
  return request<IRelease | null>({ url: makeUrl(id) }, null)
}

export async function saveRelease(data: IRelease): Promise<string> {
  await request<string | null>({ url: makeUrl(data.id), method: data.id ? 'PATCH' : 'POST', data: data }, null)
  return `/project/${data.projectId}/releases`
}

export async function deleteRelease(release: IRelease): Promise<string> {
  await request({ url: makeUrl(release.id), method: 'DELETE' }, undefined)
  return `/project/${release.projectId}/releases`
}
