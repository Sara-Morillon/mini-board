import { getMockReq, getMockRes } from '@jest-mock/express'
import { addUser } from '../../../src/controllers/users/addUser'

describe('addUser', () => {
  it('should render add user page', () => {
    const req = getMockReq()
    const { res } = getMockRes()
    addUser(req, res)
    expect(res.render).toHaveBeenCalledWith('Users/User', { title: 'Add user' })
  })
})
