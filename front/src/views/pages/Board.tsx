import { format, parseISO } from 'date-fns'
import React, { useCallback, useState } from 'react'
import { useTitle } from '../../hooks/useTitle'
import { IIssue, IIssueFull, Status } from '../../models/Issue'
import { getBoard } from '../../services/board'
import { moveIssue, saveIssue } from '../../services/issue'
import { FetchContainer } from '../components/FetchContainer'
import { Ticket } from '../components/Ticket'

export function Board(): JSX.Element {
  useTitle('Board')

  return (
    <FetchContainer
      fetchFn={getBoard}
      defaultValue={null}
      loadingMessage="Loading board"
      errorMessage="An error occurred while loading board"
      notFoundMessage="Release not found"
    >
      {(release, refresh) => (
        <>
          <h3 className="center mt0">
            {release.name} - {format(parseISO(release.dueDate), 'PP')}
          </h3>
          <IssuesTable releaseId={release.id} issues={release.issues} refresh={refresh} />
        </>
      )}
    </FetchContainer>
  )
}

interface IIssueTableProps {
  releaseId: number
  issues: IIssueFull[]
  refresh: () => void
}

function IssuesTable({ releaseId, issues, refresh }: IIssueTableProps) {
  const [loading, setLoading] = useState(false)

  const onMove = useCallback(
    async (source: IIssue, target: IIssue, status: Status) => {
      if (source.id !== target.id || source.status !== status) {
        setLoading(true)
        if (source.status !== status) await saveIssue({ ...source, status })
        if (source.id !== target.id) await moveIssue(releaseId, source.id, target.id)
        refresh()
        setLoading(false)
      }
    },
    [releaseId, refresh]
  )

  return (
    <div className="relative">
      {loading && <div aria-busy aria-label="Loading..." className="absolute right-0 top-0 left-0 bottom-0 p2" />}
      <table className="mt2" style={{ tableLayout: 'fixed', opacity: loading ? 0.3 : 1 }}>
        <thead>
          <tr>
            <th className="center">
              To do <Count issues={issues} status="todo" />
            </th>
            <th className="center">
              Doing <Count issues={issues} status="doing" />
            </th>
            <th className="center">
              Done <Count issues={issues} status="done" />
            </th>
          </tr>
        </thead>
        <tbody>
          {issues.map((issue) => (
            <tr key={issue.id}>
              <td style={{ height: 1 }}>
                <Ticket issue={issue} status="todo" onMove={onMove} />
              </td>
              <td style={{ height: 1 }}>
                <Ticket issue={issue} status="doing" onMove={onMove} />
              </td>
              <td style={{ height: 1 }}>
                <Ticket issue={issue} status="done" onMove={onMove} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

interface ICountProps {
  issues: IIssue[]
  status: Status
}

function Count({ issues, status }: ICountProps) {
  const count = issues.filter((issue) => issue.status === status).length
  return <mark data-variant="pill">{count}</mark>
}
