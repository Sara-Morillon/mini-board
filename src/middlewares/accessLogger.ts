import { NextFunction, Request, Response } from 'express'
import { performance } from 'perf_hooks'
import { logger } from '../libs/logger'

export function accessLogger() {
  return (req: Request, res: Response, next: NextFunction): void => {
    const start = performance.now()
    const { url, params, query, method } = req
    res.on('finish', () => {
      const { statusCode: status } = res
      const end = performance.now()
      const duration = `${end - start}ms`
      if (status < 400) {
        logger.info('request success', { method, url, params, query, status, duration })
      } else {
        logger.error('request error', { method, url, params, query, status, duration })
      }
    })
    next()
  }
}
