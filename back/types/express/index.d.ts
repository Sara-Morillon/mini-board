import { User } from '@prisma/client'
import { Logger } from '@saramorillon/logger'
import 'express-session'

declare global {
  namespace Express {
    interface Request {
      logger: Logger
      user: Pick<User, 'id'>
    }
  }
}

declare module 'express-session' {
  interface SessionData {
    user: Pick<User, 'id'>
  }
}
