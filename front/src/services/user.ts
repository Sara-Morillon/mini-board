import { IUser } from '../models/User'
import { request } from './wrapper'

export function getUsers(): Promise<IUser[]> {
  return request<IUser[]>({ url: '/api/users' }, [])
}

export function postUser(username: string, password: string): Promise<void> {
  return request({ url: '/api/users', method: 'POST', data: { username, password } }, undefined)
}

export function deleteUser(user: IUser): Promise<void> {
  return request({ url: `/api/users/${user.username}`, method: 'DELETE' }, undefined)
}
