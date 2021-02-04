import { Request, Response } from 'express'
import { Comment } from '../../models/Comment'

export type Req = Request<{ projectId: string }, unknown, { content: string }, { issueId: string }>

export async function saveComment(req: Req, res: Response): Promise<void> {
  const { projectId } = req.params
  const { issueId } = req.query
  const { content } = req.body
  const author = { id: req.user?.id }
  await Comment.getRepository().save({ content, author, issue: { id: Number(issueId) } })
  res.redirect(`/project/${projectId}/issues/edit/${issueId}`)
}
