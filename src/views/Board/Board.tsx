import React from 'react'
import { Table } from 'reactstrap'
import { Issue, Status } from '../../models/Issue'
import { Release } from '../../models/Release'
import { ReleaseName } from '../Releases/ReleaseName'
import { dropProps, IDropTarget } from '../utils'
import { Ticket } from './Ticket'

export interface IBoardProps {
  release?: Release
  issues: Issue[]
  projectId: string
}

export default function Board({ release, issues, projectId }: IBoardProps): JSX.Element {
  if (!release) {
    return <div className="text-muted bg-light p-5">No suitable release found</div>
  }

  return (
    <Table className="board">
      <caption>
        <ReleaseName release={release} />
      </caption>
      <thead>
        <tr>
          <th>To do</th>
          <th>Doing</th>
          <th>Done</th>
        </tr>
      </thead>
      <tbody>
        {issues.map((issue) => (
          <IssueRow key={issue.id} projectId={projectId} release={release} issue={issue} />
        ))}
      </tbody>
    </Table>
  )
}

interface IIssueRowProps {
  projectId: string
  release: Release
  issue: Issue
}

function IssueRow({ projectId, release, issue }: IIssueRowProps) {
  function getDropTarget(status: Status): IDropTarget {
    return { releaseId: release.id, priority: issue.priority, status }
  }

  return (
    <tr key={issue.id}>
      <td {...dropProps(getDropTarget('to do'))}>
        <Ticket issue={issue} status="to do" projectId={projectId} release={release} />
      </td>
      <td {...dropProps(getDropTarget('doing'))}>
        <Ticket issue={issue} status="doing" projectId={projectId} release={release} />
      </td>
      <td {...dropProps(getDropTarget('done'))}>
        <Ticket issue={issue} status="done" projectId={projectId} release={release} />
      </td>
    </tr>
  )
}
