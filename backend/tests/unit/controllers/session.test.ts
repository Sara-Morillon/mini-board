import { getMockReq, getMockRes } from '@jest-mock/express'
import passport from 'passport'
import { getLogout, getSession, postLogin } from '../../../src/controllers/session'
import { mock, mockUser } from '../../mocks'

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

describe('getSession', () => {
  it('should return user', () => {
    const req = getMockReq({ user: mockUser })
    const { res } = getMockRes()
    getSession(req, res)
    expect(res.json).toHaveBeenCalledWith(mockUser)
  })

  it('should send 500 status when failure', () => {
    const req = getMockReq()
    const { res } = getMockRes()
    res.json = jest.fn().mockImplementation(() => {
      throw new Error()
    })
    getSession(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(500)
  })
})

describe('getLogout', () => {
  it('should logout', () => {
    const req = getMockReq({ logout: jest.fn() })
    const { res } = getMockRes()
    getLogout(req, res)
    expect(req.logout).toHaveBeenCalled()
  })

  it('should return 204 status', () => {
    const req = getMockReq({ logout: jest.fn() })
    const { res } = getMockRes()
    getLogout(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(204)
  })
})
