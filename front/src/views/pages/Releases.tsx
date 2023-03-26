import { useFetch } from '@saramorillon/hooks'
import { format, parseISO } from 'date-fns'
import React from 'react'
import { Link } from 'react-router-dom'
import { useTitle } from '../../hooks/useTitle'
import { getReleases } from '../../services/release'
import { CreateButton } from '../components/CreateButton'
import { LoadContainer } from '../components/LoadContainer'

export function Releases(): JSX.Element {
  useTitle('Releases')
  const [releases, { loading }] = useFetch(getReleases, [])

  return (
    <>
      <div className="clearfix">
        <CreateButton to={`/release`}>Create release</CreateButton>
      </div>

      <LoadContainer loading={loading}>
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
      </LoadContainer>
    </>
  )
}
