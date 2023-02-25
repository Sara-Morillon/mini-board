import { IRelease } from '../models/Release'
import { Axios } from './Axios'

export async function getReleases(projectId: number): Promise<IRelease[]> {
  const { data } = await Axios.get<IRelease[]>('/api/releases', { params: { projectId } })
  return data
}

export async function getRelease(id?: string): Promise<IRelease | null> {
  if (!id) return null
  const { data } = await Axios.get<IRelease | null>(`/api/releases/${id}`)
  return data
}

export async function saveRelease(release: IRelease): Promise<string> {
  if (release.id) {
    await Axios.patch(`/api/releases/${release.id}`, release)
  } else {
    await Axios.post('/api/releases', release)
  }
  return `/project/${release.projectId}/releases`
}

export async function deleteRelease(release: IRelease): Promise<string> {
  await Axios.delete(`/api/releases/${release.id}`)
  return `/project/${release.projectId}/releases`
}
