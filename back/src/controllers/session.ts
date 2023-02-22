import { NextFunction, Request, Response } from 'express'
import passport from 'passport'
import { start } from '../libs/logger'

export function postLogin(req: Request, res: Response, next: NextFunction): void {
  const { success, failure } = start('login', { req: { ...req, body: { ...req.body, password: '*****' } } })
  passport.authenticate('local', function (err, user) {
    if (err || !user) {
      failure(err)
      res.sendStatus(401)
    } else {
      req.login(user, function (err) {
        if (err) {
          failure(err)
          res.sendStatus(401)
        } else {
          success()
          res.sendStatus(204)
        }
      })
    }
  })(req, res, next)
}

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

export function getLogout(req: Request, res: Response): void {
  req.logout()
  res.sendStatus(204)
}
