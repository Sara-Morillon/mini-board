import React from 'react'
import { Badge, Card, CardBody, CardLink, CardSubtitle, CardTitle } from 'reactstrap'
import { Issue, Status, Type } from '../../models/Issue'

export const colors: { [key in Type]: string } = {
  bug: 'danger',
  feature: 'warning',
}

export interface ITicketProps {
  status: Status
  issue: Issue
  projectId: string
}

export function Ticket({ status, issue, projectId }: ITicketProps): JSX.Element | null {
  if (status !== issue.status) {
    return null
  }

  return (
    <Card className="board-ticket" color={colors[issue.type]} outline draggable data-id={issue.id}>
      <CardBody>
        <Badge className="float-right" color="light">
          {issue.points}
        </Badge>
        <CardTitle tag="h5">{issue.title}</CardTitle>
        <CardSubtitle tag="h6" className="mb-2 text-muted">
          {issue.description.substr(0, 50)}
        </CardSubtitle>
        <CardLink href={`/project/${projectId}/issues/edit/${issue.id}`}>Open</CardLink>
      </CardBody>
    </Card>
  )
}
