import { format } from 'date-fns'
import React from 'react'
import { Issue } from '../../models/Issue'

export function IssueDesc({ issue }: { issue: Issue }): JSX.Element {
  return (
    <small className="text-muted">
      Created on {format(issue.createdAt, 'PPP')} by {issue.author.username}
    </small>
  )
}
