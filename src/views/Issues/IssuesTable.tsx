import { format } from 'date-fns'
import React, { CSSProperties } from 'react'
import { Badge, Table } from 'reactstrap'
import { Issue } from '../../models/Issue'
import { Release } from '../../models/Release'
import { colors } from '../Board/Ticket'
import { ReleaseName } from '../Releases/ReleaseName'
import { ReleasePoints } from '../Releases/ReleasePoints'
import { dragProps, dropProps } from '../utils'

const bulletStyle: CSSProperties = {
  display: 'inline-block',
  width: '1rem',
  height: '1rem',
  borderRadius: '0.5rem',
}

function dragAndDropProps(issue: Issue, projectId: string) {
  const drags = dragProps(issue)
  const drops = dropProps(issue.status, issue.priority, projectId)
  return { ...drags, ...drops, className: drags.className + ' ' + drops.className }
}

export interface IIssuesTableProps {
  release: Release
  projectId: string
}

export function IssuesTable({ release, projectId }: IIssuesTableProps): JSX.Element {
  return (
    <Table striped>
      <caption style={{ captionSide: 'top' }}>
        <div className="float-right">
          <ReleasePoints release={release} />
        </div>
        <ReleaseName release={release} />
      </caption>
      <thead>
        <tr>
          <th>Title</th>
          <th>Author</th>
          <th>Creation date</th>
          <th>Points</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {release.issues.map((issue) => (
          <tr key={issue.id} {...dragAndDropProps(issue, projectId)}>
            <td>
              <a href={`/project/${projectId}/issues/edit/${issue.id}`}>
                <span style={bulletStyle} className={`bg-${colors[issue.type]}`} /> {issue.title}
              </a>
            </td>
            <td>{issue.author.username}</td>
            <td>{format(issue.createdAt, 'PPP')}</td>
            <td>{issue.points}</td>
            <td>
              <Badge color={colors[issue.status]}>{issue.status}</Badge>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}
