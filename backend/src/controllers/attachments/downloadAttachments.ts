import archiver from 'archiver'
import { Request, Response } from 'express'
import path from 'path'
import { z } from 'zod'
import { config } from '../../config'
import { start } from '../../libs/logger'
import { prisma } from '../../prisma'

const schema = {
  query: z.object({
    issueId: z.string().transform(Number),
  }),
}

export async function downloadAttachments(req: Request, res: Response): Promise<void> {
  const { success, failure } = start('download_attachments', { req })
  try {
    const { issueId } = schema.query.parse(req.query)
    const attachments = await prisma.attachment.findMany({ where: { issueId } })
    if (!attachments.length) {
      res.sendStatus(404)
    } else {
      const archive = archiver('zip')
      archive.pipe(res)
      for (const attachment of attachments) {
        archive.file(path.join(config.uploadDir, attachment.filepath), { name: attachment.filename })
      }
      res.set('Content-disposition', `attachment; filename=${issueId}_attachments.zip`)
      res.set('Content-Type', 'application/zip')
      await archive.finalize()
    }
    success()
  } catch (error) {
    res.sendStatus(500)
    failure(error)
  }
}
