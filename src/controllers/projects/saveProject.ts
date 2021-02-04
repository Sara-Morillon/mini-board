import { Request, Response } from 'express'
import { Project } from '../../models/Project'

export type Req = Request<{ id: string }, unknown, { name: string; description?: string }>

export async function saveProject(req: Req, res: Response): Promise<void> {
  const { id } = req.params
  if (id) {
    await updateProject(req, res)
  } else {
    await createProject(req, res)
  }
}

async function updateProject(req: Req, res: Response): Promise<void> {
  const { id } = req.params
  const { name, description } = req.body
  await Project.getRepository().update(id, { name, description })
  res.redirect('/projects/list')
}

async function createProject(req: Req, res: Response): Promise<void> {
  const { name, description } = req.body
  await Project.getRepository().save({ name, description })
  res.redirect('/projects/list')
}
