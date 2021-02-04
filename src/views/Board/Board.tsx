import { format } from 'date-fns'
import React, { CSSProperties } from 'react'
import { Alert, Table } from 'reactstrap'
import { Issue, Status } from '../../models/Issue'
import { Release } from '../../models/Release'
import { Ticket } from './Ticket'

const oddStyle: CSSProperties = {
  backgroundColor: '#fafafa',
}

function cellProps(issue: Issue, status: Status, projectId: string) {
  return {
    className: 'board-cell',
    'data-priority': issue.priority,
    'data-status': status,
    'data-projectid': projectId,
  }
}

export interface IBoardProps {
  release?: Release
  issues: Issue[]
  projectId: string
}

export default function Board({ release, issues, projectId }: IBoardProps): JSX.Element {
  if (!release) {
    return (
      <Alert color="info" fade={false}>
        No suitable release found
      </Alert>
    )
  }

  return (
    <Table style={{ tableLayout: 'fixed' }}>
      <caption style={{ captionSide: 'top' }}>
        <strong>{release.name}</strong> ({format(release.dueDate, 'PPP')})
      </caption>
      <thead>
        <tr>
          <th>To do</th>
          <th style={oddStyle}>Doing</th>
          <th>Done</th>
        </tr>
      </thead>
      <tbody>
        {issues.map((issue) => (
          <tr key={issue.id}>
            <td {...cellProps(issue, 'to do', projectId)}>
              <Ticket issue={issue} status="to do" projectId={projectId} />
            </td>
            <td style={oddStyle} {...cellProps(issue, 'doing', projectId)}>
              <Ticket issue={issue} status="doing" projectId={projectId} />
            </td>
            <td {...cellProps(issue, 'done', projectId)}>
              <Ticket issue={issue} status="done" projectId={projectId} />
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}
