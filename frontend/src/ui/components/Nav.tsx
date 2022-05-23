import { Tab, Tabs } from '@blueprintjs/core'
import React, { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useParams } from '../../hooks/useParams'

export function Nav(): JSX.Element | null {
  const { projectId } = useParams()
  const navigate = useNavigate()

  const onTabChange = useCallback((tabId: string) => navigate(`/project/${projectId}/${tabId}`), [navigate, projectId])

  const { pathname } = useLocation()
  const page = pathname.includes('release')
    ? 'releases'
    : pathname.includes('issue')
    ? 'issues'
    : pathname.includes('board')
    ? 'board'
    : ''

  return (
    <nav className="my2 flex justify-between items-center">
      <Tabs animate large selectedTabId={page} onChange={onTabChange}>
        <Tab id="releases" title="Releases" />
        <Tab id="issues" title="Issues" />
        <Tab id="board" title="Board" />
        <Tab id="" title="Edit" />
      </Tabs>
    </nav>
  )
}
