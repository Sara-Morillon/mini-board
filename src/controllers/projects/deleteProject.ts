import { Request, Response } from 'express'
import { Project } from '../../models/Project'

export type Req = Request<{ id: string }>

export async function deleteProject(req: Req, res: Response): Promise<void> {
  const { id } = req.params
  await Project.getRepository().delete(id)
  res.redirect('/projects/list')
}
