import { useFetch } from '@saramorillon/hooks'
import React, { useCallback, useState } from 'react'
import { useTitle } from '../../hooks/useTitle'
import { IIssue, Status } from '../../models/Issue'
import { getBoard } from '../../services/board'
import { moveIssue, saveIssue } from '../../services/issue'
import { LoadContainer } from '../components/LoadContainer'
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
    <LoadContainer loading={loading || state.loading}>
      <table className="mt2" style={{ tableLayout: 'fixed' }}>
        <thead>
          <tr>
            <th>
              To do <Count issues={issues} status="todo" />
            </th>
            <th>
              Doing <Count issues={issues} status="doing" />
            </th>
            <th>
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
    </LoadContainer>
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
