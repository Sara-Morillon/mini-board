import { IIssueFull } from '../models/Issue'
import { Axios } from './Axios'

export async function getBoard(): Promise<IIssueFull[]> {
  const { data } = await Axios.get<IIssueFull[]>('/api/board')
  return data
}
