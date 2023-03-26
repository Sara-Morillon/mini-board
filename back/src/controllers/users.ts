import { createHash } from 'crypto'
import { Request, Response } from 'express'
import { z } from 'zod'
import { prisma } from '../prisma'
import { parseError } from '../utils/parseError'

const schema = {
  get: z.object({
    id: z.string().transform(Number),
  }),
  post: z.object({
    username: z.string(),
    password: z.string(),
  }),
}

export async function getUsers(req: Request, res: Response): Promise<void> {
  const { success, failure } = req.logger.start('get_users')
  try {
    const users = await prisma.user.findMany({ orderBy: { username: 'asc' } })
    res.json(users)
    success()
  } catch (error) {
    res.sendStatus(500)
    failure(parseError(error))
  }
}

export async function postUser(req: Request, res: Response): Promise<void> {
  const { success, failure } = req.logger.start('post_user')
  try {
    const { username, password } = schema.post.parse(req.body)
    const user = await prisma.user.create({
      data: { username, password: createHash('sha256').update(password).digest('hex') },
    })
    res.status(201).json(user.id)
    success()
  } catch (error) {
    res.sendStatus(500)
    failure(parseError(error))
  }
}

export async function deleteUser(req: Request, res: Response): Promise<void> {
  const { success, failure } = req.logger.start('delete_user')
  try {
    const { id } = schema.get.parse(req.params)
    await prisma.user.delete({ where: { id } })
    res.sendStatus(204)
    success()
  } catch (error) {
    res.sendStatus(500)
    failure(parseError(error))
  }
}
