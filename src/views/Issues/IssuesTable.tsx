import React from 'react'
import { Card, CardBody } from 'reactstrap'
import { Issue } from '../../models/Issue'
import { Release } from '../../models/Release'
import { ReleaseName } from '../Releases/ReleaseName'
import { ReleasePoints } from '../Releases/ReleasePoints'
import { dragProps, dropProps, IDragTarget, IDropTarget } from '../utils'
import { IssueDesc } from './IssueDesc'
import { IssueName } from './IssueName'
import { IssuePoints } from './IssuePoints'
import { IssueStatus } from './IssueStatus'
import { IssueType } from './IssueType'

export interface IIssuesTableProps {
  release: Release
  projectId: string
}

export function IssuesTable({ release, projectId }: IIssuesTableProps): JSX.Element {
  return (
    <>
      <div className="float-right">
        <ReleasePoints release={release} />
      </div>
      <ReleaseName release={release} />
      {!release.issues.length && <DropRow target={{ releaseId: release.id, priority: 0 }} />}
      <div>
        {release.issues.map((issue) => (
          <IssueRow key={issue.id} projectId={projectId} release={release} issue={issue} />
        ))}
      </div>
    </>
  )
}

interface IDropRowProps {
  target: IDropTarget
}

function DropRow({ target }: IDropRowProps) {
  return <div {...dropProps(target)} style={{ height: 42 }} />
}

interface IIssueRowProps {
  projectId: string
  release: Release
  issue: Issue
}

function IssueRow({ projectId, release, issue }: IIssueRowProps) {
  const dragTarget: IDragTarget = {
    id: issue.id,
    projectId,
    releaseId: release.id,
    priority: issue.priority,
    status: issue.status,
  }
  const dropTarget: IDropTarget = { releaseId: release.id, priority: issue.priority }
  return (
    <Card className="issue-row" {...dragProps(dragTarget)} {...dropProps(dropTarget)}>
      <CardBody className="p-2">
        <IssueType issue={issue} /> <IssueName projectId={projectId} issue={issue} /> <IssueDesc issue={issue} />
        <span className="float-right">
          <IssueStatus issue={issue} /> <IssuePoints issue={issue} />
        </span>
      </CardBody>
    </Card>
  )
}
