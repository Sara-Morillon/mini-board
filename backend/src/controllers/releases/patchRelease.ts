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
    dueDate: z.string(),
  }),
}

export async function patchRelease(req: Request, res: Response): Promise<void> {
  const { success, failure } = start('put_release', { req })
  try {
    const { id } = schema.params.parse(req.params)
    const { name, dueDate } = schema.body.parse(req.body)
    await prisma.release.update({ where: { id }, data: { name, dueDate } })
    res.status(200).json(id)
    success()
  } catch (error) {
    res.sendStatus(500)
    failure(error)
  }
}
