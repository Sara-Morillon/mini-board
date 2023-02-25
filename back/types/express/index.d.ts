import { User } from '@prisma/client'
import { Logger } from '@saramorillon/logger'

declare global {
  namespace Express {
    interface Request {
      logger: Logger
    }
  }
}

declare module 'express-session' {
  interface SessionData {
    user: Pick<User, 'id'>
  }
}
