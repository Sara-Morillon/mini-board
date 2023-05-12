import { IProject } from './Project'
import { IRelease } from './Release'
import { IUser } from './User'

export const types = ['bug', 'feature'] as const
export type Type = (typeof types)[number]

export const typeIcons: { [t in Type]: string } = {
  bug: '🔴',
  feature: '🟡',
}

export const statuses = ['todo', 'doing', 'done'] as const
export type Status = (typeof statuses)[number]

export interface IIssue {
  id: number
  priority: number
  projectId: number
  releaseId: number | null
  authorId: number
  type: Type
  status: Status
  points: number
  title: string
  description: string
  createdAt: string
}

export interface IIssueFull extends IIssue {
  project: IProject
  release: IRelease | null
  author: IUser
}
