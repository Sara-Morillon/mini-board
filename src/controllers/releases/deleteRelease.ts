import { Request, Response } from 'express'
import { Release } from '../../models/Release'

export type Req = Request<{ projectId: string; id: string }>

export async function deleteRelease(req: Req, res: Response): Promise<void> {
  const { id, projectId } = req.params
  await Release.getRepository().delete(id)
  res.redirect(`/project/${projectId}/releases/list`)
}
