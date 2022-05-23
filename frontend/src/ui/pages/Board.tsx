import { HTMLTable, Tag } from '@blueprintjs/core'
import { useFetch } from '@saramorillon/hooks'
import React, { useCallback, useState } from 'react'
import { useParams } from '../../hooks/useParams'
import { IIssue, Status } from '../../models/Issue'
import { getIssues, moveIssue, saveIssue } from '../../services/issue'
import { CreateButton } from '../components/CreateButton'
import { LoadContainer } from '../components/LoadContainer'
import { ReleaseSelector } from '../components/ReleaseSelector'
import { Ticket } from '../components/Ticket'

export function Board(): JSX.Element {
  const { projectId } = useParams()
  const [releaseId, setReleaseId] = useState<number>()

  return (
    <>
      <CreateButton to={`/project/${projectId}/issue`}>Create issue</CreateButton>
      <div className="center">
        <ReleaseSelector projectId={projectId} onChange={setReleaseId} />
      </div>
      {releaseId && <BoardTable releaseId={releaseId} projectId={projectId} />}
    </>
  )
}

interface IBoardTableProps {
  releaseId: number
  projectId: number
}

function BoardTable({ releaseId, projectId }: IBoardTableProps): JSX.Element {
  const fetch = useCallback(() => getIssues(projectId, releaseId), [projectId, releaseId])
  const [{ issues }, state, refresh] = useFetch(fetch, { issues: [], total: 0 })
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
      <HTMLTable className="mt2" style={{ tableLayout: 'fixed', width: '100%', height: 1 }} striped bordered>
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
              <td style={{ height: '100%' }}>
                <Ticket issue={issue} status="todo" projectId={projectId} onMove={onMove} />
              </td>
              <td style={{ height: '100%' }}>
                <Ticket issue={issue} status="doing" projectId={projectId} onMove={onMove} />
              </td>
              <td style={{ height: '100%' }}>
                <Ticket issue={issue} status="done" projectId={projectId} onMove={onMove} />
              </td>
            </tr>
          ))}
        </tbody>
      </HTMLTable>
    </LoadContainer>
  )
}

interface ICountProps {
  issues: IIssue[]
  status: Status
}

function Count({ issues, status }: ICountProps) {
  const count = issues.filter((issue) => issue.status === status).length
  return (
    <Tag round minimal>
      {count}
    </Tag>
  )
}
