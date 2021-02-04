import archiver from 'archiver'
import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import path from 'path'
import { config } from '../../config'
import { Attachment } from '../../models/Attachment'

export type Req = Request<ParamsDictionary, unknown, unknown, { issueId: string }>

export async function downloadAttachments(req: Req, res: Response): Promise<void> {
  const { issueId } = req.query
  const attachments = await Attachment.getRepository().find({ where: { issue: { id: issueId } } })
  const archive = archiver('zip')
  archive.pipe(res)
  for (const attachment of attachments) {
    archive.file(path.join(config.uploadDir, attachment.filepath), { name: attachment.filename })
  }
  res.set('Content-disposition', `attachment; filename=attachments.zip`)
  res.set('Content-Type', 'application/zip')
  archive.finalize()
}
