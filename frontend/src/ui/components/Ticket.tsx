import { Callout, H5, Tag } from '@blueprintjs/core'
import { useDrag, useDrop } from '@saramorillon/hooks'
import React, { useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { colors } from '../../colors'
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

  let opacity = isOver ? 0.7 : 0
  if (status === issue.status) opacity = isDragged ? 0.5 : 1
  const cursor = isDragged ? 'grabbing' : 'grab'

  return (
    <Callout
      data-testid="ticket"
      {...dragEvents}
      {...dropEvents}
      draggable={status === issue.status}
      intent={isOver ? 'primary' : colors.types[issue.type]}
      style={{ height: '100%', opacity, cursor }}
      icon={null}
    >
      {status === issue.status && (
        <>
          <Tag className="right" round minimal>
            {issue.points}
          </Tag>
          <H5 className="truncate">
            <Link to={`/project/${projectId}/issue/${issue.id}`}>
              [{issue.project.key}-{issue.id}] {issue.title}
            </Link>
          </H5>
          <p className="truncate mt1 mb0">{issue.description}</p>
        </>
      )}
    </Callout>
  )
}
