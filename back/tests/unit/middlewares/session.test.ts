import { getMockReq, getMockRes } from '@jest-mock/express'
import { hasSession } from '../../../src/middlewares/session'

describe('session', () => {
  it('should call next if authenticated', () => {
    const req = getMockReq({ isAuthenticated: jest.fn().mockReturnValue(true) })
    const { res, next } = getMockRes()
    hasSession()(req, res, next)
    expect(res.sendStatus).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalled()
  })

  it('should return 401 status if not authenticated', () => {
    const req = getMockReq({ isAuthenticated: jest.fn().mockReturnValue(false) })
    const { res, next } = getMockRes()
    hasSession()(req, res, next)
    expect(res.sendStatus).toHaveBeenCalledWith(401)
    expect(next).not.toHaveBeenCalled()
  })
})
