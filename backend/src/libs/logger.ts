import path from 'path'
import { types } from 'util'
import { createLogger, format, transports } from 'winston'
import { name } from '../../package.json'
import { config } from '../config'

const dirname = path.join(__dirname, '..', '..', 'logs')

export const reqFormat = format(({ req, ...info }) => ({
  ...info,
  ...(req && {
    url: req.url,
    params: req.params,
    query: req.query,
    body: req.body,
    user: req.user?.id,
  }),
}))

const fileTransport = new transports.File({
  format: format.combine(reqFormat(), format.timestamp(), format.json()),
  dirname,
  filename: name,
  maxsize: 5242880,
  maxFiles: 5,
})

const consoleTransport = new transports.Console({
  format: format.combine(reqFormat(), format.timestamp(), format.colorize(), format.simple()),
})

export const logger = createLogger({
  level: 'info',
  transports: [fileTransport, consoleTransport],
  silent: config.logSilent,
})

interface IAction {
  success: () => void
  failure: (error: unknown) => void
}

export function start(message: string, meta?: Record<string, unknown>): IAction {
  const start = Date.now()
  logger.info(message, meta)

  return {
    success: () => {
      logger.info(`${message}_success`, { ...meta, duration: `${Date.now() - start}ms` })
    },
    failure: (error) => {
      logger.error(`${message}_failure`, { ...meta, duration: `${Date.now() - start}ms`, error: parseError(error) })
    },
  }
}

export function parseError(error: unknown) {
  if (types.isNativeError(error)) {
    return { message: error.message, stack: error.stack }
  }
  return { message: String(error) }
}
