import { IApp } from '../models/App'
import { request } from './wrapper'

export async function getApp(): Promise<IApp | null> {
  return request<IApp | null>({ url: '/api/app' }, null)
}
