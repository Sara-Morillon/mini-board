import { getMockReq, getMockRes } from '@jest-mock/express'
import { getLogout } from '../../../src/controllers/session/getLogout'

describe('getLogout', () => {
  const req = getMockReq()
  const { res, clearMockRes } = getMockRes()

  beforeEach(() => {
    clearMockRes()

    req.logout = jest.fn()
  })

  it('should logout', () => {
    getLogout(req, res)
    expect(req.logout).toHaveBeenCalled()
  })

  it('should redirect to /', () => {
    getLogout(req, res)
    expect(res.redirect).toHaveBeenCalledWith('/')
  })
})
