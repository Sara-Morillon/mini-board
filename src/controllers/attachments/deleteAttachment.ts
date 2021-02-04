import { Request, Response } from 'express'
import { promises as fs } from 'fs'
import path from 'path'
import { config } from '../../config'
import { Attachment } from '../../models/Attachment'

export type Req = Request<{ projectId: string; id: string }, unknown, unknown, { issueId: string }>

export async function deleteAttachment(req: Req, res: Response): Promise<void> {
  const { id, projectId } = req.params
  const { issueId } = req.query
  const attachment = await Attachment.getRepository().findOne(id)
  if (attachment) {
    await fs.unlink(path.join(config.uploadDir, attachment.filepath))
  }
  await Attachment.getRepository().delete(id)
  res.redirect(`/project/${projectId}/issues/edit/${issueId}`)
}
