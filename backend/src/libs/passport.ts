import { createHash } from 'crypto'
import { prisma } from '../prisma'

export function serializeUser(user: { id: number }, done: (err: unknown, id?: number) => void): void {
  return done(null, user.id)
}

export function deserializeUser(id: number, done: (err: unknown, user?: { id: number }) => void): Promise<void> {
  return prisma.user
    .findUnique({ where: { id } })
    .then((user) => {
      if (!user) done('User not found')
      else done(null, user)
    })
    .catch(done)
}

export function localStrategy(
  username: string,
  password: string,
  done: (error: unknown, user?: { id: number }) => void
): Promise<void> {
  return prisma.user
    .findFirst({ where: { username, password: hashPass(password) } })
    .then((user) => {
      if (!user) done(new Error('User not found'))
      else done(null, user)
    })
    .catch(done)
}

export function hashPass(password: string) {
  return createHash('sha256').update(password).digest('hex')
}
