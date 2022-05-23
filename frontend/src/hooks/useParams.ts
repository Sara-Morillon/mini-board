import { useParams as useRouterParams } from 'react-router-dom'

export function useParams(): { projectId: number; id?: string } {
  const params = useRouterParams<{ projectId: string; id: string }>()
  const projectId = Number(params.projectId)
  if (!projectId) throw new Error('Invalid project id')
  return { projectId, id: params.id }
}
