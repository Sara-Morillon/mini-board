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
    relations: ['issues', 'issues.author'],
  })
  res.render('Issues/Issues', { all, releases })
}
