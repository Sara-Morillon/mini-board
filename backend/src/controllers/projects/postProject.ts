import { Request, Response } from 'express'
import { z } from 'zod'
import { start } from '../../libs/logger'
import { prisma } from '../../prisma'

const schema = {
  body: z.object({
    key: z.string(),
    name: z.string(),
    description: z.string(),
  }),
}

export async function postProject(req: Request, res: Response): Promise<void> {
  const { success, failure } = start('post_project', { req })
  try {
    const { key, name, description } = schema.body.parse(req.body)
    const project = await prisma.project.create({ data: { key, name, description } })
    res.status(201).json(project.id)
    success()
  } catch (error) {
    res.sendStatus(500)
    failure(error)
  }
}
