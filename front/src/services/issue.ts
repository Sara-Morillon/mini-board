import { IIssue, IIssueFull } from '../models/Issue'
import { Axios } from './Axios'

export async function getIssues(
  projectId: number,
  releaseId?: number,
  page?: number,
  limit?: number
): Promise<{ issues: IIssueFull[]; total: number }> {
  const { data } = await Axios.get<{ issues: IIssueFull[]; total: number }>('/api/issues', {
    params: { projectId, releaseId, page, limit },
  })
  return data
}

export async function getIssue(id?: string): Promise<IIssue | null> {
  if (!id) return null
  const { data } = await Axios.get<IIssue | null>(`/api/issues/${id}`)
  return data
}

export async function saveIssue(issue: IIssue): Promise<string> {
  if (issue.id) {
    await Axios.patch(`/api/issues/${issue.id}`, issue)
    return `/project/${issue.projectId}/issue/${issue.id}`
  } else {
    const id = await Axios.post('/api/issues', issue)
    return `/project/${issue.projectId}/issue/${id}`
  }
}

export async function moveIssue(sourceId: number, targetId: number): Promise<void> {
  await Axios.post('/api/issues/move', { sourceId, targetId })
}

export async function deleteIssue(issue: IIssue): Promise<string> {
  await Axios.delete(`/api/issues/${issue.id}`)
  return `/project/${issue.projectId}/issues`
}
