import { Request, Response } from 'express'
import { Release } from '../../models/Release'

export type Req = Request<{ projectId: string }>

export async function getReleases(req: Req, res: Response): Promise<void> {
  const { projectId } = req.params
  const releases = await Release.getRepository().find({
    where: { project: { id: projectId } },
    order: { dueDate: 'ASC' },
    relations: ['issues'],
  })
  res.render('Releases/Releases', { releases })
}
