import { NextFunction, Request, Response } from 'express'
import passport from 'passport'
import { start } from '../../libs/logger'

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
