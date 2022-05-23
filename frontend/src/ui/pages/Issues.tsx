import { Button, ButtonGroup, Classes, HTMLTable, Tag } from '@blueprintjs/core'
import { useFetch, usePagination } from '@saramorillon/hooks'
import c from 'classnames'
import { format, parseISO } from 'date-fns'
import React, { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { colors } from '../../colors'
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
      <CreateButton to={`/project/${projectId}/issue`}>Create issue</CreateButton>
      <div className="center">
        <ReleaseSelector projectId={projectId} value={releaseId} onChange={setReleaseId} placeholder="All releases" />
      </div>
      <LoadContainer loading={loading}>
        <HTMLTable className="mt2" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th className="nowrap">Type</th>
              <th className="nowrap">Title</th>
              <th className="nowrap">Created</th>
              <th className="nowrap">Release</th>
              <th className="nowrap">Status</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue) => (
              <tr key={issue.id}>
                <td className="nowrap">
                  <Tag intent={colors.types[issue.type]} round title={issue.type} />
                </td>
                <td className="truncate" style={{ maxWidth: 0, width: '100%' }}>
                  <Link to={`/project/${projectId}/issue/${issue.id}`}>
                    [{issue.project.key}-{issue.id}] {issue.title}
                  </Link>
                </td>
                <td className="nowrap">
                  <small className={Classes.TEXT_MUTED}>{format(parseISO(issue.createdAt), 'PP')}</small>
                </td>
                <td className="nowrap">
                  <span className={c({ [Classes.TEXT_MUTED]: parseISO(issue.release.dueDate) < new Date() })}>
                    {issue.release.name}
                  </span>
                </td>
                <td>
                  <Tag intent={colors.statuses[issue.status]} minimal>
                    {issue.status.toUpperCase()}
                  </Tag>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={5}>
                <div className="center">
                  <ButtonGroup>
                    <Button disabled={!canPrevious} onClick={first} icon="chevron-backward" />
                    <Button disabled={!canPrevious} onClick={previous} icon="chevron-left" />
                    <Button disabled minimal>
                      Page {page} of {maxPage}
                    </Button>
                    <Button disabled={!canNext} onClick={next} icon="chevron-right" />
                    <Button disabled={!canNext} onClick={last} icon="chevron-forward" />
                  </ButtonGroup>
                </div>
              </td>
            </tr>
          </tfoot>
        </HTMLTable>
      </LoadContainer>
    </>
  )
}
