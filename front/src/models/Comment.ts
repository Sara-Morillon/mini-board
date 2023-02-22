import { IUser } from './User'

export interface IComment {
  id: number
  content: string
  author: IUser
  createdAt: string
}
