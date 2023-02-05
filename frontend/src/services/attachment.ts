import { IAttachment } from '../models/Attachment'
import { request } from './wrapper'

function makeUrl(issueId: number) {
  return `/api/issues/${issueId}/attachments`
}

export async function getAttachments(issueId: number): Promise<IAttachment[]> {
  return request<IAttachment[]>({ url: makeUrl(issueId) }, [])
}

export async function saveAttachments(issueId: number, files: File[]): Promise<void> {
  if (files.length) {
    const data = new FormData()
    for (const file of files) {
      if (file) data.append('files', file)
    }
    await request<string | null>({ url: makeUrl(issueId), method: 'POST', data }, null)
  }
}

export async function deleteAttachment(attachment: IAttachment): Promise<void> {
  await request({ url: `/api/attachments/${attachment.id}`, method: 'DELETE' }, undefined)
}
