import { Request, Response } from 'express'
import { Between } from 'typeorm'
import { Issue, Status } from '../../models/Issue'

export async function updatePriority(id: string, priority: number): Promise<void> {
  const issue = await Issue.getRepository().findOne(id, { relations: ['release'] })
  if (issue) {
    const translate = issue.priority < priority ? 'priority - 1' : 'priority + 1'
    const minPriority = Math.min(issue.priority, priority)
    const maxPriority = Math.max(issue.priority, priority)
    await Issue.getRepository().update(
      { release: issue.release, priority: Between(minPriority, maxPriority) },
      { priority: () => translate }
    )
    await Issue.getRepository().update(id, { priority })
  }
}

export type Req = Request<{ id: string }, unknown, { status: Status; priority: number }>

export async function moveIssue(req: Req, res: Response): Promise<void> {
  const { id } = req.params
  const { status, priority } = req.body
  await updatePriority(id, priority)
  await Issue.getRepository().update(id, { status })
  res.sendStatus(204)
}
