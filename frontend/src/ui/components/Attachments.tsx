import { Button, Card, Colors, Divider, Icon } from '@blueprintjs/core'
import { useFetch } from '@saramorillon/hooks'
import React, { ChangeEvent, useCallback } from 'react'
import { IAttachment } from '../../models/Attachment'
import { deleteAttachment, getAttachments, saveAttachments } from '../../services/attachment'
import { LoadContainer } from './LoadContainer'

interface IAttachementsProps {
  issueId: number
}

export function Attachments({ issueId }: IAttachementsProps) {
  const fetch = useCallback(() => getAttachments(issueId), [issueId])
  const [attachments, { loading }, refresh] = useFetch(fetch, [])

  const addAttachments = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      saveAttachments(issueId, e.target.files).then(refresh)
    },
    [issueId, refresh]
  )

  return (
    <>
      <Divider className="my2" />
      <h3>
        {attachments.length > 0 && (
          <a href={`/api/attachments?issueId=${issueId}`} className="right">
            <small>
              <Icon icon="download" /> Download all
            </small>
          </a>
        )}
        <label className="right mr1 relative" style={{ cursor: 'pointer', color: Colors.BLUE5 }}>
          <small>
            <Icon icon="upload" /> Add attachments
          </small>
          <input
            type="file"
            className="absolute left-0 right-0"
            style={{ opacity: 0, fontSize: 0 }}
            multiple
            onChange={addAttachments}
          />
        </label>
        Attachments
      </h3>
      <LoadContainer loading={loading}>
        <div className="flex items-stretch">
          {attachments.map((attachment) => (
            <Attachment key={attachment.id} attachment={attachment} refresh={refresh} />
          ))}
        </div>
      </LoadContainer>
    </>
  )
}

interface IAttachmentProps {
  attachment: IAttachment
  refresh: () => void
}

function Attachment({ attachment, refresh }: IAttachmentProps): JSX.Element {
  const downloadLink = `/api/attachments/${attachment.id}`
  const src = /image\/.*/.test(attachment.mime) ? downloadLink : '/empty.png'

  const onDelete = useCallback(() => {
    deleteAttachment(attachment).then(refresh)
  }, [attachment, refresh])

  return (
    <Card className="m1 center" interactive>
      <a
        href={downloadLink}
        target="_blank"
        rel="noreferrer"
        className="block"
        style={{
          width: '100%',
          height: 100,
          backgroundImage: `url(${src})`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      <p>
        <span
          className="inline-block truncate"
          title={attachment.filename}
          style={{ width: 75, verticalAlign: 'middle' }}
        >
          {attachment.filename}
        </span>
        <Button small minimal icon="trash" onClick={onDelete} />
      </p>
    </Card>
  )
}
