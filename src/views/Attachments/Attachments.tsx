import React from 'react'
import { Download } from 'react-feather'
import { CardDeck } from 'reactstrap'
import { Attachment } from '../../models/Attachment'
import { AttachmentCard } from './Attachment'

interface IDownloadProps {
  projectId: string
  issueId: number
}

function DownloadAll({ projectId, issueId }: IDownloadProps) {
  return (
    <a href={`/project/${projectId}/attachments/download?issueId=${issueId}`}>
      <small className="download float-right">
        <Download size={16} className="mb-1" /> Download all
      </small>
    </a>
  )
}

export interface IAttachmentsProps {
  projectId: string
  issueId: number
  attachments?: Attachment[]
}

export function Attachments({ projectId, issueId, attachments }: IAttachmentsProps): JSX.Element | null {
  if (!attachments?.length) {
    return null
  }

  return (
    <div>
      <hr className="my-4" />
      <h3>
        Attachments <DownloadAll projectId={projectId} issueId={issueId} />
      </h3>
      <CardDeck>
        {attachments.map((attachment) => (
          <AttachmentCard key={attachment.id} attachment={attachment} projectId={projectId} issueId={issueId} />
        ))}
      </CardDeck>
    </div>
  )
}
