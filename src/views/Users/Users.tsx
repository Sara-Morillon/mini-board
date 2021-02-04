import { format } from 'date-fns'
import React, { PropsWithChildren } from 'react'
import { Plus, Trash } from 'react-feather'
import { Button, Card, CardBody, CardSubtitle, CardTitle } from 'reactstrap'
import { User } from '../../models/User'

interface IUserCardProps {
  user: User
  canDelete: boolean
}

function DeleteButton({ user, canDelete, children }: PropsWithChildren<IUserCardProps>): JSX.Element {
  const common = { color: 'danger', className: 'float-right' }

  if (canDelete) {
    return (
      <Button as="a" href={`/users/delete/${user.id}`} outline={!canDelete} {...common}>
        {children}
      </Button>
    )
  }

  return (
    <Button disabled={!canDelete} outline={!canDelete} {...common}>
      {children}
    </Button>
  )
}

function UserCard({ user, canDelete }: IUserCardProps): JSX.Element {
  return (
    <Card className="mb-4">
      <CardBody className="flex ">
        <DeleteButton user={user} canDelete={canDelete}>
          <Trash size="1rem" className="mb-1" /> Delete
        </DeleteButton>
        <CardTitle tag="h5">{user.username}</CardTitle>
        <CardSubtitle tag="h6" className="mb-2 text-muted">
          Created at {format(user.createdAt, 'PPP')}
        </CardSubtitle>
      </CardBody>
    </Card>
  )
}

interface IListUsersProps {
  users: User[]
  user: User
}

export default function ListUsers({ users, user }: IListUsersProps): JSX.Element {
  const { username } = user
  return (
    <>
      <a href="/users/add" className="text-right d-block">
        <Plus size="1rem" className="mb-1" /> Create User
      </a>
      <hr />
      {users.map((user) => (
        <UserCard key={user.id} user={user} canDelete={user.username !== username} />
      ))}
    </>
  )
}
