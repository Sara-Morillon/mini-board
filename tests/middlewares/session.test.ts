import { hasSession } from '@/middlewares/session'
import { getMockReq, getMockRes } from '@jest-mock/express'

const { res } = getMockRes()

describe('session', () => {
  it('should call next if ctx is authenticated', async () => {
    const req = getMockReq()
    const next = jest.fn()
    req.isAuthenticated = jest.fn().mockReturnValue(true)
    hasSession()(req, res, next)
    expect(res.redirect).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalled()
  })

  it('should redirect if ctx is not authenticated', async () => {
    const req = getMockReq()
    const next = jest.fn()
    req.isAuthenticated = jest.fn().mockReturnValue(false)
    hasSession()(req, res, next)
    expect(res.redirect).toHaveBeenCalledWith('/login')
    expect(next).not.toHaveBeenCalled()
  })
})
