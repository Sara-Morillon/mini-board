import { render, renderHook, screen } from '@testing-library/react'
import React, { PropsWithChildren, useContext } from 'react'
import { SessionContext, SessionProvider, useSession } from '../../../src/contexts/SessionContext'
import { getSession } from '../../../src/services/session'
import { mock, mockUser, wait } from '../../mocks'

jest.mock('../../../src/services/session')

function wrapper({ children }: PropsWithChildren<unknown>) {
  return <SessionContext.Provider value={mockUser()}>{children}</SessionContext.Provider>
}

describe('SessionContext', () => {
  beforeEach(() => {
    mock(getSession).mockResolvedValue('session')
  })

  it('should show loader when loading', async () => {
    render(<SessionProvider></SessionProvider>)
    expect(screen.getByLabelText('Loading...')).toBeInTheDocument()
    await wait()
  })

  it('should render children', async () => {
    render(<SessionProvider>In provider</SessionProvider>)
    await wait()
    expect(screen.getByText('In provider')).toBeInTheDocument()
  })

  it('should return session', () => {
    const { result } = renderHook(() => useContext(SessionContext), { wrapper })
    expect(result.current).toEqual(mockUser())
  })
})

describe('useSession', () => {
  it('should throw if context is used outside a Provider', () => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined)
    expect(() => renderHook(() => useSession())).toThrow(new Error('No session found'))
  })

  it('should return session', () => {
    const { result } = renderHook(() => useSession(), { wrapper })
    expect(result.current).toEqual(mockUser())
  })
})
