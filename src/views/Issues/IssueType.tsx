import React from 'react'
import { Badge } from 'reactstrap'
import { Issue } from '../../models/Issue'
import { colors } from '../Board/Ticket'

export function IssueType({ issue }: { issue: Issue }): JSX.Element {
  return (
    <Badge className={`text-${colors[issue.type]}`} color={colors[issue.type]} pill>
      &bull;
    </Badge>
  )
}
