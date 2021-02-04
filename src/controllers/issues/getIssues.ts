import { Request, Response } from 'express'
import { Issue } from '../../models/Issue'

export type Req = Request<{ projectId: string }>

export async function getIssues(req: Req, res: Response): Promise<void> {
  const { projectId } = req.params
  const issues = await Issue.getRepository().find({
    where: { project: { id: projectId } },
    order: { updatedAt: 'DESC' },
    relations: ['release', 'author'],
  })
  res.render('Issues/Issues', { issues })
}
