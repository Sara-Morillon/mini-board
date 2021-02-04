import { format } from 'date-fns'
import React from 'react'
import { Trash } from 'react-feather'
import { Card, CardBody, CardLink, CardText, CardTitle } from 'reactstrap'
import { Comment } from '../../models/Comment'

export interface ICommentProps {
  projectId: string
  issueId: number
  comment: Comment
}

export function CommentCard({ projectId, issueId, comment }: ICommentProps): JSX.Element {
  return (
    <Card key={comment.id} className="mb-4">
      <CardBody>
        <CardTitle tag="h6">
          {comment.author.username} <small>{format(comment.createdAt, 'PPP')}</small>
        </CardTitle>
        <CardText>{comment.content}</CardText>
        <CardLink href={`/project/${projectId}/comments/delete/${comment.id}?issueId=${issueId}`}>
          <Trash size={16} className="mb-1" /> Delete
        </CardLink>
      </CardBody>
    </Card>
  )
}
