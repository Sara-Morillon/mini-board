import React from 'react'
import { Comment } from '../../models/Comment'
import { CommentCard } from './Comment'
import { CommentForm } from './CommentForm'

export interface ICommentsProps {
  projectId: string
  issueId: number
  comments?: Comment[]
}

export function Comments({ projectId, issueId, comments }: ICommentsProps): JSX.Element {
  return (
    <div>
      <hr className="my-4" />
      <h3>Comments</h3>
      {comments?.map((comment) => (
        <CommentCard key={comment.id} comment={comment} projectId={projectId} issueId={issueId} />
      ))}
      <CommentForm projectId={projectId} issueId={issueId} />
    </div>
  )
}
