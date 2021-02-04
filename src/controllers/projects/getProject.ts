import { Request, Response } from 'express'
import { Project } from '../../models/Project'

export type Req = Request<{ id: string }>

export async function getProject(req: Req, res: Response): Promise<void> {
  const { id } = req.params
  if (id) {
    await editProject(req, res)
  } else {
    await addProject(req, res)
  }
}

export async function addProject(req: Request, res: Response): Promise<void> {
  res.render('Projects/Project', { title: 'Add project' })
}

export async function editProject(req: Req, res: Response): Promise<void> {
  const { id } = req.params
  const project = await Project.getRepository().findOne(id)
  if (!project) {
    return res.render('404')
  }
  res.render('Projects/Project', { project, title: project.name })
}
