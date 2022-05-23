import { Request, Response } from 'express'
import { z } from 'zod'
import { start } from '../../libs/logger'
import { prisma } from '../../prisma'

const schema = {
  params: z.object({
    id: z.string().transform(Number),
  }),
  body: z.object({
    name: z.string(),
    description: z.string(),
  }),
}

export async function patchProject(req: Request, res: Response): Promise<void> {
  const { success, failure } = start('put_project', { req })
  try {
    const { id } = schema.params.parse(req.params)
    const { name, description } = schema.body.parse(req.body)
    await prisma.project.update({ where: { id }, data: { name, description } })
    res.status(200).json(id)
    success()
  } catch (error) {
    res.sendStatus(500)
    failure(error)
  }
}
