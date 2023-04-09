import { Request, Response } from 'express'
import { prisma } from '../prisma'
import { parseError } from '../utils/parseError'

export async function getBoard(req: Request, res: Response): Promise<void> {
  const { success, failure } = req.logger.start('get_board')
  try {
    const issues = await prisma.release.findFirst({
      where: { dueDate: { gt: new Date() } },
      orderBy: [{ dueDate: 'desc' }],
      include: { issues: { orderBy: { priority: 'asc' }, include: { author: true, project: true } } },
    })
    res.json(issues)
    success()
  } catch (error) {
    res.sendStatus(500)
    failure(parseError(error))
  }
}
