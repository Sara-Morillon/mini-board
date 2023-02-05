import { json, urlencoded } from 'body-parser'
import cookieParser from 'cookie-parser'
import express, { static as _static } from 'express'
import session from 'express-session'
import helmet from 'helmet'
import passport from 'passport'
import { Strategy } from 'passport-local'
import { join } from 'path'
import { config } from './config'
import { logger } from './libs/logger'
import { deserializeUser, localStrategy, serializeUser } from './libs/passport'
import { router } from './router'

const { publicDir, contentSecurityPolicy, port } = config

passport.serializeUser(serializeUser)
passport.deserializeUser(deserializeUser)
passport.use(new Strategy(localStrategy))

const app = express()
app.use(_static(publicDir))
app.use(cookieParser())
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(session(config.session))
app.use(passport.initialize())
app.use(passport.session())
app.use(helmet({ contentSecurityPolicy }))
app.use('/api', router)
app.get('*', (req, res) => res.sendFile(join(publicDir, 'index.html')))
app.listen(port, () => {
  logger.info('app_start', { port })
})
