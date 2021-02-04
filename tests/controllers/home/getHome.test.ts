import { getMockReq, getMockRes } from '@jest-mock/express'
import { getHome } from '../../../src/controllers/home/getHome'

describe('getHome', () => {
  const req = getMockReq()
  const { res } = getMockRes()

  it('should redirect to projects page', async () => {
    await getHome(req, res)
    expect(res.redirect).toHaveBeenCalledWith('/projects/list')
  })
})
