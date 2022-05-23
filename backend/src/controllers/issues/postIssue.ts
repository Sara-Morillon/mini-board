import { Type } from '@prisma/client'
import { Request, Response } from 'express'
import { z } from 'zod'
import { start } from '../../libs/logger'
import { prisma } from '../../prisma'

const schema = {
  body: z.object({
    projectId: z.number(),
    releaseId: z.number(),
    type: z.nativeEnum(Type),
    points: z.number(),
    title: z.string(),
    description: z.string(),
  }),
}

export async function postIssue(req: Request, res: Response): Promise<void> {
  const { success, failure } = start('post_issue', { req })
  try {
    if (!req.user) {
      res.sendStatus(401)
    } else {
      const { projectId, releaseId, type, points, title, description } = schema.body.parse(req.body)
      const authorId = req.user.id
      const status = 'todo'
      const priority = 0
      const issue = await prisma.issue.create({
        data: { authorId, projectId, releaseId, priority, type, status, points, title, description },
      })
      res.status(201).json(issue.id)
    }
    success()
  } catch (error) {
    res.sendStatus(500)
    failure(error)
  }
}
