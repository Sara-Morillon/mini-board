import React from 'react'
import { Trash } from 'react-feather'
import { Card, CardBody, CardLink, CardTitle } from 'reactstrap'
import { Attachment } from '../../models/Attachment'

export interface IAttachmentProps {
  projectId: string
  issueId: number
  attachment: Attachment
}

export function AttachmentCard({ projectId, issueId, attachment }: IAttachmentProps): JSX.Element {
  const downloadLink = `/project/${projectId}/attachments/download/${attachment.id}`
  const src = /image\/.*/.test(attachment.mime) ? downloadLink : '/empty.png'

  return (
    <Card key={attachment.id} className="d-inline-block" style={{ maxWidth: 200 }}>
      <a className="attachment-asset" href={downloadLink} target="_blank" rel="noreferrer">
        <img src={src} alt={attachment.filename} />
      </a>
      <CardBody>
        <CardTitle>{attachment.filename}</CardTitle>
        <CardLink href={`/project/${projectId}/attachments/delete/${attachment.id}?issueId=${issueId}`}>
          <Trash size={16} className="mb-1" /> Delete
        </CardLink>
      </CardBody>
    </Card>
  )
}
