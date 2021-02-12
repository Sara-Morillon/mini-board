import { format } from 'date-fns'
import React, { CSSProperties } from 'react'
import { Move } from 'react-feather'
import { Badge, Table } from 'reactstrap'
import { Release } from '../../models/Release'
import { colors } from '../Board/Ticket'
import { ReleaseName } from '../Releases/ReleaseName'
import { ReleasePoints } from '../Releases/ReleasePoints'
import { dragImageProps, dragProps, dropProps } from '../utils'

const bulletStyle: CSSProperties = {
  display: 'inline-block',
  width: '1rem',
  height: '1rem',
  borderRadius: '0.5rem',
}

const moveStyle: CSSProperties = {
  cursor: 'pointer',
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
          <th></th>
          <th>Title</th>
          <th>Author</th>
          <th>Creation date</th>
          <th>Points</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {release.issues.map((issue) => (
          <tr key={issue.id} {...dropProps(projectId, issue.priority)} {...dragImageProps(issue)}>
            <td>
              <span {...dragProps(issue)}>
                <Move style={moveStyle} />
              </span>
            </td>
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
