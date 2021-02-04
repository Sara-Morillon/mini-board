import React from 'react'
import { Save, Trash } from 'react-feather'
import { Button, ButtonGroup, Form, FormGroup, Input, Label } from 'reactstrap'
import { Project } from '../../models/Project'
import { noop } from '../utils'

export interface IProjectProps {
  project?: Project
}

export default function AddProject({ project }: IProjectProps): JSX.Element {
  const action = '/projects/edit' + (project ? `/${project.id}` : '')
  return (
    <Form action={action} method="POST">
      <FormGroup>
        <Label for="name">Name</Label>
        <Input id="name" name="name" type="text" value={project?.name} onChange={noop} required />
      </FormGroup>
      <FormGroup>
        <Label for="description">Description</Label>
        <Input
          id="description"
          name="description"
          type="textarea"
          rows={2}
          value={project?.description}
          onChange={noop}
        />
      </FormGroup>
      <FormGroup>
        <ButtonGroup>
          <Button color="primary">
            <Save size="1rem" className="mb-1" /> Save
          </Button>
          {project && (
            <Button tag="a" color="danger" outline type="button" href={`/projects/delete/${project.id}`}>
              <Trash size="1rem" className="mb-1" /> Delete
            </Button>
          )}
        </ButtonGroup>
      </FormGroup>
    </Form>
  )
}
