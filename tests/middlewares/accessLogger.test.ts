import { getMockReq, getMockRes } from '@jest-mock/express'
import { logger as mockLogger } from '../../src/libs/logger'
import { accessLogger } from '../../src/middlewares/accessLogger'

const { res } = getMockRes()

jest.mock('../../src/libs/logger')

describe('logger', () => {
  it('should log if request succeeds', () => {
    res.on = jest.fn().mockImplementation((event, callback) => callback())
    res.statusCode = 200
    const req = getMockReq({ method: 'GET', params: 'params', query: 'query', url: 'url' })
    const next = jest.fn()
    accessLogger()(req, res, next)
    expect(next).toHaveBeenCalled()
    expect(mockLogger.info).toHaveBeenCalledWith('request success', {
      duration: expect.stringMatching(/.*ms/),
      method: 'GET',
      status: 200,
      params: 'params',
      query: 'query',
      url: 'url',
    })
  })

  it('should log if request fails', () => {
    res.on = jest.fn().mockImplementation((event, callback) => callback())
    res.statusCode = 500
    const req = getMockReq({ method: 'GET', params: 'params', query: 'query', url: 'url' })
    const next = jest.fn()
    accessLogger()(req, res, next)
    expect(next).toHaveBeenCalled()
    expect(mockLogger.error).toHaveBeenCalledWith('request error', {
      duration: expect.stringMatching(/.*ms/),
      method: 'GET',
      status: 500,
      params: 'params',
      query: 'query',
      url: 'url',
    })
  })
})
