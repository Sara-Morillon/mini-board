import { format } from 'date-fns'
import React, { CSSProperties } from 'react'
import { Table } from 'reactstrap'
import { Issue } from '../../models/Issue'
import { Release } from '../../models/Release'
import { dropProps } from '../utils'
import { Ticket } from './Ticket'

const oddStyle: CSSProperties = {
  backgroundColor: '#fafafa',
}

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
            <td {...dropProps('to do', issue.priority, projectId)}>
              <Ticket issue={issue} status="to do" projectId={projectId} />
            </td>
            <td style={oddStyle} {...dropProps('doing', issue.priority, projectId)}>
              <Ticket issue={issue} status="doing" projectId={projectId} />
            </td>
            <td {...dropProps('done', issue.priority, projectId)}>
              <Ticket issue={issue} status="done" projectId={projectId} />
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}
