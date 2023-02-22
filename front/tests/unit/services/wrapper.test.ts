import axios from 'axios'
import { request } from '../../../src/services/wrapper'
import { mockLocation, restoreLocation } from '../../mocks'

describe('request', () => {
  it('should get data', async () => {
    jest.spyOn(axios, 'request').mockResolvedValue({ data: 'data' })
    await request({}, null)
    expect(axios.request).toHaveBeenCalledWith({ withCredentials: true })
  })

  it('should return data', async () => {
    jest.spyOn(axios, 'request').mockResolvedValue({ data: 'data' })
    const result = await request({}, null)
    expect(result).toBe('data')
  })

  it('should reload window if 401 error', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined)
    mockLocation({ reload: jest.fn() })
    jest.spyOn(axios, 'request').mockRejectedValue({ response: { status: 401 } })
    await request({}, null)
    expect(window.location.reload).toHaveBeenCalled()
    restoreLocation()
  })

  it('should log error to console', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined)
    jest.spyOn(axios, 'request').mockRejectedValue(new Error())
    await request({}, null)
    expect(console.error).toHaveBeenCalledWith(new Error())
  })

  it('should return default value if error', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined)
    jest.spyOn(axios, 'request').mockRejectedValue(new Error())
    const result = await request({}, null)
    expect(result).toBeNull()
  })

  it('should return default value if error has no response', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined)
    jest.spyOn(axios, 'request').mockRejectedValue({})
    const result = await request({}, null)
    expect(result).toBeNull()
  })
})
