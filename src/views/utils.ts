import { Status } from '../models/Issue'

export function noop(): void {
  // do nothing
}

interface IDragProps {
  draggable: true
  'data-drag-item': string
}

export interface IDragTarget {
  id: number
  projectId: string
  releaseId: number
  priority: number
  status: Status
}

export function dragProps(target: IDragTarget): IDragProps {
  return {
    draggable: true,
    'data-drag-item': JSON.stringify(target),
  }
}

interface IDropProps {
  'data-droppable': true
  'data-drop-target': string
}

export interface IDropTarget {
  releaseId: number
  priority: number
  status?: Status
}

export function dropProps(target: IDropTarget): IDropProps {
  return {
    'data-droppable': true,
    'data-drop-target': JSON.stringify(target),
  }
}
