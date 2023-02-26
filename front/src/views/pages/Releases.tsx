import { useDrag, useDrop, useFetch } from '@saramorillon/hooks'
import c from 'classnames'
import { format, parseISO } from 'date-fns'
import React, { useCallback, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { IIssue, IIssueFull } from '../../models/Issue'
import { IRelease } from '../../models/Release'
import { getIssues, moveIssue } from '../../services/issue'
import { getReleases } from '../../services/release'
import { CreateButton } from '../components/CreateButton'
import { LoadContainer } from '../components/LoadContainer'

export function Releases(): JSX.Element {
  const [releases, state, refresh] = useFetch(getReleases, [])
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
        <CreateButton to={`/release`}>Create release</CreateButton>
      </div>
      <LoadContainer loading={loading || state.loading}>
        {releases.map((release) => (
          <Release key={release.id} release={release} onMove={onMove} />
        ))}
      </LoadContainer>
    </>
  )
}

interface IReleaseProps {
  release: IRelease
  onMove: (source: IIssueFull, target: IIssueFull) => void
}

function Release({ release, onMove }: IReleaseProps) {
  const fetch = useCallback(() => getIssues(undefined, release.id), [release.id])
  const [{ issues }, { loading }] = useFetch(fetch, { issues: [], total: 0 })

  const totalPoints = issues.reduce((acc, curr) => acc + curr.points, 0)
  const donePoints = issues.filter((issue) => issue.status === 'done').reduce((acc, curr) => acc + curr.points, 0)

  const points = `${issues.length} issue${issues.length > 1 ? 's' : ''} | ${donePoints}/${totalPoints} points`
  const dueDate = format(parseISO(release.dueDate), 'PP')

  return (
    <>
      <h4 className="mt2">
        <small className="right">{points}</small>
        <b className="mr1">
          <Link to={`/release/${release.id}`}>{release.name}</Link>
        </b>
        <small>{dueDate}</small>
      </h4>
      <LoadContainer loading={loading}>
        {issues.map((issue) => (
          <IssueCard key={issue.id} issue={issue} onMove={onMove} />
        ))}
      </LoadContainer>
    </>
  )
}

interface IIssueCardProps {
  issue: IIssueFull
  onMove: (source: IIssueFull, target: IIssueFull) => void
}

function IssueCard({ issue, onMove }: IIssueCardProps) {
  const source = useMemo(() => JSON.stringify(issue), [issue])
  const onDrop = useCallback((data: string) => onMove(JSON.parse(data), issue), [onMove, issue])
  const [isDragged, dragEvents] = useDrag(source)
  const [isOver, dropEvents] = useDrop(onDrop)

  const opacity = isOver ? 0.7 : isDragged ? 0.5 : 1

  return (
    <article
      data-testid="issue"
      {...dragEvents}
      {...dropEvents}
      draggable
      style={{ opacity }}
      className="flex items-center p1 m0"
    >
      <span className={c('mr1', issue.type)} />
      <div className="truncate flex-auto mr1">
        <Link to={`/project/${issue.projectId}/issue/${issue.id}`}>
          [{issue.project.key}-{issue.id}] {issue.title}
        </Link>
      </div>
      <small className="nowrap mr1">{format(parseISO(issue.createdAt), 'PP')}</small>
      <mark className={issue.status}>{issue.status.toUpperCase()}</mark>
    </article>
  )
}
