import { Issue, Status } from '../models/Issue'

export function noop(): void {
  // do nothing
}

interface IDragProps {
  draggable: true
  className: 'board-ticket'
  'data-drag-id': number
  'data-drag-status': Status
  'data-drag-priority': number
}

export function dragProps(issue: Issue): IDragProps {
  return {
    draggable: true,
    className: 'board-ticket',
    'data-drag-id': issue.id,
    'data-drag-status': issue.status,
    'data-drag-priority': issue.priority,
  }
}

interface IDropProps {
  className: 'board-cell'
  'data-drop-status': Status
  'data-drop-priority': number
  'data-project-id': string
}

export function dropProps(status: Status, priority: number, projectId: string): IDropProps {
  return {
    className: 'board-cell',
    'data-drop-status': status,
    'data-drop-priority': priority,
    'data-project-id': projectId,
  }
}
