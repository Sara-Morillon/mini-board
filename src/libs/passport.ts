import sha256 from 'crypto-js/sha256'
import { User } from '../models/User'

export function serializeUser(user: User, done: (err: unknown, id?: string) => void): void {
  return done(null, user.username)
}

export function deserializeUser(username: string, done: (err: unknown, user?: User) => void): Promise<void> {
  return User.getRepository()
    .findOne({ where: { username } })
    .then((user) => {
      done(null, user)
    })
    .catch(done)
}

export function localStrategy(
  username: string,
  password: string,
  done: (error: unknown, user?: User) => void
): Promise<void> {
  return User.getRepository()
    .findOne({ where: { username, password: sha256(password).toString() } })
    .then((user) => {
      done(null, user)
    })
    .catch(done)
}
