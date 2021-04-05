import React from 'react'
import { Badge } from 'reactstrap'
import { Issue } from '../../models/Issue'
import { colors } from '../Board/Ticket'

export function IssueStatus({ issue }: { issue: Issue }): JSX.Element {
  return (
    <Badge className="float-right ml-2" color={colors[issue.status]}>
      {issue.status.toUpperCase()}
    </Badge>
  )
}
