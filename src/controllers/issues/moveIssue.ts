import { Request, Response } from 'express'
import { Between } from 'typeorm'
import { Issue, Status } from '../../models/Issue'

export type Req = Request<{ id: string }, unknown, { status?: Status; priority: number; release: number }>

export async function moveIssue(req: Req, res: Response): Promise<void> {
  const { id } = req.params
  const { status, priority, release } = req.body

  const issue = await Issue.getRepository().findOne(id, { relations: ['release'] })
  if (issue) {
    const translate = issue.priority < priority ? 'priority - 1' : 'priority + 1'
    const minPriority = Math.min(issue.priority, priority)
    const maxPriority = Math.max(issue.priority, priority)
    await Issue.getRepository().update(
      { release: { id: release }, priority: Between(minPriority, maxPriority) },
      { priority: () => translate }
    )
    await Issue.getRepository().update(id, {
      ...(status && { status }),
      priority,
      release: { id: release },
    })
  }

  res.sendStatus(204)
}
