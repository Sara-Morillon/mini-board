import { Card, Classes, Divider, H5, Tag } from '@blueprintjs/core'
import { useDrag, useDrop, useFetch } from '@saramorillon/hooks'
import c from 'classnames'
import { format, parseISO } from 'date-fns'
import React, { useCallback, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { colors } from '../../colors'
import { useParams } from '../../hooks/useParams'
import { IIssue, IIssueFull } from '../../models/Issue'
import { IRelease } from '../../models/Release'
import { getIssues, moveIssue } from '../../services/issue'
import { getReleases } from '../../services/release'
import { CreateButton } from '../components/CreateButton'
import { LoadContainer } from '../components/LoadContainer'

export function Releases(): JSX.Element {
  const { projectId } = useParams()
  const fetch = useCallback(() => getReleases(projectId), [projectId])
  const [releases, state, refresh] = useFetch(fetch, [])
  const [loading, setLoading] = useState(false)

  const onMove = useCallback(
    (source: IIssue, target: IIssue) => {
      if (source.id !== target.id) {
        setLoading(true)
        moveIssue(source.id, target.id)
          .then(refresh)
          .finally(() => setLoading(false))
      }
    },
    [refresh]
  )

  return (
    <>
      <div className="clearfix">
        <CreateButton to={`/project/${projectId}/release`}>Create release</CreateButton>
      </div>
      <LoadContainer loading={loading || state.loading}>
        {releases.map((release) => (
          <Release key={release.id} release={release} projectId={projectId} onMove={onMove} />
        ))}
      </LoadContainer>
    </>
  )
}

interface IReleaseProps {
  release: IRelease
  projectId: number
  onMove: (source: IIssueFull, target: IIssueFull) => void
}

function Release({ release, projectId, onMove }: IReleaseProps) {
  const fetch = useCallback(() => getIssues(projectId, release.id), [projectId, release.id])
  const [{ issues }, { loading }] = useFetch(fetch, { issues: [], total: 0 })

  const totalPoints = issues.reduce((acc, curr) => acc + curr.points, 0)
  const donePoints = issues.filter((issue) => issue.status === 'done').reduce((acc, curr) => acc + curr.points, 0)

  const points = `${issues.length} issue${issues.length > 1 ? 's' : ''} | ${donePoints}/${totalPoints} points`
  const dueDate = format(parseISO(release.dueDate), 'PP')

  return (
    <>
      <H5 className="mt2">
        <small className={c(Classes.TEXT_MUTED, 'right')}>{points}</small>
        <b className="mr1">
          <Link to={`/project/${projectId}/release/${release.id}`}>{release.name}</Link>
        </b>
        <small className={Classes.TEXT_MUTED}>{dueDate}</small>
      </H5>
      <LoadContainer loading={loading}>
        {issues.map((issue) => (
          <IssueCard key={issue.id} issue={issue} projectId={projectId} onMove={onMove} />
        ))}
      </LoadContainer>
      <Divider className="my2" />
    </>
  )
}

interface IIssueCardProps {
  issue: IIssueFull
  projectId: number
  onMove: (source: IIssueFull, target: IIssueFull) => void
}

function IssueCard({ issue, projectId, onMove }: IIssueCardProps) {
  const source = useMemo(() => JSON.stringify(issue), [issue])
  const onDrop = useCallback((data: string) => onMove(JSON.parse(data), issue), [onMove, issue])
  const [isDragged, dragEvents] = useDrag(source)
  const [isOver, dropEvents] = useDrop(onDrop)

  const opacity = isOver ? 0.7 : isDragged ? 0.5 : 1

  return (
    <Card
      data-testid="issue"
      {...dragEvents}
      {...dropEvents}
      draggable
      style={{ opacity }}
      className="flex items-center p1"
    >
      <Tag intent={colors.types[issue.type]} round className="mr1" />
      <div className="truncate flex-auto mr1">
        <Link to={`/project/${projectId}/issue/${issue.id}`}>
          [{issue.project.key}-{issue.id}] {issue.title}
        </Link>
      </div>
      <small className={c(Classes.TEXT_MUTED, 'nowrap mr1')}>{format(parseISO(issue.createdAt), 'PP')}</small>
      <Tag intent={colors.statuses[issue.status]} minimal style={{ minWidth: 45 }}>
        {issue.status.toUpperCase()}
      </Tag>
    </Card>
  )
}
