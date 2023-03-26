import { Status, Type } from '@prisma/client'
import { Request, Response } from 'express'
import { z } from 'zod'
import { prisma } from '../prisma'

const schema = {
  list: z.object({
    projectId: z.string().transform(Number).optional(),
    releaseId: z.string().transform(Number).optional(),
    page: z.string().transform(Number).optional(),
    limit: z.string().transform(Number).optional(),
  }),
  get: z.object({
    id: z.string().transform(Number),
  }),
  post: z.object({
    projectId: z.number(),
    releaseId: z.number(),
    type: z.nativeEnum(Type),
    points: z.number(),
    title: z.string(),
    description: z.string(),
  }),
  patch: z.object({
    releaseId: z.number(),
    type: z.nativeEnum(Type),
    status: z.nativeEnum(Status),
    points: z.number(),
    title: z.string(),
    description: z.string(),
  }),
  move: z.object({
    sourceId: z.number(),
    targetId: z.number(),
  }),
}

export async function getIssues(req: Request, res: Response): Promise<void> {
  const { success, failure } = req.logger.start('get_issues')
  try {
    const { projectId, releaseId, page, limit } = schema.list.parse(req.query)
    const issues = await prisma.issue.findMany({
      where: { ...(releaseId && { releaseId }), ...(projectId && { projectId }) },
      orderBy: [{ release: { dueDate: 'desc' } }, { priority: 'asc' }],
      include: { author: true, project: true, release: true },
      ...(page && limit && { take: limit, skip: (page - 1) * limit }),
    })
    const total = await prisma.issue.count({
      where: { ...(releaseId && { releaseId }), ...(projectId && { projectId }) },
    })
    res.json({ issues, total })
    success()
  } catch (error) {
    res.sendStatus(500)
    failure(error)
  }
}

export async function postIssue(req: Request, res: Response): Promise<void> {
  const { success, failure } = req.logger.start('post_issue')
  try {
    const { projectId, releaseId, type, points, title, description } = schema.post.parse(req.body)
    const authorId = req.user.id
    const status = 'todo'
    const { _max } = await prisma.issue.aggregate({ where: { projectId, releaseId }, _max: { priority: true } })
    const priority = _max.priority !== null ? _max.priority + 1 : 0
    const issue = await prisma.issue.create({
      data: { authorId, projectId, releaseId, priority, type, status, points, title, description },
    })
    res.status(201).json(issue.id)
    success()
  } catch (error) {
    res.sendStatus(500)
    failure(error)
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
    failure(error)
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
    failure(error)
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
    failure(error)
  }
}

export async function moveIssues(req: Request, res: Response): Promise<void> {
  const { success, failure } = req.logger.start('move_issues')
  try {
    const { sourceId, targetId } = schema.move.parse(req.body)

    const source = await prisma.issue.findUnique({ where: { id: sourceId } })
    const target = await prisma.issue.findUnique({ where: { id: targetId } })

    if (source && target) {
      const issues = await prisma.issue.findMany({
        where: { releaseId: { in: [source.releaseId, target.releaseId] } },
        orderBy: [{ releaseId: 'asc' }, { priority: 'asc' }],
      })
      const sourceIndex = issues.findIndex((issue) => source.id === issue.id)
      const targetIndex = issues.findIndex((issue) => target.id === issue.id)

      const [issue] = issues.splice(sourceIndex, 1)
      issue.releaseId = target.releaseId
      issues.splice(targetIndex, 0, issue)

      let lastRelease
      let priority = 0
      for (const issue of issues) {
        if (issue.releaseId !== lastRelease) {
          priority = 0
        }
        const { id, releaseId } = issue
        await prisma.issue.update({ where: { id }, data: { releaseId, priority } })
        lastRelease = issue.releaseId
        priority++
      }
    }

    res.sendStatus(204)
    success()
  } catch (error) {
    res.sendStatus(500)
    failure(error)
  }
}
