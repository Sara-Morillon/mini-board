import React from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { SessionProvider } from '../contexts/SessionContext'
import { NavOutlet, PrivateOutlet, PublicOutlet } from './components/Outlet'
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
  return (
    <SessionProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<PublicOutlet />}>
            <Route index element={<Login />} />
          </Route>

          <Route element={<PrivateOutlet />}>
            <Route path="/projects" element={<Projects />} />
            <Route path="/project" element={<Project />} />

            <Route path="/project/:projectId" element={<NavOutlet />}>
              <Route index element={<Project />} />

              <Route path="issues" element={<Issues />} />
              <Route path="issue" element={<Issue />} />
              <Route path="issue/:id" element={<Issue />} />

              <Route path="board" element={<Board />} />
            </Route>

            <Route path="/releases" element={<Releases />} />
            <Route path="/release" element={<Release />} />
            <Route path="/release/:id" element={<Release />} />

            <Route path="/users" element={<Users />} />
            <Route path="/user" element={<User />} />
          </Route>

          <Route path="*" element={<Navigate to="/projects" />} />
        </Routes>
      </BrowserRouter>
    </SessionProvider>
  )
}
