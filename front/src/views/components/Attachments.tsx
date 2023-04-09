import { IconDownload, IconTrash, IconUpload } from '@tabler/icons'
import React, { useCallback } from 'react'
import { IAttachment } from '../../models/Attachment'
import { deleteAttachment, getAttachments, saveAttachments } from '../../services/attachment'
import { FetchContainer } from './FetchContainer'

interface IAttachementsProps {
  issueId: number
}

export function Attachments({ issueId }: IAttachementsProps) {
  const fetch = useCallback(() => getAttachments(issueId), [issueId])

  return (
    <>
      <hr className="my2" />
      <h3>Attachments</h3>
      <FetchContainer
        fetchFn={fetch}
        defaultValue={[]}
        loadingMessage="Loading attachments"
        errorMessage="An error occurred while loading attachments"
        notFoundMessage="Attachments not found"
      >
        {(attachments, refresh) => (
          <>
            <div className="flex justify-end">
              <label className="m0 mr1 relative add-attachments">
                <small>
                  <IconUpload /> Add attachments
                </small>
                <input
                  type="file"
                  className="absolute left-0 right-0 top-0 bottom-0 m0"
                  multiple
                  onChange={(e) => saveAttachments(issueId, e.target.files).then(refresh)}
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

            <div className="flex items-stretch">
              {attachments.map((attachment) => (
                <Attachment key={attachment.id} attachment={attachment} refresh={refresh} />
              ))}
            </div>
          </>
        )}
      </FetchContainer>
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

  const onDelete = useCallback(() => deleteAttachment(attachment).then(refresh), [attachment, refresh])

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
