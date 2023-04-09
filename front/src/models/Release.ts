import { IIssueFull } from './Issue'

export interface IRelease {
  id: number
  name: string
  dueDate: string
}

export interface IReleaseFull {
  id: number
  name: string
  dueDate: string
  issues: IIssueFull[]
}
