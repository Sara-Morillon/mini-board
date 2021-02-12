import { Issue, Status } from '../models/Issue'

export function noop(): void {
  // do nothing
}

interface IDragProps {
  draggable: true
  className: 'drag-item'
  'data-drag-id': number
  'data-drag-status': Status
  'data-drag-priority': number
}

export function dragProps(issue: Issue): IDragProps {
  return {
    draggable: true,
    className: 'drag-item',
    'data-drag-id': issue.id,
    'data-drag-status': issue.status,
    'data-drag-priority': issue.priority,
  }
}

interface IDropProps {
  className: 'drop-item'
  'data-drop-status'?: Status
  'data-drop-priority': number
  'data-project-id': string
}

export function dropProps(projectId: string, priority: number, status?: Status): IDropProps {
  return {
    className: 'drop-item',
    'data-drop-status': status,
    'data-drop-priority': priority,
    'data-project-id': projectId,
  }
}

interface IDragImageProps {
  id: string
}

export function dragImageProps(issue: Issue): IDragImageProps {
  return { id: `drag-image-${issue.id}` }
}
