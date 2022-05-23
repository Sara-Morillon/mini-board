import { Request, Response } from 'express'
import { z } from 'zod'
import { start } from '../../libs/logger'
import { prisma } from '../../prisma'

const schema = {
  params: z.object({
    id: z.string().transform(Number),
  }),
}

export async function deleteRelease(req: Request, res: Response): Promise<void> {
  const { success, failure } = start('delete_release', { req })
  try {
    const { id } = schema.params.parse(req.params)
    await prisma.release.delete({ where: { id } })
    res.sendStatus(204)
    success()
  } catch (error) {
    res.sendStatus(500)
    failure(error)
  }
}
