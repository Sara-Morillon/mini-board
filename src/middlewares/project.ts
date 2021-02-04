import { NextFunction, Request, Response } from 'express'
import { Project } from '../models/Project'
import { User } from '../models/User'

export type Locals = {
  user: User
  title: string
  projectId: string
  active: string
}

export function project(active: string) {
  return async function (req: Request<{ projectId: string }>, res: Response, next: NextFunction): Promise<void> {
    const { projectId } = req.params
    const project = await Project.getRepository().findOne(Number(projectId))
    if (!project) {
      return res.render('404')
    }
    res.locals = { ...res.locals, title: project.name, projectId, active }
    return next()
  }
}
