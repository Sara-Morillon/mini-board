import React from 'react'
import { FormGroup, Input, Label } from 'reactstrap'

export interface IIssuesToggleProps {
  all: 'true' | ''
  projectId: string
}

export function IssuesToggle({ all, projectId }: IIssuesToggleProps): JSX.Element {
  const query = all === 'true' ? '' : '?all=true'

  return (
    <FormGroup check>
      <Label check>
        <Input type="checkbox" defaultChecked={all === 'true'} />
        <a href={`/project/${projectId}/issues/list${query}`}>All issues</a>
      </Label>
    </FormGroup>
  )
}
