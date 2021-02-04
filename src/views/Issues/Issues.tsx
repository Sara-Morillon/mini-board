import { differenceInDays, format } from 'date-fns'
import React, { CSSProperties } from 'react'
import { Plus } from 'react-feather'
import { Table } from 'reactstrap'
import { Issue } from '../../models/Issue'
import { colors } from '../Board/Ticket'

const bulletStyle: CSSProperties = {
  display: 'inline-block',
  width: '1rem',
  height: '1rem',
  borderRadius: '0.5rem',
}

export interface IIssuesProps {
  issues: Issue[]
  projectId: string
}

export default function Issues({ issues, projectId }: IIssuesProps): JSX.Element {
  return (
    <Table striped>
      <caption className="text-right" style={{ captionSide: 'top' }}>
        <a href={`/project/${projectId}/issues/edit`}>
          <Plus size="1rem" className="mb-1" /> Create issue
        </a>
      </caption>
      <thead>
        <tr>
          <th>Title</th>
          <th>Author</th>
          <th>Due date</th>
          <th>Creation date</th>
        </tr>
      </thead>
      <tbody>
        {!issues.length && (
          <tr>
            <td className="text-muted p-5" colSpan={4}>
              No issue found
            </td>
          </tr>
        )}
        {issues.map((issue) => (
          <tr key={issue.id}>
            <td>
              <a href={`/project/${projectId}/issues/edit/${issue.id}`}>
                <span style={bulletStyle} className={`bg-${colors[issue.type]}`} /> {issue.title}
              </a>
            </td>
            <td>{issue.author.username}</td>
            <td className={differenceInDays(issue.release.dueDate, new Date()) <= 7 ? 'text-danger' : ''}>
              {format(issue.release.dueDate, 'PPP')}
            </td>
            <td>{format(issue.createdAt, 'PPP')}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}
