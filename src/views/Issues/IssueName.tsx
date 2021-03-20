import React from 'react'
import { Issue } from '../../models/Issue'

export function IssueName({ projectId, issue }: { projectId: string; issue: Issue }): JSX.Element {
  return (
    <a href={`/project/${projectId}/issues/edit/${issue.id}`}>
      {issue.key} {issue.title}
    </a>
  )
}
