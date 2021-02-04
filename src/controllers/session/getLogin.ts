import { Request, Response } from 'express'

export function getLogin(req: Request, res: Response): void {
  const [error] = req.flash('error')
  return res.render('Login/Login', { error, title: 'Login' })
}
