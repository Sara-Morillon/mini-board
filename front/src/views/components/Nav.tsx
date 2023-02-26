import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useParams } from '../../hooks/useParams'

export function Nav(): JSX.Element | null {
  const { projectId } = useParams()

  const { pathname } = useLocation()
  const page = pathname.includes('release')
    ? 'releases'
    : pathname.includes('issue')
    ? 'issues'
    : pathname.includes('board')
    ? 'board'
    : ''

  return (
    <div role="tablist">
      <Link role="tab" aria-selected={page === 'releases'} to={`/releases`}>
        Releases
      </Link>
      <Link role="tab" aria-selected={page === 'issues'} to={`/project/${projectId}/issues`}>
        Issues
      </Link>
      <Link role="tab" aria-selected={page === 'board'} to={`/project/${projectId}/board`}>
        Board
      </Link>
      <Link role="tab" aria-selected={page === ''} to={`/project/${projectId}`}>
        Edit
      </Link>
    </div>
  )
}
