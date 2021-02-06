import { Request, Response } from 'express'
import { MoreThan } from 'typeorm'
import { Project } from '../../models/Project'
import { Release } from '../../models/Release'

export async function getProjects(req: Request, res: Response): Promise<void> {
  const projects = await Project.getRepository().find({ order: { name: 'ASC' }, relations: ['releases'] })
  for (const project of projects) {
    const release = await Release.getRepository().findOne({
      order: { dueDate: 'ASC' },
      where: { project, dueDate: MoreThan(new Date().toISOString()) },
    })
    if (release) {
      project.releases = [release]
    }
  }
  res.render('Projects/Projects', { projects, title: 'Projects' })
}
