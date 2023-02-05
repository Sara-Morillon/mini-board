import { useFetch } from '@saramorillon/hooks'
import React, { useCallback, useContext } from 'react'
import { Navigate, Outlet, useParams } from 'react-router-dom'
import { SessionContext } from '../../contexts/SessionContext'
import { useTitle } from '../../hooks/useTitle'
import { getProject } from '../../services/project'
import { Login } from '../pages/Login'
import { Footer } from './Footer'
import { Header } from './Header'
import { LoadContainer } from './LoadContainer'
import { Nav } from './Nav'

export function PublicOutlet() {
  const session = useContext(SessionContext)
  if (session) return <Navigate to="/" />
  return <Login />
}

export function PrivateOutlet() {
  const session = useContext(SessionContext)
  if (!session) return <Navigate to="/login" />
  return (
    <>
      <Header />
      <main className="mx-auto flex-auto" style={{ minHeight: 'calc(100vh - 555px)', minWidth: '60rem' }}>
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
