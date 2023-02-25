import { IComment } from '../models/Comment'
import { Axios } from './Axios'

export async function getComments(issueId: number): Promise<IComment[]> {
  const { data } = await Axios.get<IComment[]>(`/api/issues/${issueId}/comments`)
  return data
}

export async function saveComment(issueId: number, content: string): Promise<void> {
  await Axios.post(`/api/issues/${issueId}/comments`, { content })
}

export async function deleteComment(attachment: IComment): Promise<void> {
  await Axios.delete(`/api/comments/${attachment.id}`)
}
