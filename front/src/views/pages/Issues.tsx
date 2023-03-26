import { useFetch, usePagination } from '@saramorillon/hooks'
import { IconChevronLeft, IconChevronRight, IconChevronsLeft, IconChevronsRight } from '@tabler/icons'
import { format, parseISO } from 'date-fns'
import React, { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTitle } from '../../hooks/useTitle'
import { typeIcons } from '../../models/Issue'
import { getIssues } from '../../services/issue'
import { CreateButton } from '../components/CreateButton'
import { LoadContainer } from '../components/LoadContainer'
import { ReleaseSelector } from '../components/ReleaseSelector'

const limit = 15

export function Issues() {
  useTitle('Issues')
  const [maxPage, setMaxPage] = useState(1)
  const { page, first, previous, next, last, canPrevious, canNext } = usePagination(maxPage)

  const [releaseId, setReleaseId] = useState<number>()

  const fetch = useCallback(() => getIssues(undefined, releaseId, page, limit), [releaseId, page])
  const [{ issues, total }, { loading }] = useFetch(fetch, { issues: [], total: 0 })

  useEffect(() => {
    setMaxPage(Math.ceil(total / limit))
  }, [setMaxPage, total])

  return (
    <>
      <div className="flex justify-between items-center">
        <ReleaseSelector
          value={releaseId}
          onChange={setReleaseId}
          selectProps={{ placeholder: 'All releases' }}
          labelProps={{ className: 'p1 mt1' }}
        />
        <CreateButton to={`/issue`}>Create issue</CreateButton>
      </div>
      <LoadContainer loading={loading}>
        <table className="mt2">
          <thead>
            <tr>
              <th>Type</th>
              <th>Title</th>
              <th>Created</th>
              <th>Release</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue) => (
              <tr key={issue.id}>
                <td>{typeIcons[issue.type]}</td>
                <td className="truncate" style={{ maxWidth: 0, width: '100%' }}>
                  <Link to={`/issue/${issue.id}`}>
                    [{issue.project.key}-{issue.id}] {issue.title}
                  </Link>
                </td>
                <td className="nowrap">
                  <small>{format(parseISO(issue.createdAt), 'PP')}</small>
                </td>
                <td className="nowrap">
                  <small>{issue.release.name}</small>
                </td>
                <td>
                  <mark className={issue.status}>{issue.status.toUpperCase()}</mark>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={5}>
                <div className="center">
                  <button disabled={!canPrevious} onClick={first}>
                    <IconChevronsLeft />
                  </button>
                  <button disabled={!canPrevious} onClick={previous}>
                    <IconChevronLeft />
                  </button>
                  <span className="mx1">
                    Page {page} of {maxPage}
                  </span>
                  <button disabled={!canNext} onClick={next}>
                    <IconChevronRight />
                  </button>
                  <button disabled={!canNext} onClick={last}>
                    <IconChevronsRight />
                  </button>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </LoadContainer>
    </>
  )
}
