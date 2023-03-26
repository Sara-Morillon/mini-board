import archiver from 'archiver'
import { Request, Response } from 'express'
import fs from 'fs'
import path from 'path'
import { z } from 'zod'
import { prisma } from '../prisma'
import { settings } from '../settings'

const schema = {
  get: z.object({
    id: z.string().transform(Number),
  }),
  files: z.array(
    z.object({
      originalname: z.string(),
      filename: z.string(),
      mimetype: z.string(),
    })
  ),
  download: z.object({
    issueId: z.string().transform(Number),
  }),
}

export async function getAttachments(req: Request, res: Response): Promise<void> {
  const { success, failure } = req.logger.start('get_attachments')
  try {
    const { id } = schema.get.parse(req.params)
    const attachments = await prisma.attachment.findMany({ where: { issueId: id }, orderBy: { createdAt: 'asc' } })
    res.json(attachments)
    success()
  } catch (error) {
    res.sendStatus(500)
    failure(error)
  }
}

export async function postAttachments(req: Request, res: Response): Promise<void> {
  const { success, failure } = req.logger.start('post_attachment')
  try {
    if (!req.session.user) {
      res.sendStatus(401)
    } else {
      const { id } = schema.get.parse(req.params)
      const files = schema.files.parse(req.files)
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

export async function deleteAttachment(req: Request, res: Response): Promise<void> {
  const { success, failure } = req.logger.start('delete_attachment')
  try {
    const { id } = schema.get.parse(req.params)
    await prisma.attachment.delete({ where: { id } })
    res.sendStatus(204)
    success()
  } catch (error) {
    res.sendStatus(500)
    failure(error)
  }
}

export async function downloadAttachments(req: Request, res: Response): Promise<void> {
  const { success, failure } = req.logger.start('download_attachments')
  try {
    const { issueId } = schema.download.parse(req.query)
    const attachments = await prisma.attachment.findMany({ where: { issueId } })
    if (!attachments.length) {
      res.sendStatus(404)
    } else {
      const archive = archiver('zip')
      archive.pipe(res)
      for (const attachment of attachments) {
        archive.file(path.join(settings.uploadDir, attachment.filepath), { name: attachment.filename })
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

export async function downloadAttachment(req: Request, res: Response): Promise<void> {
  const { success, failure } = req.logger.start('download_attachment')
  try {
    const { id } = schema.get.parse(req.params)
    const attachment = await prisma.attachment.findUnique({ where: { id } })
    if (!attachment) {
      res.sendStatus(404)
    } else {
      const filepath = path.join(settings.uploadDir, attachment.filepath)
      try {
        await fs.promises.access(filepath, fs.constants.R_OK)
        const stream = fs.createReadStream(filepath)
        if (!attachment.mime.includes('image/')) {
          res.set('Content-disposition', `attachment; filename=${attachment.filename}`)
        }
        res.set('Content-Type', attachment.mime)
        stream.pipe(res)
      } catch (error) {
        res.sendStatus(404)
      }
    }
    success()
  } catch (error) {
    res.sendStatus(500)
    failure(error)
  }
}
