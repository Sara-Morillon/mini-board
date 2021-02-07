import React, { CSSProperties } from 'react'
import { Badge, Card, CardBody, CardSubtitle, CardTitle } from 'reactstrap'
import { Issue, Status, Type } from '../../models/Issue'

export const colors: { [key in Type]: string } = {
  bug: 'danger',
  feature: 'warning',
}

const ellipsis: CSSProperties = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
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
      <CardBody className="p-2" style={ellipsis}>
        <Badge className="float-right" color="light">
          {issue.points}
        </Badge>
        <CardTitle className="font-weight-bold" style={ellipsis}>
          <a href={`/project/${projectId}/issues/edit/${issue.id}`}>{issue.title}</a>
        </CardTitle>
        {issue.status !== 'done' && (
          <CardSubtitle className="text-muted" style={ellipsis}>
            {issue.description}
          </CardSubtitle>
        )}
      </CardBody>
    </Card>
  )
}
