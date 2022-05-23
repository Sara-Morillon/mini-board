import { Request, Response } from 'express'
import { start } from '../../libs/logger'
import { prisma } from '../../prisma'

export async function getUsers(req: Request, res: Response): Promise<void> {
  const { success, failure } = start('get_users', { req })
  try {
    const users = await prisma.user.findMany({ orderBy: { username: 'asc' } })
    res.json(users)
    success()
  } catch (error) {
    res.sendStatus(500)
    failure(error)
  }
}
