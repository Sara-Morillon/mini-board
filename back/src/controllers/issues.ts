import { Status, Type } from '@prisma/client'
import { Request, Response } from 'express'
import { z } from 'zod'
import { prisma } from '../prisma'
import { parseError } from '../utils/parseError'

const schema = {
  list: z.object({
    projectId: z.string().transform(Number).optional(),
    releaseId: z.union([z.literal('backlog'), z.string().transform(Number)]).optional(),
    page: z.string().transform(Number).optional(),
    limit: z.string().transform(Number).optional(),
  }),
  get: z.object({
    id: z.string().transform(Number),
  }),
  post: z.object({
    projectId: z.number(),
    releaseId: z.number().nullable(),
    type: z.nativeEnum(Type),
    points: z.number(),
    title: z.string(),
    description: z.string(),
  }),
  patch: z.object({
    releaseId: z.number().nullable(),
    type: z.nativeEnum(Type),
    status: z.nativeEnum(Status),
    points: z.number(),
    title: z.string(),
    description: z.string(),
  }),
  move: z.object({
    sourceId: z.number(),
    targetId: z.number(),
    releaseId: z.number().nullable(),
  }),
}

export async function getIssues(req: Request, res: Response): Promise<void> {
  const { success, failure } = req.logger.start('get_issues')
  try {
    const query = schema.list.parse(req.query)
    const { projectId, page, limit } = query
    const releaseId = query.releaseId === 'backlog' ? null : query.releaseId
    const issues = await prisma.issue.findMany({
      where: { ...((releaseId || releaseId === null) && { releaseId }), ...(projectId && { projectId }) },
      orderBy: [{ release: { dueDate: 'desc' } }, { priority: 'asc' }],
      include: { author: true, project: true, release: true },
      ...(page && limit && { take: limit, skip: (page - 1) * limit }),
    })
    const total = await prisma.issue.count({
      where: { ...((releaseId || releaseId === null) && { releaseId }), ...(projectId && { projectId }) },
    })
    res.json({ issues, total })
    success()
  } catch (error) {
    res.sendStatus(500)
    failure(parseError(error))
  }
}

export async function postIssue(req: Request, res: Response): Promise<void> {
  const { success, failure } = req.logger.start('post_issue')
  try {
    const { projectId, releaseId, type, points, title, description } = schema.post.parse(req.body)
    const authorId = req.user.id
    const status = 'todo'
    const { _max } = await prisma.issue.aggregate({ where: { projectId, releaseId }, _max: { priority: true } })
    const priority = (_max.priority ?? 0) + 1
    const issue = await prisma.issue.create({
      data: { authorId, projectId, releaseId, priority, type, status, points, title, description },
    })
    res.status(201).json(issue.id)
    success()
  } catch (error) {
    res.sendStatus(500)
    failure(parseError(error))
  }
}

export async function getIssue(req: Request, res: Response): Promise<void> {
  const { success, failure } = req.logger.start('get_issue')
  try {
    const { id } = schema.get.parse(req.params)
    const issue = await prisma.issue.findUnique({ where: { id } })
    res.json(issue)
    success()
  } catch (error) {
    res.sendStatus(500)
    failure(parseError(error))
  }
}

export async function patchIssue(req: Request, res: Response): Promise<void> {
  const { success, failure } = req.logger.start('put_issue')
  try {
    const { id } = schema.get.parse(req.params)
    const { releaseId, type, status, points, title, description } = schema.patch.parse(req.body)
    const authorId = req.user.id
    await prisma.issue.update({
      where: { id },
      data: { authorId, releaseId, type, status, points, title, description },
    })
    res.status(200).json(id)
    success()
  } catch (error) {
    res.sendStatus(500)
    failure(parseError(error))
  }
}

export async function deleteIssue(req: Request, res: Response): Promise<void> {
  const { success, failure } = req.logger.start('delete_issue')
  try {
    const { id } = schema.get.parse(req.params)
    await prisma.issue.delete({ where: { id } })
    res.sendStatus(204)
    success()
  } catch (error) {
    res.sendStatus(500)
    failure(parseError(error))
  }
}

export async function moveIssues(req: Request, res: Response): Promise<void> {
  const { success, failure } = req.logger.start('move_issues')
  try {
    const { sourceId, targetId, releaseId } = schema.move.parse(req.body)
    const source = await prisma.issue.findUnique({ where: { id: sourceId } })
    const target = await prisma.issue.findUnique({ where: { id: targetId } })

    if (source && target) {
      if (source.priority > target.priority) {
        await prisma.issue.updateMany({
          where: { releaseId, priority: { gte: target.priority, lte: source.priority } },
          data: { priority: { increment: 1 } },
        })
      } else {
        await prisma.issue.updateMany({
          where: { releaseId, priority: { gte: source.priority, lte: target.priority } },
          data: { priority: { decrement: 1 } },
        })
      }
      await prisma.issue.update({ where: { id: source.id }, data: { priority: target.priority } })
    }

    res.sendStatus(204)
    success()
  } catch (error) {
    res.sendStatus(500)
    failure(parseError(error))
  }
}
