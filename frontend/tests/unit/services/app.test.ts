import { getApp } from '../../../src/services/app'
import { request } from '../../../src/services/wrapper'
import { mock } from '../../mocks'

jest.mock('../../../src/services/wrapper')

describe('getApp', () => {
  it('should get app', async () => {
    await getApp()
    expect(request).toHaveBeenCalledWith({ url: '/api/app' }, null)
  })

  it('should return app', async () => {
    mock(request).mockResolvedValue('app')
    const result = await getApp()
    expect(result).toBe('app')
  })
})
