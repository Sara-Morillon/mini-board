import { useFetch } from '@saramorillon/hooks'
import React, { createContext, PropsWithChildren, useContext } from 'react'
import { IUser } from '../models/User'
import { getSession } from '../services/session'
import { LoadContainer } from '../ui/components/LoadContainer'

export const SessionContext = createContext<IUser | null>(null)

export function SessionProvider({ children }: PropsWithChildren<unknown>): JSX.Element {
  const [session, { loading }] = useFetch<IUser | null>(getSession, null)

  return (
    <SessionContext.Provider value={session}>
      <LoadContainer loading={loading} className="m4">
        {children}
      </LoadContainer>
    </SessionContext.Provider>
  )
}

export function useSession(): IUser {
  const session = useContext(SessionContext)
  if (!session) {
    throw new Error('No session found')
  }
  return session
}
