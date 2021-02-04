import { Request, Response } from 'express'
import { Project } from '../../models/Project'

export async function getProjects(req: Request, res: Response): Promise<void> {
  const projects = await Project.getRepository().find({ order: { name: 'ASC' } })
  res.render('Projects/Projects', { projects, title: 'Projects' })
}
