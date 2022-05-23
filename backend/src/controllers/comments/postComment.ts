import { Request, Response } from 'express'
import { z } from 'zod'
import { start } from '../../libs/logger'
import { prisma } from '../../prisma'

const schema = {
  params: z.object({
    id: z.string().transform(Number),
  }),
  body: z.object({
    content: z.string(),
  }),
}

export async function postComment(req: Request, res: Response): Promise<void> {
  const { success, failure } = start('post_comment', { req })
  try {
    if (!req.user) {
      res.sendStatus(401)
    } else {
      const { id } = schema.params.parse(req.params)
      const { content } = schema.body.parse(req.body)
      const comment = await prisma.comment.create({ data: { authorId: req.user.id, issueId: id, content } })
      res.status(201).json(comment.id)
    }
    success()
  } catch (error) {
    res.sendStatus(500)
    failure(error)
  }
}
