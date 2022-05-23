import { IUser } from '../models/User'
import { request } from './wrapper'

export async function getUsers(): Promise<IUser[]> {
  return request<IUser[]>({ url: '/api/users' }, [])
}

export async function postUser(username: string, password: string): Promise<void> {
  return request({ url: '/api/users', method: 'POST', data: { username, password } }, undefined)
}

export async function deleteUser(user: IUser): Promise<void> {
  return request({ url: `/api/users/${user.username}`, method: 'DELETE' }, undefined)
}
