import sha256 from 'crypto-js/sha256'
import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { User } from '../../models/User'

export type Req = Request<ParamsDictionary, unknown, { username: string; password: string }>

export async function postUser(req: Req, res: Response): Promise<void> {
  const { username, password } = req.body
  await User.getRepository().save({ username, password: sha256(password).toString() })
  res.redirect('/users/list')
}
