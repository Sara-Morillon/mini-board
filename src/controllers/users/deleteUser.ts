import { Request, Response } from 'express'
import { User } from '../../models/User'

export type Req = Request<{ id: string }>

export async function deleteUser(req: Req, res: Response): Promise<void> {
  const { id } = req.params
  await User.getRepository().delete(id)
  res.redirect('/users/list')
}
