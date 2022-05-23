import { getMockReq, getMockRes } from '@jest-mock/express'
import passport from 'passport'
import { postLogin } from '../../../../src/controllers/session/postLogin'
import { mock, mockUser } from '../../../mocks'

jest.mock('passport')

describe('postLogin', () => {
  it('should authenticate', () => {
    mock(passport.authenticate).mockReturnValue(jest.fn())
    const req = getMockReq()
    const { res, next } = getMockRes()
    postLogin(req, res, next)
    expect(passport.authenticate).toHaveBeenCalledWith('local', expect.any(Function))
  })

  it('should send 401 status if authentication error', () => {
    mock(passport.authenticate).mockImplementation((s, fn) => {
      fn('Error')
      return jest.fn()
    })
    const req = getMockReq()
    const { res, next } = getMockRes()
    postLogin(req, res, next)
    expect(res.sendStatus).toHaveBeenCalledWith(401)
  })

  it('should send 401 status if user is not found', () => {
    mock(passport.authenticate).mockImplementation((s, fn) => {
      fn(null, null)
      return jest.fn()
    })
    const req = getMockReq()
    const { res, next } = getMockRes()
    postLogin(req, res, next)
    expect(res.sendStatus).toHaveBeenCalledWith(401)
  })

  it('should login', () => {
    mock(passport.authenticate).mockImplementation((s, fn) => {
      fn(null, mockUser)
      return jest.fn()
    })
    const req = getMockReq({ login: jest.fn() })
    const { res, next } = getMockRes()
    postLogin(req, res, next)
    expect(req.login).toHaveBeenCalledWith(mockUser, expect.any(Function))
  })

  it('should send 401 error if login fails', () => {
    mock(passport.authenticate).mockImplementation((s, fn) => {
      fn(null, mockUser)
      return jest.fn()
    })
    const req = getMockReq({ login: jest.fn().mockImplementation((u, fn) => fn('Error')) })
    const { res, next } = getMockRes()
    postLogin(req, res, next)
    expect(res.sendStatus).toHaveBeenCalledWith(401)
  })

  it('should send 204 status if login succeeds', () => {
    mock(passport.authenticate).mockImplementation((s, fn) => {
      fn(null, mockUser)
      return jest.fn()
    })
    const req = getMockReq({ login: jest.fn().mockImplementation((u, fn) => fn()) })
    const { res, next } = getMockRes()
    postLogin(req, res, next)
    expect(res.sendStatus).toHaveBeenCalledWith(204)
  })
})
