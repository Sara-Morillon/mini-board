import { deleteRelease, getRelease, getReleases, saveRelease } from '../../../src/services/release'
import { request } from '../../../src/services/wrapper'
import { mock, mockRelease } from '../../mocks'

jest.mock('../../../src/services/wrapper')

describe('getReleases', () => {
  it('should get releases', async () => {
    await getReleases(1)
    expect(request).toHaveBeenCalledWith({ url: '/api/releases', params: { projectId: 1 } }, [])
  })

  it('should return releases', async () => {
    mock(request).mockResolvedValue('releases')
    const result = await getReleases(1)
    expect(result).toBe('releases')
  })
})

describe('getRelease', () => {
  it('should return null without id', async () => {
    const result = await getRelease()
    expect(result).toBeNull()
  })

  it('should get release', async () => {
    await getRelease('1')
    expect(request).toHaveBeenCalledWith({ url: '/api/releases/1' }, null)
  })

  it('should return release', async () => {
    mock(request).mockResolvedValue('release')
    const result = await getRelease('1')
    expect(result).toBe('release')
  })
})

describe('saveRelease', () => {
  it('should post release without id', async () => {
    await saveRelease(mockRelease({ id: 0 }))
    expect(request).toHaveBeenCalledWith({ url: '/api/releases', method: 'POST', data: mockRelease({ id: 0 }) }, null)
  })

  it('should patch release with id', async () => {
    await saveRelease(mockRelease())
    expect(request).toHaveBeenCalledWith({ url: '/api/releases/1', method: 'PATCH', data: mockRelease() }, null)
  })

  it('should return releases path', async () => {
    mock(request).mockResolvedValue('2')
    const path = await saveRelease(mockRelease())
    expect(path).toBe('/project/1/releases')
  })
})

describe('deleteRelease', () => {
  it('should delete release', async () => {
    await deleteRelease(mockRelease())
    expect(request).toHaveBeenCalledWith({ url: '/api/releases/1', method: 'DELETE' }, undefined)
  })

  it('should return releases path', async () => {
    const path = await deleteRelease(mockRelease())
    expect(path).toBe('/project/1/releases')
  })
})
