import { FormGroup, InputGroup } from '@blueprintjs/core'
import React, { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { postUser } from '../../services/user'
import { SaveButton } from '../components/FormButtons'

export function User(): JSX.Element {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    postUser(username, password).then(() => {
      navigate('/users')
    })
  }

  return (
    <form onSubmit={onSubmit}>
      <FormGroup label="Username" labelFor="username" labelInfo="*">
        <InputGroup id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
      </FormGroup>
      <FormGroup label="Password" labelFor="password" labelInfo="*">
        <InputGroup
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </FormGroup>
      <div className="clearfix">
        <div className="right">
          <SaveButton loading={loading} disabled={loading} />
        </div>
      </div>
    </form>
  )
}
