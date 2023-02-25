import { IUser } from '../models/User'
import { Axios } from './Axios'

export async function getUsers(): Promise<IUser[]> {
  const { data } = await Axios.get<IUser[]>(`/api/users`)
  return data
}

export async function postUser(username: string, password: string): Promise<void> {
  await Axios.post(`/api/users`, { username, password })
}

export async function deleteUser(attachment: IUser): Promise<void> {
  await Axios.delete(`/api/users/${attachment.id}`)
}
