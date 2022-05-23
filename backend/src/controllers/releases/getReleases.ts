import { Request, Response } from 'express'
import { z } from 'zod'
import { start } from '../../libs/logger'
import { prisma } from '../../prisma'

const schema = {
  query: z.object({
    projectId: z.string().transform(Number),
  }),
}

export async function getReleases(req: Request, res: Response): Promise<void> {
  const { success, failure } = start('get_releases', { req })
  try {
    const { projectId } = schema.query.parse(req.query)
    const releases = await prisma.release.findMany({
      where: { projectId },
      orderBy: { dueDate: 'desc' },
    })
    res.json(releases)
    success()
  } catch (error) {
    res.sendStatus(500)
    failure(error)
  }
}
