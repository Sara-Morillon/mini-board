import { IPagination, usePagination } from '@saramorillon/hooks'
import { IconChevronLeft, IconChevronRight, IconChevronsLeft, IconChevronsRight } from '@tabler/icons'
import { format, parseISO } from 'date-fns'
import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTitle } from '../../hooks/useTitle'
import { IIssueFull, typeIcons } from '../../models/Issue'
import { getIssues } from '../../services/issue'
import { CreateButton } from '../components/CreateButton'
import { FetchContainer } from '../components/FetchContainer'
import { NotFound } from '../components/Helpers'
import { ReleaseSelector } from '../components/ReleaseSelector'

const limit = 15

export function Issues() {
  useTitle('Issues')

  const [maxPage, setMaxPage] = useState(1)
  const pagination = usePagination(maxPage)
  const [releaseId, setReleaseId] = useState<number>()

  const fetch = useCallback(() => getIssues(undefined, releaseId, pagination.page, limit), [releaseId, pagination.page])

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
      <FetchContainer
        fetchFn={fetch}
        defaultValue={null}
        loadingMessage="Loading issues"
        errorMessage="An error occurred while loading issues"
        notFoundMessage="Issues not found"
      >
        {({ issues, total }) => (
          <IssuesTable
            issues={issues}
            total={total}
            pagination={pagination}
            maxPage={maxPage}
            setMaxPage={setMaxPage}
          />
        )}
      </FetchContainer>
    </>
  )
}

interface IIssuesTableProps {
  issues: IIssueFull[]
  total: number
  pagination: IPagination
  maxPage: number
  setMaxPage: Dispatch<SetStateAction<number>>
}

export function IssuesTable({ issues, total, pagination, maxPage, setMaxPage }: IIssuesTableProps): JSX.Element {
  useEffect(() => {
    setMaxPage(Math.ceil(total / limit))
  }, [setMaxPage, total])

  if (!issues.length) {
    return (
      <div className="center">
        <NotFound message="No issue found" />
      </div>
    )
  }

  return (
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
              <button disabled={!pagination.canPrevious} onClick={pagination.first}>
                <IconChevronsLeft />
              </button>
              <button disabled={!pagination.canPrevious} onClick={pagination.previous}>
                <IconChevronLeft />
              </button>
              <span className="mx1">
                Page {pagination.page} of {maxPage}
              </span>
              <button disabled={!pagination.canNext} onClick={pagination.next}>
                <IconChevronRight />
              </button>
              <button disabled={!pagination.canNext} onClick={pagination.last}>
                <IconChevronsRight />
              </button>
            </div>
          </td>
        </tr>
      </tfoot>
    </table>
  )
}
