import { useFetch } from '@saramorillon/hooks'
import { IconPlus, IconTrash } from '@tabler/icons'
import { format, parseISO } from 'date-fns'
import React, { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSession } from '../../contexts/SessionContext'
import { useTitle } from '../../hooks/useTitle'
import { IUser } from '../../models/User'
import { deleteUser, getUsers } from '../../services/user'
import { LoadContainer } from '../components/LoadContainer'

export function Users(): JSX.Element {
  useTitle('Users')
  const [users, { loading }, refresh] = useFetch(getUsers, [])

  return (
    <>
      <Link className="mb2 right" to="/user">
        <IconPlus />
        Create user
      </Link>

      <div className="clearfix" />

      <LoadContainer loading={loading} className="center">
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
  const session = useSession()
  const [loading, setLoading] = useState(false)

  const onDelete = useCallback(() => {
    setLoading(true)
    deleteUser(user)
      .then(() => {
        refresh()
      })
      .finally(() => {
        setLoading(false)
      })
  }, [user, refresh])

  return (
    <article className="mb2">
      {user.id !== session.id && (
        <button aria-busy={loading} disabled={loading} onClick={onDelete} className="right">
          {!loading && <IconTrash />} Delete
        </button>
      )}
      <h4>{user.username}</h4>
      <p>
        <small title={user.createdAt}>Created at {format(parseISO(user.createdAt), 'Pp')}</small>
      </p>
    </article>
  )
}
