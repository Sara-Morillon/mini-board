import { Request, Response } from 'express'
import fs from 'fs'
import path from 'path'
import { config } from '../../config'
import { Attachment } from '../../models/Attachment'

export type Req = Request<{ id: string }>

export async function downloadAttachment(req: Req, res: Response): Promise<void> {
  const { id } = req.params
  const attachment = await Attachment.getRepository().findOne(id)
  if (!attachment) {
    return res.render('404')
  }
  const stream = fs.createReadStream(path.join(config.uploadDir, attachment.filepath))
  res.set('Content-disposition', `filename=${attachment.filename}`)
  res.set('Content-Type', attachment?.mime)
  stream.pipe(res)
}
