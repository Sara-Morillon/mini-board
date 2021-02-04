import React from 'react'
import { Button, Form, FormGroup, Input, Label } from 'reactstrap'

export default function AddUser(): JSX.Element {
  return (
    <Form action="/users/add" method="POST">
      <FormGroup>
        <Label for="username">Username</Label>
        <Input id="username" name="username" type="text" />
      </FormGroup>
      <FormGroup>
        <Label for="password">Password</Label>
        <Input id="password" name="password" type="password" />
      </FormGroup>
      <FormGroup>
        <Button color="primary">Create user</Button>
      </FormGroup>
    </Form>
  )
}
