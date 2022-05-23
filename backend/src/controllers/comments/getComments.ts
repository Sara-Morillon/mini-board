import { Request, Response } from 'express'
import { z } from 'zod'
import { start } from '../../libs/logger'
import { prisma } from '../../prisma'

const schema = {
  params: z.object({
    id: z.string().transform(Number),
  }),
}

export async function getComments(req: Request, res: Response): Promise<void> {
  const { success, failure } = start('get_comments', { req })
  try {
    const { id } = schema.params.parse(req.params)
    const comments = await prisma.comment.findMany({
      where: { issueId: id },
      orderBy: { createdAt: 'asc' },
      include: { author: true },
    })
    res.json(comments)
    success()
  } catch (error) {
    res.sendStatus(500)
    failure(error)
  }
}
