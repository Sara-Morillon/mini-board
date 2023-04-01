import { useFetch } from '@saramorillon/hooks'
import React, { useCallback, useState } from 'react'
import { useTitle } from '../../hooks/useTitle'
import { IIssue, Status } from '../../models/Issue'
import { getBoard } from '../../services/board'
import { moveIssue, saveIssue } from '../../services/issue'
import { Ticket } from '../components/Ticket'

export function Board(): JSX.Element {
  useTitle('Board')
  const [issues, state, refresh] = useFetch(getBoard, [])
  const [loading, setLoading] = useState(false)

  const onMove = useCallback(
    async (source: IIssue, target: IIssue, status: Status) => {
      if (source.id !== target.id || source.status !== status) {
        setLoading(true)
        if (source.status !== status) await saveIssue({ ...source, status })
        if (source.id !== target.id) await moveIssue(source.id, target.id)
        refresh()
        setLoading(false)
      }
    },
    [refresh]
  )

  return (
    <div className="relative">
      {(state.loading || loading) && (
        <div className="absolute top-0 right-0 bottom-0 left-0 p4" style={{ zIndex: 1, fontSize: '3rem' }}>
          <div aria-busy aria-label="Loading..." />
        </div>
      )}
      <table className="mt2" style={{ tableLayout: 'fixed', opacity: state.loading || loading ? 0.5 : 1 }}>
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
