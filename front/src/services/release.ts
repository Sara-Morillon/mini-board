import { IRelease } from '../models/Release'
import { Axios } from './Axios'

export async function getReleases(): Promise<IRelease[]> {
  const { data } = await Axios.get<IRelease[]>('/api/releases')
  return data
}

export async function getRelease(id?: string): Promise<IRelease | null> {
  if (!id) return { id: 0, name: '', dueDate: new Date().toISOString() }
  const { data } = await Axios.get<IRelease | null>(`/api/releases/${id}`)
  return data
}

export async function saveRelease(release: IRelease): Promise<string> {
  if (release.id) {
    await Axios.patch(`/api/releases/${release.id}`, release)
  } else {
    await Axios.post('/api/releases', release)
  }
  return `/releases`
}

export async function deleteRelease(release: IRelease): Promise<string> {
  await Axios.delete(`/api/releases/${release.id}`)
  return `/releases`
}
