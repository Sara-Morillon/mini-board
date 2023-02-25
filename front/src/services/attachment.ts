import { IAttachment } from '../models/Attachment'
import { Axios } from './Axios'

export async function getAttachments(issueId: number): Promise<IAttachment[]> {
  const { data } = await Axios.get<IAttachment[]>(`/api/issues/${issueId}/attachments`)
  return data
}

export async function saveAttachments(issueId: number, files: File[] | FileList | null): Promise<void> {
  if (files && files.length) {
    const data = new FormData()
    for (const file of files) {
      data.append('files', file)
    }
    await Axios.post(`/api/issues/${issueId}/attachments`, data)
  }
}

export async function deleteAttachment(attachment: IAttachment): Promise<void> {
  await Axios.delete(`/api/attachments/${attachment.id}`)
}
