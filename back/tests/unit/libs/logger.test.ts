import { getMockReq } from '@jest-mock/express'
import mockdate from 'mockdate'
import { logger, parseError, reqFormat, start } from '../../../src/libs/logger'
import { mockUser } from '../../mocks'

mockdate.set(0)

describe('reqFormat', () => {
  it('should return info as is if req is missing from meta', () => {
    const info = { level: 'info', message: 'message', prop: 'value' }
    expect(reqFormat().transform(info)).toEqual({
      level: 'info',
      message: 'message',
      prop: 'value',
    })
  })

  it('should return req info if req is present in meta', () => {
    const info = {
      level: 'info',
      message: 'message',
      req: getMockReq({
        url: 'url',
        params: { prop1: 'value1' },
        query: { prop2: 'value2' },
        body: { prop3: 'value3' },
      }),
    }
    expect(reqFormat().transform(info)).toEqual({
      level: 'info',
      message: 'message',
      url: 'url',
      params: { prop1: 'value1' },
      query: { prop2: 'value2' },
      body: { prop3: 'value3' },
    })
  })

  it('should return user info if user is present in req', () => {
    const info = {
      level: 'info',
      message: 'message',
      req: getMockReq({
        url: 'url',
        params: { prop1: 'value1' },
        query: { prop2: 'value2' },
        body: { prop3: 'value3' },
        user: mockUser,
      }),
    }
    expect(reqFormat().transform(info)).toEqual({
      level: 'info',
      message: 'message',
      url: 'url',
      params: { prop1: 'value1' },
      query: { prop2: 'value2' },
      body: { prop3: 'value3' },
      user: 1,
    })
  })
})

describe('start', () => {
  it('should log message and meta', () => {
    jest.spyOn(logger, 'info')
    start('message', { prop: 'value' })
    expect(logger.info).toHaveBeenCalledWith('message', { prop: 'value' })
  })

  it('should return log functions', () => {
    const fn = start('message', { prop: 'value' })
    expect(fn.success).toBeInstanceOf(Function)
    expect(fn.failure).toBeInstanceOf(Function)
  })

  it('should log message with "_success"', () => {
    jest.spyOn(logger, 'info')
    const { success } = start('message', { prop: 'value' })
    success()
    expect(logger.info).toHaveBeenCalledWith('message_success', { duration: '0ms', prop: 'value' })
  })

  it('should log message with "_failure" and error', () => {
    jest.spyOn(logger, 'error')
    const { failure } = start('message', { prop: 'value' })
    const error = new Error('error')
    failure(error)
    expect(logger.error).toHaveBeenCalledWith('message_failure', {
      duration: '0ms',
      prop: 'value',
      error: { message: error.message, stack: error.stack },
    })
  })
})

describe('parseError', () => {
  it('should return native error message and stack', () => {
    const error = new Error('error')
    const result = parseError(error)
    expect(result).toEqual({ message: error.message, stack: error.stack })
  })

  it('should return string error', () => {
    const result = parseError('error')
    expect(result).toEqual({ message: 'error' })
  })
})
