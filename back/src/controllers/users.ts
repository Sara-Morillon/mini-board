import { Request, Response } from 'express'
import { z } from 'zod'
import { start } from '../libs/logger'
import { hashPass } from '../libs/passport'
import { prisma } from '../prisma'

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

export async function postUser(req: Request, res: Response): Promise<void> {
  const { success, failure } = start('post_user', { req })
  try {
    const { username, password } = schema.post.parse(req.body)
    const user = await prisma.user.create({ data: { username, password: hashPass(password) } })
    res.status(201).json(user.id)
    success()
  } catch (error) {
    res.sendStatus(500)
    failure(error)
  }
}

export async function deleteUser(req: Request, res: Response): Promise<void> {
  const { success, failure } = start('delete_user', { req })
  try {
    const { id } = schema.get.parse(req.params)
    await prisma.user.delete({ where: { id } })
    res.sendStatus(204)
    success()
  } catch (error) {
    res.sendStatus(500)
    failure(error)
  }
}
