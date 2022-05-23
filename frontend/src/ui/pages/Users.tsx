import { Button, Card, H4 } from '@blueprintjs/core'
import { useFetch } from '@saramorillon/hooks'
import { format, parseISO } from 'date-fns'
import React, { useCallback, useState } from 'react'
import { useSession } from '../../contexts/SessionContext'
import { useTitle } from '../../hooks/useTitle'
import { IUser } from '../../models/User'
import { deleteUser, getUsers } from '../../services/user'
import { CreateButton } from '../components/CreateButton'
import { LoadContainer } from '../components/LoadContainer'

export function Users(): JSX.Element {
  const [users, { loading }, refresh] = useFetch(getUsers, [])

  return (
    <>
      <div className="clearfix">
        <CreateButton to="/user">Create user</CreateButton>
      </div>
      <LoadContainer loading={loading}>
        {users.map((user) => (
          <User key={user.username} user={user} refresh={refresh} />
        ))}
      </LoadContainer>
    </>
  )
}

interface IUserProps {
  user: IUser
  refresh: () => void
}

function User({ user, refresh }: IUserProps): JSX.Element {
  useTitle('Users')

  const session = useSession()
  const [loading, setLoading] = useState(false)

  const onDelete = useCallback(() => {
    setLoading(true)
    deleteUser(user).then(refresh)
  }, [user, refresh])

  return (
    <Card key={user.username} className="mb2">
      <Button
        disabled={user.username === session.username}
        onClick={onDelete}
        loading={loading}
        intent="danger"
        icon="delete"
        className="right"
      >
        Delete
      </Button>
      <H4>{user.username}</H4>
      <small title={user.createdAt}>Created at {format(parseISO(user.createdAt), 'Pp')}</small>
    </Card>
  )
}
