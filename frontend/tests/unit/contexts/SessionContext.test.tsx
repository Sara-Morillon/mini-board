import { useFetch } from '@saramorillon/hooks'
import { render, screen } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'
import React, { PropsWithChildren, useContext } from 'react'
import { SessionContext, SessionProvider, useSession } from '../../../src/contexts/SessionContext'
import { mock } from '../../mocks'

jest.mock('@saramorillon/hooks')

function wrapper({ children }: PropsWithChildren<unknown>) {
  return <SessionProvider>{children}</SessionProvider>
}

describe('SessionContext', () => {
  beforeEach(() => {
    mock(useFetch).mockReturnValue(['session', { loading: false }])
  })

  it('should show loader when loading', () => {
    mock(useFetch).mockReturnValue([null, { loading: true }])
    render(<div />, { wrapper })
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('should render children', () => {
    render(<div>In provider</div>, { wrapper })
    expect(screen.getByText('In provider')).toBeInTheDocument()
  })

  it('should return session', () => {
    const { result } = renderHook(() => useContext(SessionContext), { wrapper })
    expect(result.current).toEqual('session')
  })
})

describe('useSession', () => {
  beforeEach(() => {
    mock(useFetch).mockReturnValue(['session', { loading: false }])
  })

  it('should throw if context is used outside a Provider', () => {
    const { result } = renderHook(() => useSession())
    expect(result.error?.message).toBe('No session found')
  })

  it('should return session', () => {
    const { result } = renderHook(() => useSession(), { wrapper })
    expect(result.current).toBe('session')
  })
})
