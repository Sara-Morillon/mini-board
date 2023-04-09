import { format, parseISO } from 'date-fns'
import React, { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTitle } from '../../hooks/useTitle'
import { IRelease } from '../../models/Release'
import { getReleases } from '../../services/release'
import { CreateButton } from '../components/CreateButton'
import { FetchContainer } from '../components/FetchContainer'
import { NotFound } from '../components/Helpers'

export function Releases(): JSX.Element {
  useTitle('Releases')

  const [all, setAll] = useState(false)
  const fetch = useCallback(() => getReleases(all), [all])

  return (
    <>
      <CreateButton to="/release">Create release</CreateButton>

      <label className="mt0">
        <input type="checkbox" checked={all} onChange={(e) => setAll(e.target.checked)} /> Show all releases
      </label>

      <FetchContainer
        fetchFn={fetch}
        defaultValue={[]}
        loadingMessage="Loading releases"
        errorMessage="An error occurred while loading releases"
        notFoundMessage="Releases not found"
      >
        {(releases) => <ReleasesTable releases={releases} />}
      </FetchContainer>
    </>
  )
}

interface IReleasesTableProps {
  releases: IRelease[]
}

function ReleasesTable({ releases }: IReleasesTableProps): JSX.Element {
  if (!releases.length) {
    return (
      <div className="center">
        <NotFound message="No release found" />
      </div>
    )
  }

  return (
    <table className="mt2">
      <thead>
        <tr>
          <th>Name</th>
          <th>Due date</th>
        </tr>
      </thead>
      <tbody>
        {releases.map((release) => (
          <tr key={release.id}>
            <td>
              <Link to={`/release/${release.id}`}>{release.name}</Link>
            </td>
            <td>
              <small>{format(parseISO(release.dueDate), 'PP')}</small>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
