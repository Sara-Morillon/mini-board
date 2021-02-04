import { cleanEnv, num, str } from 'envalid'
import session, { SessionOptions } from 'express-session'
import filestore from 'session-file-store'

const env = cleanEnv(
  process.env,
  {
    APP_KEY: str(),
    APP_PORT: num({ default: 80 }),
    LOG_LEVEL: str({ choices: ['debug', 'info', 'warn', 'error'], default: 'info' }),
    SESSION_DIR: str(),
    UPLOAD_DIR: str(),
    COOKIE_DOMAIN: str(),
  },
  { dotEnvPath: null }
)

interface IConfig {
  environment?: string
  port: number
  keys: string[]
  logLevel: 'debug' | 'info' | 'warn' | 'error'
  session: SessionOptions
  uploadDir: string
}

const FileStore = filestore(session)

export const config: IConfig = {
  environment: env.NODE_ENV,
  port: env.APP_PORT,
  keys: [env.APP_KEY],
  logLevel: env.LOG_LEVEL,
  session: {
    secret: [env.APP_KEY],
    resave: false,
    saveUninitialized: false,
    store: new FileStore({ path: env.SESSION_DIR }),
    name: 'sid',
    cookie: { domain: env.COOKIE_DOMAIN, httpOnly: false, secure: false },
  },
  uploadDir: env.UPLOAD_DIR,
}
