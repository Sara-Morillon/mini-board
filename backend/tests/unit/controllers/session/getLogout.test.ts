import { getMockReq, getMockRes } from '@jest-mock/express'
import { getLogout } from '../../../../src/controllers/session/getLogout'

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
