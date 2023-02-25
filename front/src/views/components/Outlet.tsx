import { useFetch } from '@saramorillon/hooks'
import React, { useCallback, useContext } from 'react'
import { Navigate, Outlet, useParams } from 'react-router-dom'
import { SessionContext } from '../../contexts/SessionContext'
import { useTitle } from '../../hooks/useTitle'
import { getProject } from '../../services/project'
import { Footer } from './Footer'
import { Header } from './Header'
import { LoadContainer } from './LoadContainer'
import { Nav } from './Nav'

export function PublicOutlet(): JSX.Element {
  const session = useContext(SessionContext)
  if (session) return <Navigate to="/" />
  return (
    <>
      <main className="mx-auto max-width-2" style={{ minHeight: 'calc(100vh - 162px - 96px)' }}>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export function PrivateOutlet(): JSX.Element {
  const session = useContext(SessionContext)
  if (!session) return <Navigate to="/login" />
  return (
    <>
      <Header />
      <main className="mx-auto" style={{ minHeight: 'calc(100vh - 162px - 96px - 55px)', minWidth: '60rem' }}>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export function NavOutlet() {
  const { projectId } = useParams()
  const fetch = useCallback(() => getProject(projectId), [projectId])
  const [project, { loading }] = useFetch(fetch, null)
  useTitle(project?.name || '')

  return (
    <LoadContainer loading={loading}>
      <Nav />
      <Outlet />
    </LoadContainer>
  )
}
