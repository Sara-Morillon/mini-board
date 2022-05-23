import { Classes, Colors } from '@blueprintjs/core'
import { Global } from '@emotion/react'
import { useFetch, useTheme } from '@saramorillon/hooks'
import c from 'classnames'
import React, { useCallback, useContext } from 'react'
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { SessionContext, SessionProvider } from '../contexts/SessionContext'
import { useParams } from '../hooks/useParams'
import { useTitle } from '../hooks/useTitle'
import { getProject } from '../services/project'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { LoadContainer } from './components/LoadContainer'
import { Nav } from './components/Nav'
import { Board } from './pages/Board'
import { Issue } from './pages/Issue'
import { Issues } from './pages/Issues'
import { Login } from './pages/Login'
import { Project } from './pages/Project'
import { Projects } from './pages/Projects'
import { Release } from './pages/Release'
import { Releases } from './pages/Releases'
import { User } from './pages/User'
import { Users } from './pages/Users'

export function App(): JSX.Element | null {
  const theme = useTheme()

  return (
    <div className={c({ [Classes.DARK]: theme === 'dark' })}>
      <Global styles={{ body: { backgroundColor: theme === 'dark' ? Colors.DARK_GRAY1 : undefined } }} />
      <SessionProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<PublicRoute />} />
            <Route element={<PrivateRoute />}>
              <Route path="/projects" element={<Projects />} />
              <Route path="/project" element={<Project />} />
              <Route path="/project/:projectId" element={<NavRoute />}>
                <Route index element={<Project />} />
                <Route path="releases" element={<Releases />} />
                <Route path="release" element={<Release />} />
                <Route path="release/:id" element={<Release />} />
                <Route path="issues" element={<Issues />} />
                <Route path="issue" element={<Issue />} />
                <Route path="issue/:id" element={<Issue />} />
                <Route path="board" element={<Board />} />
              </Route>
              <Route path="/users" element={<Users />} />
              <Route path="/user" element={<User />} />
            </Route>
            <Route path="*" element={<Navigate to="/projects" replace />} />
          </Routes>
        </BrowserRouter>
      </SessionProvider>
    </div>
  )
}

function PublicRoute() {
  const session = useContext(SessionContext)
  if (session) return <Navigate to="/" />
  return <Login />
}

function PrivateRoute() {
  const session = useContext(SessionContext)
  if (!session) return <Navigate to="/login" />
  return (
    <div className="flex flex-column items-stretch" style={{ minHeight: '100vh' }}>
      <Header />
      <div className="py2 max-width-4 mx-auto flex-auto" style={{ minWidth: '60rem' }}>
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}

function NavRoute() {
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
