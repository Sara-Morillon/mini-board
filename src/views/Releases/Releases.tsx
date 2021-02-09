import { differenceInDays, format } from 'date-fns'
import React from 'react'
import { Plus } from 'react-feather'
import { Table } from 'reactstrap'
import { Release } from '../../models/Release'
import { ReleasePoints } from './ReleasePoints'

export interface IReleasesProps {
  releases: Release[]
  projectId: string
}

export default function Releases({ releases, projectId }: IReleasesProps): JSX.Element {
  return (
    <>
      <Table striped className="mb-0">
        <caption className="text-right" style={{ captionSide: 'top' }}>
          <a href={`/project/${projectId}/releases/edit`}>
            <Plus size="1rem" className="mb-1" /> Create release
          </a>
        </caption>
        <thead>
          <tr>
            <th>Name</th>
            <th>Creation date</th>
            <th>Due date</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {releases.map((release) => (
            <tr key={release.id}>
              <td>
                <a href={`/project/${projectId}/releases/edit/${release.id}`}>{release.name}</a>
              </td>
              <td>{format(release.createdAt, 'PPP')}</td>
              <td className={differenceInDays(release.dueDate, new Date()) <= 7 ? 'text-danger' : ''}>
                {format(release.dueDate, 'PPP')}
              </td>
              <td>
                <ReleasePoints release={release} />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {!releases.length && <div className="text-muted bg-light p-5">No release found</div>}
    </>
  )
}
