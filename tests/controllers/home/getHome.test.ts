import { getHome } from '@/controllers/home/getHome'
import { getMockReq, getMockRes } from '@jest-mock/express'

describe('getHome', () => {
  const req = getMockReq()
  const { res } = getMockRes()

  it('should redirect to projects page', async () => {
    await getHome(req, res)
    expect(res.redirect).toHaveBeenCalledWith('/projects/list')
  })
})
