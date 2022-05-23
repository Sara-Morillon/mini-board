import { bool, cleanEnv, num, str } from 'envalid'
import session, { SessionOptions } from 'express-session'
import { ContentSecurityPolicyOptions } from 'helmet/dist/middlewares/content-security-policy'
import filestore from 'session-file-store'

const env = cleanEnv(process.env, {
  NODE_ENV: str({ choices: ['development', 'test', 'production'] }),
  APP_KEY: str(),
  APP_PORT: num({ default: 80 }),
  SESSION_DIR: str(),
  UPLOAD_DIR: str(),
  COOKIE_DOMAIN: str(),
  LOG_SILENT: bool({ default: false }),
  PUBLIC_DIR: str(),
})

interface IConfig {
  environment?: string
  port: number
  keys: string[]
  session: SessionOptions
  uploadDir: string
  logSilent: boolean
  publicDir: string
  contentSecurityPolicy: ContentSecurityPolicyOptions
}

const FileStore = filestore(session)

export const config: IConfig = {
  environment: env.NODE_ENV,
  port: env.APP_PORT,
  keys: [env.APP_KEY],
  session: {
    secret: [env.APP_KEY],
    resave: false,
    saveUninitialized: false,
    store: new FileStore({ path: env.SESSION_DIR }),
    name: 'sid',
    cookie: { domain: env.COOKIE_DOMAIN, httpOnly: false, secure: false },
  },
  uploadDir: env.UPLOAD_DIR,
  logSilent: env.LOG_SILENT,
  publicDir: env.PUBLIC_DIR,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'", "'unsafe-eval'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      scriptSrc: ["'self'", "'unsafe-inline'"],
    },
  },
}
