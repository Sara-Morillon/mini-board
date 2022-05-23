import { Button, Callout, Classes, Divider, FormGroup, H5, TextArea } from '@blueprintjs/core'
import { useFetch } from '@saramorillon/hooks'
import React, { FormEvent, useCallback, useState } from 'react'
import { IComment } from '../../models/Comment'
import { deleteComment, getComments, saveComment } from '../../services/comment'
import { LoadContainer } from './LoadContainer'

interface ICommentsProps {
  issueId: number
}

export function Comments({ issueId }: ICommentsProps) {
  const fetch = useCallback(() => getComments(issueId), [issueId])
  const [comments, { loading }, refresh] = useFetch(fetch, [])

  const [content, setContent] = useState('')

  const onSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault()
      saveComment(issueId, content)
        .then(refresh)
        .then(() => setContent(''))
    },
    [issueId, content, refresh]
  )

  return (
    <>
      <Divider className="my2" />
      <h3>Comments</h3>
      <LoadContainer loading={loading}>
        {comments.map((comment) => (
          <Comment key={comment.id} comment={comment} refresh={refresh} />
        ))}
      </LoadContainer>
      <Divider className="my1" />
      <form name="add-comment" onSubmit={onSubmit}>
        <FormGroup>
          <TextArea
            placeholder="Add a comment"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            fill
          ></TextArea>
        </FormGroup>
        <Button type="submit" className="right">
          Send
        </Button>
      </form>
    </>
  )
}

interface ICommentProps {
  comment: IComment
  refresh: () => void
}

function Comment({ comment, refresh }: ICommentProps): JSX.Element {
  const onDelete = useCallback(() => {
    deleteComment(comment).then(refresh)
  }, [comment, refresh])

  return (
    <Callout className="my1">
      <H5>
        {comment.author.username} <small className={Classes.TEXT_MUTED}>{comment.createdAt}</small>
      </H5>
      <Button small minimal icon="trash" onClick={onDelete} className="right">
        Delete
      </Button>
      <p>{comment.content}</p>
    </Callout>
  )
}
