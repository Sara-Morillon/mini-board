import { IReleaseFull } from '../models/Release'
import { Axios } from './Axios'

export async function getBoard(): Promise<IReleaseFull> {
  const { data } = await Axios.get<IReleaseFull>('/api/board')
  return data
}
