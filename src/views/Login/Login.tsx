import React from 'react'
import { Alert, Button, Card, CardBody, Form, FormGroup, Input, Label } from 'reactstrap'

interface ILoginProps {
  error?: string
}

export default function Test({ error }: ILoginProps): JSX.Element {
  return (
    <Card style={{ maxWidth: '30rem', margin: '2rem auto' }}>
      <CardBody>
        <Form action="/login" method="POST">
          <FormGroup>
            <Label for="username">Username</Label>
            <Input id="username" name="username" type="text" />
          </FormGroup>
          <FormGroup>
            <Label for="password">Password</Label>
            <Input id="password" name="password" type="password" />
          </FormGroup>
          <FormGroup>
            <Button color="primary">Login</Button>
          </FormGroup>
          {error && (
            <Alert color="danger" fade={false}>
              {error}
            </Alert>
          )}
        </Form>
      </CardBody>
    </Card>
  )
}
