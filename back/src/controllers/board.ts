import { Request, Response } from 'express'
import { prisma } from '../prisma'

export async function getBoard(req: Request, res: Response): Promise<void> {
  const { success, failure } = req.logger.start('get_board')
  try {
    const issues = await prisma.issue.findMany({
      where: { release: { dueDate: { gt: new Date() } } },
      orderBy: [{ priority: 'asc' }],
      include: { author: true, project: true, release: true },
    })
    res.json(issues)
    success()
  } catch (error) {
    res.sendStatus(500)
    failure(error)
  }
}
