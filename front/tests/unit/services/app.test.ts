import { getApp } from '../../../src/services/app'
import { Axios } from '../../../src/services/Axios'

jest.mock('../../../src/services/Axios')

describe('getApp', () => {
  beforeEach(() => {
    jest.mocked(Axios.get).mockResolvedValue({ data: 'app' })
  })

  it('should get app', async () => {
    await getApp()
    expect(Axios.get).toHaveBeenCalledWith('/api/app')
  })

  it('should return app', async () => {
    const result = await getApp()
    expect(result).toBe('app')
  })
})
