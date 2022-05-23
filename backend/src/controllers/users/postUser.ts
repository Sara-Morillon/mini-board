import { Request, Response } from 'express'
import { z } from 'zod'
import { start } from '../../libs/logger'
import { hashPass } from '../../libs/passport'
import { prisma } from '../../prisma'

const schema = {
  body: z.object({
    username: z.string(),
    password: z.string(),
  }),
}

export async function postUser(req: Request, res: Response): Promise<void> {
  const { success, failure } = start('post_user', { req })
  try {
    const { username, password } = schema.body.parse(req.body)
    const user = await prisma.user.create({ data: { username, password: hashPass(password) } })
    res.status(201).json(user.id)
    success()
  } catch (error) {
    res.sendStatus(500)
    failure(error)
  }
}
