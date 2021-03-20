import React from 'react'
import { Plus } from 'react-feather'
import { Release } from '../../models/Release'
import { IssuesTable } from './IssuesTable'
import { IssuesToggle } from './IssuesToggle'

export interface IIssuesProps {
  all: 'true' | ''
  releases: Release[]
  projectId: string
}

export default function Issues({ all, releases, projectId }: IIssuesProps): JSX.Element {
  return (
    <>
      <div className="text-right mb-3">
        <a href={`/project/${projectId}/issues/edit`}>
          <Plus size="1rem" className="mb-1" /> Create issue
        </a>
      </div>
      <IssuesToggle all={all} projectId={projectId} />
      {!releases.length && <div className="text-muted bg-light p-5">No issue found</div>}
      {releases.map((release) => (
        <IssuesTable key={release.id} release={release} projectId={projectId} />
      ))}
    </>
  )
}
