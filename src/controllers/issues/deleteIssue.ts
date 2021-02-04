import { Request, Response } from 'express'
import { promises as fs } from 'fs'
import path from 'path'
import { config } from '../../config'
import { Attachment } from '../../models/Attachment'
import { Issue } from '../../models/Issue'

export type Req = Request<{ projectId: string; id: string }>

export async function deleteIssue(req: Req, res: Response): Promise<void> {
  const { id, projectId } = req.params
  const attachments = await Attachment.getRepository().find({ where: { issue: { id } } })
  for (const attachment of attachments) {
    await fs.unlink(path.join(config.uploadDir, attachment.filepath))
  }
  await Issue.getRepository().delete(id)
  res.redirect(`/project/${projectId}/issues/list`)
}
