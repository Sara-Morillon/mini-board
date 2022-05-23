import { Status, Type } from '@prisma/client'
import { Request, Response } from 'express'
import { z } from 'zod'
import { start } from '../../libs/logger'
import { prisma } from '../../prisma'

const schema = {
  params: z.object({
    id: z.string().transform(Number),
  }),
  body: z.object({
    releaseId: z.number(),
    type: z.nativeEnum(Type),
    status: z.nativeEnum(Status),
    points: z.number(),
    title: z.string(),
    description: z.string(),
  }),
}

export async function patchIssue(req: Request, res: Response): Promise<void> {
  const { success, failure } = start('put_issue', { req })
  try {
    const { id } = schema.params.parse(req.params)
    const { releaseId, type, status, points, title, description } = schema.body.parse(req.body)
    if (!req.user) {
      res.sendStatus(401)
    } else {
      const authorId = req.user.id
      await prisma.issue.update({
        where: { id },
        data: { authorId, releaseId, type, status, points, title, description },
      })
      res.status(200).json(id)
    }
    success()
  } catch (error) {
    res.sendStatus(500)
    failure(error)
  }
}
