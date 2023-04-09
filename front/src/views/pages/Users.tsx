import { IconTrash } from '@tabler/icons'
import { format, parseISO } from 'date-fns'
import React, { useCallback, useState } from 'react'
import { useSession } from '../../contexts/SessionContext'
import { useTitle } from '../../hooks/useTitle'
import { IUser } from '../../models/User'
import { deleteUser, getUsers } from '../../services/user'
import { CreateButton } from '../components/CreateButton'
import { FetchContainer } from '../components/FetchContainer'
import { NotFound } from '../components/Helpers'

export function Users(): JSX.Element {
  useTitle('Users')

  return (
    <>
      <div className="clearfix">
        <CreateButton to="/user">Create user</CreateButton>
      </div>
      <FetchContainer
        fetchFn={getUsers}
        defaultValue={null}
        loadingMessage="Loading users"
        errorMessage="An error occurred while loading users"
        notFoundMessage="Users not found"
      >
        {(users, refresh) => (
          <>
            {users.length ? (
              users.map((user) => <User key={user.username} user={user} refresh={refresh} />)
            ) : (
              <NotFound message="No user found" />
            )}
          </>
        )}
      </FetchContainer>
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
      .then(refresh)
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
