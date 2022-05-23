import { Request, Response } from 'express'
import { z } from 'zod'
import { start } from '../../libs/logger'
import { prisma } from '../../prisma'

const schema = {
  query: z.object({
    projectId: z.string().transform(Number),
    releaseId: z.string().optional().transform(Number),
    page: z.string().optional().transform(Number),
    limit: z.string().optional().transform(Number),
  }),
}

export async function getIssues(req: Request, res: Response): Promise<void> {
  const { success, failure } = start('get_issues', { req })
  try {
    const { projectId, releaseId, page, limit } = schema.query.parse(req.query)
    const issues = await prisma.issue.findMany({
      where: { projectId, ...(releaseId && { releaseId }) },
      orderBy: [{ release: { dueDate: 'desc' } }, { priority: 'asc' }],
      include: { author: true, project: true, release: true },
      ...(page && limit && { take: limit, skip: (page - 1) * limit }),
    })
    const total = await prisma.issue.count({ where: { projectId, ...(releaseId && { releaseId }) } })
    res.json({ issues, total })
    success()
  } catch (error) {
    res.sendStatus(500)
    failure(error)
  }
}
