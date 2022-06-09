import { useFetch } from '@saramorillon/hooks'
import { IconDownload, IconTrash, IconUpload } from '@tabler/icons'
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
      <hr className="my2" />
      <h3>
        <div className="flex right">
          <label className="mr1 relative add-attachments">
            <small>
              <IconUpload /> Add attachments
            </small>
            <input
              type="file"
              className="absolute left-0 right-0 top-0 bottom-0 m0"
              multiple
              onChange={addAttachments}
            />
          </label>
          {attachments.length > 0 && (
            <a href={`/api/attachments?issueId=${issueId}`}>
              <small>
                <IconDownload /> Download all
              </small>
            </a>
          )}
        </div>
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
    <article className="m1 center">
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
        <button onClick={onDelete}>
          <IconTrash />
        </button>
      </p>
    </article>
  )
}
