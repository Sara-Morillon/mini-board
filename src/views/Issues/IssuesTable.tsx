import { differenceInDays, format } from 'date-fns'
import React, { CSSProperties } from 'react'
import { Table } from 'reactstrap'
import { Issue } from '../../models/Issue'
import { Release } from '../../models/Release'
import { colors } from '../Board/Ticket'
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
        <span className="float-right">{release.issues.reduce((acc, curr) => acc + curr.points, 0)} points</span>
        {release.name}{' '}
        <small className={differenceInDays(release.dueDate, new Date()) <= 7 ? 'text-danger' : ''}>
          {format(release.dueDate, 'PPP')}
        </small>
      </caption>
      <thead>
        <tr>
          <th>Title</th>
          <th>Author</th>
          <th>Creation date</th>
          <th>Points</th>
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
          </tr>
        ))}
      </tbody>
    </Table>
  )
}
