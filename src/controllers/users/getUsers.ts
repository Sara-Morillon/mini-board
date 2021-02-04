import { Request, Response } from 'express'
import { User } from '../../models/User'

export async function getUsers(req: Request, res: Response): Promise<void> {
  const users = await User.getRepository().find({ order: { username: 'ASC' } })
  res.render('Users/Users', { users, title: 'Users' })
}
