import { Request, Response } from 'express'
import { MoreThan } from 'typeorm'
import { Issue } from '../../models/Issue'
import { Release } from '../../models/Release'

export type Req = Request<{ projectId: string }>

export async function getBoard(req: Req, res: Response): Promise<void> {
  const { projectId } = req.params
  const release = await Release.getRepository().findOne({
    where: { project: { id: projectId }, dueDate: MoreThan(new Date().toISOString()) },
    order: { dueDate: 'ASC' },
  })
  const issues = await Issue.getRepository().find({
    where: { project: { id: projectId }, release },
    order: { priority: 'ASC' },
  })
  res.render('Board/Board', { release, issues })
}
