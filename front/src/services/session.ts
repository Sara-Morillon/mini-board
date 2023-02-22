import axios from 'axios'
import { IUser } from '../models/User'
import { request } from './wrapper'

export function getSession(): Promise<IUser | null> {
  return axios
    .get<IUser>(`/api/session`, { withCredentials: true })
    .then((res) => res.data)
    .catch(() => null)
}

export function login(username: string, password: string): Promise<void> {
  return request({ url: `/api/login`, method: 'POST', data: { username, password } }, undefined)
}

export async function logout(): Promise<void> {
  await request({ url: `/api/logout` }, undefined)
  window.location.reload()
}
