import { Request, Response } from 'express'
import { z } from 'zod'
import { start } from '../../libs/logger'
import { prisma } from '../../prisma'

const schema = {
  params: z.object({
    id: z.string().transform(Number),
  }),
}

export async function getAttachments(req: Request, res: Response): Promise<void> {
  const { success, failure } = start('get_attachments', { req })
  try {
    const { id } = schema.params.parse(req.params)
    const attachments = await prisma.attachment.findMany({ where: { issueId: id }, orderBy: { createdAt: 'asc' } })
    res.json(attachments)
    success()
  } catch (error) {
    res.sendStatus(500)
    failure(error)
  }
}
