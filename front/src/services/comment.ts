import { IComment } from '../models/Comment'
import { request } from './wrapper'

function makeUrl(issueId: number) {
  return `/api/issues/${issueId}/comments`
}

export function getComments(issueId: number): Promise<IComment[]> {
  return request<IComment[]>({ url: makeUrl(issueId) }, [])
}

export async function saveComment(issueId: number, content: string): Promise<void> {
  await request<string | null>({ url: makeUrl(issueId), method: 'POST', data: { content } }, null)
}

export async function deleteComment(comment: IComment): Promise<void> {
  await request({ url: `/api/comments/${comment.id}`, method: 'DELETE' }, undefined)
}
