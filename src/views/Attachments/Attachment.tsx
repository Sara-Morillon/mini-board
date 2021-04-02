import React from 'react'
import { Download, Trash } from 'react-feather'
import { Card, CardBody, CardImg, CardLink, CardTitle } from 'reactstrap'
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
    <Card key={attachment.id} className="d-inline-block">
      <CardBody>
        <CardImg top src={src} alt={attachment.filename} />
        <CardTitle>{attachment.filename}</CardTitle>
        <CardLink href={downloadLink}>
          <Download size={16} className="mb-1" /> Download
        </CardLink>
        <CardLink href={`/project/${projectId}/attachments/delete/${attachment.id}?issueId=${issueId}`}>
          <Trash size={16} className="mb-1" /> Delete
        </CardLink>
      </CardBody>
    </Card>
  )
}
