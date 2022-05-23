import { Request, Response } from 'express'
import { z } from 'zod'
import { start } from '../../libs/logger'
import { prisma } from '../../prisma'

const schema = {
  body: z.object({
    projectId: z.number(),
    name: z.string(),
    dueDate: z.string(),
  }),
}

export async function postRelease(req: Request, res: Response): Promise<void> {
  const { success, failure } = start('post_release', { req })
  try {
    const { projectId, name, dueDate } = schema.body.parse(req.body)
    const release = await prisma.release.create({ data: { projectId, name, dueDate } })
    res.status(201).json(release.id)
    success()
  } catch (error) {
    res.sendStatus(500)
    failure(error)
  }
}
