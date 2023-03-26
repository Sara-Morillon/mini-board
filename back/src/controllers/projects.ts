import { Request, Response } from 'express'
import { z } from 'zod'
import { prisma } from '../prisma'
import { parseError } from '../utils/parseError'

const schema = {
  get: z.object({
    id: z.string().transform(Number),
  }),
  post: z.object({
    key: z.string(),
    name: z.string(),
    description: z.string(),
  }),
  patch: z.object({
    name: z.string(),
    description: z.string(),
  }),
}

export async function getProjects(req: Request, res: Response): Promise<void> {
  const { success, failure } = req.logger.start('get_projects')
  try {
    const projects = await prisma.project.findMany({ orderBy: { updatedAt: 'desc' } })
    res.json(projects)
    success()
  } catch (error) {
    res.sendStatus(500)
    failure(parseError(error))
  }
}

export async function postProject(req: Request, res: Response): Promise<void> {
  const { success, failure } = req.logger.start('post_project')
  try {
    const { key, name, description } = schema.post.parse(req.body)
    const project = await prisma.project.create({ data: { key, name, description } })
    res.status(201).json(project.id)
    success()
  } catch (error) {
    res.sendStatus(500)
    failure(parseError(error))
  }
}

export async function getProject(req: Request, res: Response): Promise<void> {
  const { success, failure } = req.logger.start('get_project')
  try {
    const { id } = schema.get.parse(req.params)
    const project = await prisma.project.findUnique({ where: { id } })
    res.json(project)
    success()
  } catch (error) {
    res.sendStatus(500)
    failure(parseError(error))
  }
}

export async function patchProject(req: Request, res: Response): Promise<void> {
  const { success, failure } = req.logger.start('put_project')
  try {
    const { id } = schema.get.parse(req.params)
    const { name, description } = schema.patch.parse(req.body)
    await prisma.project.update({ where: { id }, data: { name, description } })
    res.status(200).json(id)
    success()
  } catch (error) {
    res.sendStatus(500)
    failure(parseError(error))
  }
}

export async function deleteProject(req: Request, res: Response): Promise<void> {
  const { success, failure } = req.logger.start('delete_project')
  try {
    const { id } = schema.get.parse(req.params)
    await prisma.project.delete({ where: { id } })
    res.sendStatus(204)
    success()
  } catch (error) {
    res.sendStatus(500)
    failure(parseError(error))
  }
}
