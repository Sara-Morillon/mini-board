import axios from 'axios'
import { getSession, login, logout } from '../../../src/services/session'
import { request } from '../../../src/services/wrapper'
import { mock, mockLocation, restoreLocation } from '../../mocks'

jest.mock('../../../src/services/wrapper')

describe('getSession', () => {
  it('should get session', async () => {
    jest.spyOn(axios, 'get').mockResolvedValue({ data: 'session' })
    await getSession()
    expect(axios.get).toHaveBeenCalledWith('/api/session', { withCredentials: true })
  })

  it('should return session', async () => {
    jest.spyOn(axios, 'get').mockResolvedValue({ data: 'session' })
    const result = await getSession()
    expect(result).toBe('session')
  })

  it('should return null if cannot get session', async () => {
    jest.spyOn(axios, 'get').mockRejectedValue(new Error())
    const result = await getSession()
    expect(result).toBeNull()
  })
})

describe('login', () => {
  it('should log in', async () => {
    await login('username', 'password')
    expect(request).toHaveBeenCalledWith(
      { url: '/api/login', method: 'POST', data: { password: 'password', username: 'username' } },
      undefined
    )
  })
})

describe('logout', () => {
  it('should log out', async () => {
    mockLocation({ reload: jest.fn() })
    await logout()
    expect(request).toHaveBeenCalledWith({ url: '/api/logout' }, undefined)
    restoreLocation()
  })

  it('should reload page after logging out', async () => {
    mock(request).mockResolvedValue(undefined)
    mockLocation({ reload: jest.fn() })
    await logout()
    expect(window.location.reload).toHaveBeenCalled()
    restoreLocation()
  })
})
