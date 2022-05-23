import { Request, Response } from 'express'
import { start } from '../../libs/logger'
import { prisma } from '../../prisma'

export async function getProjects(req: Request, res: Response): Promise<void> {
  const { success, failure } = start('get_projects', { req })
  try {
    const projects = await prisma.project.findMany({ orderBy: { updatedAt: 'desc' } })
    res.json(projects)
    success()
  } catch (error) {
    res.sendStatus(500)
    failure(error)
  }
}
