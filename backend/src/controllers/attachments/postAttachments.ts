import { Request, Response } from 'express'
import { z } from 'zod'
import { start } from '../../libs/logger'
import { prisma } from '../../prisma'

const schema = {
  params: z.object({
    id: z.string().transform(Number),
  }),
  body: z.object({
    files: z.array(
      z.object({
        originalname: z.string(),
        filename: z.string(),
        mimetype: z.string(),
      })
    ),
  }),
}

export async function postAttachments(req: Request, res: Response): Promise<void> {
  const { success, failure } = start('post_attachment', { req })
  try {
    if (!req.user) {
      res.sendStatus(401)
    } else {
      const { id } = schema.params.parse(req.params)
      const { files } = schema.body.parse(req.body)
      for (const file of files) {
        await prisma.attachment.create({
          data: { issueId: id, filename: file.originalname, filepath: file.filename, mime: file.mimetype },
        })
      }
      res.sendStatus(201)
    }
    success()
  } catch (error) {
    res.sendStatus(500)
    failure(error)
  }
}
