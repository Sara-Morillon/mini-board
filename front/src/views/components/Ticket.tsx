import { useDrag, useDrop } from '@saramorillon/hooks'
import React, { useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { IIssueFull, Status } from '../../models/Issue'

interface ITicketProps {
  status: Status
  issue: IIssueFull
  onMove: (source: IIssueFull, target: IIssueFull, status: Status) => void
}

export function Ticket({ status, issue, onMove }: ITicketProps): JSX.Element | null {
  const source = useMemo(() => JSON.stringify(issue), [issue])
  const onDrop = useCallback((data: string) => onMove(JSON.parse(data), issue, status), [onMove, issue, status])
  const [isDragged, dragEvents] = useDrag(source)
  const [isOver, dropEvents] = useDrop(onDrop)
  const draggable = status === issue.status

  return (
    <article
      data-testid="ticket"
      {...dragEvents}
      {...dropEvents}
      draggable={draggable}
      className={`mb0 ticket ${isOver ? 'over' : ''} ${isDragged ? 'dragged' : ''} ${draggable ? issue.type : ''}`}
    >
      {draggable && (
        <>
          <mark className="right" data-variant="pill">
            {issue.points}
          </mark>
          <h5 className="truncate">
            <Link to={`/issue/${issue.id}`}>
              [{issue.project.key}-{issue.id}] {issue.title}
            </Link>
          </h5>
        </>
      )}
    </article>
  )
}
