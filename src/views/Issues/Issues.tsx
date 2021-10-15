import React from 'react'
import { Plus } from 'react-feather'
import { Button, ButtonGroup } from 'reactstrap'
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
        <ButtonGroup>
          <Button as="a" color="link" href={`/project/${projectId}/issues/edit`}>
            <Plus size="1rem" className="mb-1" /> Create issue
          </Button>
        </ButtonGroup>
      </div>
      <IssuesToggle all={all} projectId={projectId} />
      {!releases.length && <div className="text-muted bg-light p-5">No issue found</div>}
      {releases.map((release) => (
        <IssuesTable key={release.id} release={release} projectId={projectId} />
      ))}
    </>
  )
}
