import React from 'react'
import { Issue } from '../../models/Issue'
import { colors } from '../Board/Ticket'

export function IssueType({ issue }: { issue: Issue }): JSX.Element {
  return <span className={`issue-type text-${colors[issue.type]}`}>&#x25cf;</span>
}
