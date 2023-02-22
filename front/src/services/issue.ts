import { IIssue, IIssueFull } from '../models/Issue'
import { request } from './wrapper'

function makeUrl(id?: string | number) {
  return id ? `/api/issues/${id}` : '/api/issues'
}

export function getIssues(
  projectId: number,
  releaseId?: number,
  page?: number,
  limit?: number
): Promise<{ issues: IIssueFull[]; total: number }> {
  return request<{ issues: IIssueFull[]; total: number }>(
    { url: makeUrl(), params: { projectId, releaseId, page, limit } },
    { issues: [], total: 0 }
  )
}

export function getIssue(id?: string): Promise<IIssue | null> {
  if (!id) return Promise.resolve(null)
  return request<IIssue | null>({ url: makeUrl(id) }, null)
}

export async function saveIssue(data: IIssue): Promise<string> {
  const id = await request<string | null>({ url: makeUrl(data.id), method: data.id ? 'PATCH' : 'POST', data }, null)
  return `/project/${data.projectId}/issue/${id}`
}

export async function moveIssue(sourceId: number, targetId: number): Promise<void> {
  await request({ url: makeUrl('move'), method: 'POST', data: { sourceId, targetId } }, undefined)
}

export async function deleteIssue(issue: IIssue): Promise<string> {
  await request({ url: makeUrl(issue.id), method: 'DELETE' }, undefined)
  return `/project/${issue.projectId}/issues`
}
