import { Request, Response } from 'express'
import { z } from 'zod'
import { start } from '../../libs/logger'
import { prisma } from '../../prisma'

const schema = {
  body: z.object({
    sourceId: z.number(),
    targetId: z.number(),
  }),
}

export async function moveIssues(req: Request, res: Response): Promise<void> {
  const { success, failure } = start('move_issues', { req })
  try {
    const { sourceId, targetId } = schema.body.parse(req.body)

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
