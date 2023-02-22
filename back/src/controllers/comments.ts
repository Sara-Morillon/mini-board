import { Request, Response } from 'express'
import { z } from 'zod'
import { start } from '../libs/logger'
import { prisma } from '../prisma'

const schema = {
  get: z.object({
    id: z.string().transform(Number),
  }),
  post: z.object({
    content: z.string(),
  }),
}

export async function getComments(req: Request, res: Response): Promise<void> {
  const { success, failure } = start('get_comments', { req })
  try {
    const { id } = schema.get.parse(req.params)
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

export async function postComment(req: Request, res: Response): Promise<void> {
  const { success, failure } = start('post_comment', { req })
  try {
    if (!req.user) {
      res.sendStatus(401)
    } else {
      const { id } = schema.get.parse(req.params)
      const { content } = schema.post.parse(req.body)
      const comment = await prisma.comment.create({ data: { authorId: req.user.id, issueId: id, content } })
      res.status(201).json(comment.id)
    }
    success()
  } catch (error) {
    res.sendStatus(500)
    failure(error)
  }
}

export async function deleteComment(req: Request, res: Response): Promise<void> {
  const { success, failure } = start('delete_comment', { req })
  try {
    const { id } = schema.get.parse(req.params)
    await prisma.comment.delete({ where: { id } })
    res.sendStatus(204)
    success()
  } catch (error) {
    res.sendStatus(500)
    failure(error)
  }
}
