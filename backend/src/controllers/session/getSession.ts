import { Request, Response } from 'express'
import { start } from '../../libs/logger'

export function getSession(req: Request, res: Response): void {
  const { success, failure } = start('get_session', { req })
  try {
    res.json(req.user)
    success()
  } catch (error) {
    res.sendStatus(500)
    failure(error)
  }
}
