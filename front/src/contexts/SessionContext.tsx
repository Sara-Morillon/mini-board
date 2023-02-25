import { useFetch } from '@saramorillon/hooks'
import React, { createContext, PropsWithChildren, useContext } from 'react'
import { ISession } from '../models/Session'
import { getSession } from '../services/session'

export const SessionContext = createContext<ISession | null>(null)

export function SessionProvider({ children }: PropsWithChildren<unknown>): JSX.Element {
  const [session, { loading }] = useFetch<ISession | null>(getSession, null)

  if (loading) {
    return <div aria-busy aria-label="Loading..." />
  }

  return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>
}

export function useSession(): ISession {
  const session = useContext(SessionContext)
  if (!session) {
    throw new Error('Cannot use session outside SessionContext')
  }
  return session
}
