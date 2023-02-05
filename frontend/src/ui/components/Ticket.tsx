import { useDrag, useDrop } from '@saramorillon/hooks'
import c from 'classnames'
import React, { useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { IIssueFull, Status } from '../../models/Issue'

interface ITicketProps {
  status: Status
  issue: IIssueFull
  projectId: number
  onMove: (source: IIssueFull, target: IIssueFull, status: Status) => void
}

export function Ticket({ status, issue, projectId, onMove }: ITicketProps): JSX.Element | null {
  const source = useMemo(() => JSON.stringify(issue), [issue])
  const onDrop = useCallback((data: string) => onMove(JSON.parse(data), issue, status), [onMove, issue, status])
  const [isDragged, dragEvents] = useDrag(source)
  const [isOver, dropEvents] = useDrop(onDrop)

  return (
    <article
      data-testid="ticket"
      {...dragEvents}
      {...dropEvents}
      draggable={status === issue.status}
      className={c('mb0', 'ticket', { over: isOver, dragged: isDragged, [issue.type]: status === issue.status })}
    >
      {status === issue.status && (
        <>
          <mark className="right" data-variant="pill">
            {issue.points}
          </mark>
          <h5 className="truncate">
            <Link to={`/project/${projectId}/issue/${issue.id}`}>
              [{issue.project.key}-{issue.id}] {issue.title}
            </Link>
          </h5>
          <p className="truncate mt1 mb0">{issue.description}</p>
        </>
      )}
    </article>
  )
}
