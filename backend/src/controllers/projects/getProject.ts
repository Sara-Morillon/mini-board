import { Request, Response } from 'express'
import { z } from 'zod'
import { start } from '../../libs/logger'
import { prisma } from '../../prisma'

const schema = {
  params: z.object({
    id: z.string().transform(Number),
  }),
}

export async function getProject(req: Request, res: Response): Promise<void> {
  const { success, failure } = start('get_project', { req })
  try {
    const { id } = schema.params.parse(req.params)
    const project = await prisma.project.findUnique({ where: { id } })
    res.json(project)
    success()
  } catch (error) {
    res.sendStatus(500)
    failure(error)
  }
}
