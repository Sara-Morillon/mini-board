import bodyParser from 'body-parser'
import flash from 'connect-flash'
import cookieParser from 'cookie-parser'
import express from 'express'
import render from 'express-react-view'
import session from 'express-session'
import helmet from 'helmet'
import passport from 'passport'
import { Strategy } from 'passport-local'
import path from 'path'
import serve from 'serve-static'
import { createConnection } from 'typeorm'
import { config } from './config'
import { logger } from './libs/logger'
import { deserializeUser, localStrategy, serializeUser } from './libs/passport'
import { accessLogger } from './middlewares/accessLogger'
import { router } from './router'

passport.serializeUser(serializeUser)
passport.deserializeUser(deserializeUser)
passport.use(new Strategy(localStrategy))

const ext = config.environment === 'development' ? 'tsx' : 'js'

createConnection().then(() => {
  const app = express()
  app.set('views', path.join(__dirname, 'views'))
  app.set('view engine', ext)
  app.engine(ext, render({ cache: false, layout: 'Layout/Layout' }))
  app.use(serve(path.join(__dirname, 'public')))
  app.use(cookieParser())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(session(config.session))
  app.use(flash())
  app.use(passport.initialize())
  app.use(passport.session())
  app.use(accessLogger())
  app.use(helmet())
  app.use((req, res, next) => {
    res.locals.user = req.user
    next()
  })
  app.use(router)
  app.listen(config.port, () => {
    logger.info('app_start', { port: config.port })
  })
})
