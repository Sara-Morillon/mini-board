import { Request, Response } from 'express'
import { z } from 'zod'
import { prisma } from '../prisma'

const schema = {
  get: z.object({
    id: z.string().transform(Number),
  }),
  post: z.object({
    name: z.string(),
    dueDate: z.string(),
  }),
  patch: z.object({
    name: z.string(),
    dueDate: z.string(),
  }),
}

export async function getReleases(req: Request, res: Response): Promise<void> {
  const { success, failure } = req.logger.start('get_releases')
  try {
    const releases = await prisma.release.findMany({ orderBy: { dueDate: 'desc' } })
    res.json(releases)
    success()
  } catch (error) {
    res.sendStatus(500)
    failure(error)
  }
}

export async function postRelease(req: Request, res: Response): Promise<void> {
  const { success, failure } = req.logger.start('post_release')
  try {
    const { name, dueDate } = schema.post.parse(req.body)
    const release = await prisma.release.create({ data: { name, dueDate } })
    res.status(201).json(release.id)
    success()
  } catch (error) {
    res.sendStatus(500)
    failure(error)
  }
}

export async function getRelease(req: Request, res: Response): Promise<void> {
  const { success, failure } = req.logger.start('get_release')
  try {
    const { id } = schema.get.parse(req.params)
    const release = await prisma.release.findUnique({ where: { id } })
    res.json(release)
    success()
  } catch (error) {
    res.sendStatus(500)
    failure(error)
  }
}

export async function patchRelease(req: Request, res: Response): Promise<void> {
  const { success, failure } = req.logger.start('put_release')
  try {
    const { id } = schema.get.parse(req.params)
    const { name, dueDate } = schema.patch.parse(req.body)
    await prisma.release.update({ where: { id }, data: { name, dueDate } })
    res.status(200).json(id)
    success()
  } catch (error) {
    res.sendStatus(500)
    failure(error)
  }
}

export async function deleteRelease(req: Request, res: Response): Promise<void> {
  const { success, failure } = req.logger.start('delete_release')
  try {
    const { id } = schema.get.parse(req.params)
    await prisma.release.delete({ where: { id } })
    res.sendStatus(204)
    success()
  } catch (error) {
    res.sendStatus(500)
    failure(error)
  }
}
