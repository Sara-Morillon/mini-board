import { IAttachment } from '../models/Attachment'
import { request } from './wrapper'

function makeUrl(issueId: number) {
  return `/api/issues/${issueId}/attachments`
}

export async function getAttachments(issueId: number): Promise<IAttachment[]> {
  return request<IAttachment[]>({ url: makeUrl(issueId) }, [])
}

export async function saveAttachments(issueId: number, files: FileList | null): Promise<void> {
  if (files) {
    const data = new FormData()
    for (let i = 0; i < files.length; i++) {
      const file = files.item(i)
      if (file) data.append('files', file)
    }
    await request<string | null>({ url: makeUrl(issueId), method: 'POST', data }, null)
  }
}

export async function deleteAttachment(attachment: IAttachment): Promise<void> {
  await request({ url: `/api/attachments/${attachment.id}`, method: 'DELETE' }, undefined)
}
