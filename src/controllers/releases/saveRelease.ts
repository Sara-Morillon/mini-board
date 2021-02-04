import { Request, Response } from 'express'
import { Release } from '../../models/Release'

export type Req = Request<{ projectId: string; id: string }, unknown, { name: string; dueDate: string }>

export async function saveRelease(req: Req, res: Response): Promise<void> {
  const { id, projectId } = req.params
  const { name, dueDate } = req.body
  if (id) {
    await Release.getRepository().update(id, { name, dueDate: new Date(dueDate + 'T00:00:00.000Z') })
  } else {
    await Release.getRepository().save({
      project: { id: Number(projectId) },
      name,
      dueDate: new Date(dueDate + 'T00:00:00.000Z'),
    })
  }
  res.redirect(`/project/${projectId}/releases/list`)
}
