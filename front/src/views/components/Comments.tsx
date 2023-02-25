import { useFetch } from '@saramorillon/hooks'
import { IconTrash } from '@tabler/icons'
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
      return saveComment(issueId, content)
        .then(refresh)
        .then(() => setContent(''))
    },
    [issueId, content, refresh]
  )

  return (
    <>
      <hr className="my2" />
      <h3>Comments</h3>
      <LoadContainer loading={loading}>
        {comments.map((comment) => (
          <Comment key={comment.id} comment={comment} refresh={refresh} />
        ))}
      </LoadContainer>
      <form name="add-comment" onSubmit={onSubmit}>
        <label>
          <textarea placeholder="Add a comment" value={content} onChange={(e) => setContent(e.target.value)} required />
        </label>
        <button type="submit" className="right">
          Send
        </button>
      </form>
    </>
  )
}

interface ICommentProps {
  comment: IComment
  refresh: () => void
}

function Comment({ comment, refresh }: ICommentProps): JSX.Element {
  const onDelete = useCallback(() => deleteComment(comment).then(refresh), [comment, refresh])

  return (
    <article className="my1">
      <h5>
        {comment.author.username} <small>{comment.createdAt}</small>
      </h5>
      <button onClick={onDelete} className="right">
        <IconTrash /> Delete
      </button>
      <p>{comment.content}</p>
    </article>
  )
}
