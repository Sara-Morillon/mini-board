import { Request, Response } from 'express'
import fs from 'fs'
import path from 'path'
import { z } from 'zod'
import { config } from '../../config'
import { start } from '../../libs/logger'
import { prisma } from '../../prisma'

const schema = {
  params: z.object({
    id: z.string().transform(Number),
  }),
}

export async function downloadAttachment(req: Request, res: Response): Promise<void> {
  const { success, failure } = start('download_attachment', { req })
  try {
    const { id } = schema.params.parse(req.params)
    const attachment = await prisma.attachment.findUnique({ where: { id } })
    if (!attachment) {
      res.sendStatus(404)
    } else {
      const stream = fs.createReadStream(path.join(config.uploadDir, attachment.filepath))
      if (!attachment.mime.includes('image/')) {
        res.set('Content-disposition', `attachment; filename=${attachment.filename}`)
      }
      res.set('Content-Type', attachment.mime)
      stream.pipe(res)
    }
    success()
  } catch (error) {
    res.sendStatus(500)
    failure(error)
  }
}
