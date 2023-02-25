import { getMockRes } from '@jest-mock/express'
import { getApp } from '../../../src/controllers/app'
import { getMockReq } from '../../mocks'

jest.mock('../../../package.json', () => ({
  name: 'name',
  version: 'version',
  repository: 'repository',
  author: 'author',
}))

describe('getApp', () => {
  it('should send app informations', () => {
    const req = getMockReq()
    const { res } = getMockRes()
    getApp(req, res)
    expect(res.json).toHaveBeenCalledWith({
      name: 'name',
      version: 'version',
      repository: 'repository',
      author: 'author',
    })
  })
})
