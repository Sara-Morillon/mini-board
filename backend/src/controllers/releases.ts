import { Request, Response } from 'express'
import { z } from 'zod'
import { start } from '../libs/logger'
import { prisma } from '../prisma'

const schema = {
  list: z.object({
    projectId: z.string().transform(Number),
  }),
  get: z.object({
    id: z.string().transform(Number),
  }),
  post: z.object({
    projectId: z.number(),
    name: z.string(),
    dueDate: z.string(),
  }),
  patch: z.object({
    name: z.string(),
    dueDate: z.string(),
  }),
}

export async function getReleases(req: Request, res: Response): Promise<void> {
  const { success, failure } = start('get_releases', { req })
  try {
    const { projectId } = schema.list.parse(req.query)
    const releases = await prisma.release.findMany({
      where: { projectId },
      orderBy: { dueDate: 'desc' },
    })
    res.json(releases)
    success()
  } catch (error) {
    res.sendStatus(500)
    failure(error)
  }
}

export async function postRelease(req: Request, res: Response): Promise<void> {
  const { success, failure } = start('post_release', { req })
  try {
    const { projectId, name, dueDate } = schema.post.parse(req.body)
    const release = await prisma.release.create({ data: { projectId, name, dueDate } })
    res.status(201).json(release.id)
    success()
  } catch (error) {
    res.sendStatus(500)
    failure(error)
  }
}

export async function getRelease(req: Request, res: Response): Promise<void> {
  const { success, failure } = start('get_release', { req })
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
  const { success, failure } = start('put_release', { req })
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
  const { success, failure } = start('delete_release', { req })
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
