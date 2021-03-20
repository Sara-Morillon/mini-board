import React from 'react'
import { Card, CardBody, CardSubtitle, CardTitle } from 'reactstrap'
import { Issue, Status, Type } from '../../models/Issue'
import { Release } from '../../models/Release'
import { IssueName } from '../Issues/IssueName'
import { IssuePoints } from '../Issues/IssuePoints'
import { dragProps, IDragTarget } from '../utils'

export const colors: { [key in Type | Status]: string } = {
  bug: 'danger',
  feature: 'warning',
  'to do': 'secondary',
  doing: 'primary',
  done: 'success',
}

export interface ITicketProps {
  status: Status
  issue: Issue
  projectId: string
  release: Release
}

export function Ticket({ status, issue, projectId, release }: ITicketProps): JSX.Element | null {
  if (status !== issue.status) {
    return null
  }

  const dragTarget: IDragTarget = {
    id: issue.id,
    projectId,
    releaseId: release.id,
    priority: issue.priority,
    status: issue.status,
  }

  return (
    <Card color={colors[issue.type]} outline {...dragProps(dragTarget)}>
      <CardBody className="ellipsis p-2">
        <IssuePoints issue={issue} />
        <CardTitle className="ellipsis font-weight-bold">
          <IssueName projectId={projectId} issue={issue} />
        </CardTitle>
        {issue.status !== 'done' && <CardSubtitle className="ellipsis text-muted">{issue.description}</CardSubtitle>}
      </CardBody>
    </Card>
  )
}
