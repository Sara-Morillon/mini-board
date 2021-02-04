import { Request, Response } from 'express'
import { Attachment } from '../../models/Attachment'
import { Issue, Type } from '../../models/Issue'

export type Req = Request<
  { projectId: string; id: string },
  unknown,
  { title: string; type: Type; description: string; release: number; points: number }
>

function mapAttachment(id: number) {
  return function (file: Express.Multer.File) {
    return { issue: { id }, filename: file.originalname, filepath: file.filename, mime: file.mimetype }
  }
}

export async function saveIssue(req: Req, res: Response): Promise<void> {
  const { id } = req.params
  const { release } = req.body
  await Issue.getRepository().update({ release: { id: release } }, { priority: () => 'priority + 1' })
  if (id) {
    await updateIssue(req, res)
  } else {
    await createIssue(req, res)
  }
}

async function updateIssue(req: Req, res: Response): Promise<void> {
  const { id, projectId } = req.params
  const { release, ...body } = req.body
  await Issue.getRepository().update(id, { ...body, release: { id: release } })
  await Attachment.getRepository().save(Object.values(req.files).map(mapAttachment(Number(id))))
  res.redirect(`/project/${projectId}/issues/edit/${id}`)
}

async function createIssue(req: Req, res: Response): Promise<void> {
  const { projectId } = req.params
  const { release, ...body } = req.body
  const author = { id: req.user?.id }
  const issue = await Issue.getRepository().save({
    ...body,
    author,
    project: { id: Number(projectId) },
    release: { id: release },
  })
  await Attachment.getRepository().save(Object.values(req.files).map(mapAttachment(issue.id)))
  res.redirect(`/project/${projectId}/issues/edit/${issue.id}`)
}
