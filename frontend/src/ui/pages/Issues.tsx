import { useFetch, usePagination } from '@saramorillon/hooks'
import { IconChevronLeft, IconChevronRight, IconChevronsLeft, IconChevronsRight } from '@tabler/icons'
import c from 'classnames'
import { format, parseISO } from 'date-fns'
import React, { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useParams } from '../../hooks/useParams'
import { getIssues } from '../../services/issue'
import { CreateButton } from '../components/CreateButton'
import { LoadContainer } from '../components/LoadContainer'
import { ReleaseSelector } from '../components/ReleaseSelector'

const limit = 10

export function Issues() {
  const { page, maxPage, setMaxPage, first, previous, next, last, canPrevious, canNext } = usePagination()
  const { projectId } = useParams()
  const [releaseId, setReleaseId] = useState<number>()
  const fetch = useCallback(() => getIssues(projectId, releaseId, page, limit), [projectId, releaseId, page])
  const [{ issues, total }, { loading }] = useFetch(fetch, { issues: [], total: 0 })

  useEffect(() => {
    setMaxPage(Math.ceil(total / limit))
  }, [setMaxPage, total])

  return (
    <>
      <div className="flex justify-between items-center">
        <ReleaseSelector
          projectId={projectId}
          value={releaseId}
          onChange={setReleaseId}
          placeholder="All releases"
          className="p1 mt1"
        />
        <CreateButton to={`/project/${projectId}/issue`}>Create issue</CreateButton>
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
                <td>
                  <span title={issue.type} className={c('mr1', issue.type)} />
                </td>
                <td className="truncate" style={{ maxWidth: 0, width: '100%' }}>
                  <Link to={`/project/${projectId}/issue/${issue.id}`}>
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
