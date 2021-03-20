import React from 'react'
import { Badge } from 'reactstrap'
import { Issue } from '../../models/Issue'

export function IssuePoints({ issue }: { issue: Issue }): JSX.Element {
  return (
    <Badge className="issue-points float-right" color="light" pill>
      {issue.points}
    </Badge>
  )
}
