import { Request, Response } from 'express'
import { MoreThan } from 'typeorm'
import { Release } from '../../models/Release'

export type Req = Request<{ projectId: string }, unknown, unknown, { all: string }>

export async function getIssues(req: Req, res: Response): Promise<void> {
  const { projectId } = req.params
  const { all } = req.query
  const releases = await Release.getRepository().find({
    where: { project: { id: projectId }, ...(all !== 'true' && { dueDate: MoreThan(new Date().toISOString()) }) },
    order: { dueDate: 'ASC' },
    relations: ['issues', 'issues.author', 'issues.project'],
  })
  for (const release of releases) {
    release.issues.sort((i1, i2) => i1.priority - i2.priority)
  }
  res.render('Issues/Issues', { all, releases })
}
