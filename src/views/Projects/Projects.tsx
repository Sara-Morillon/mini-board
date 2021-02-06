import { format } from 'date-fns'
import React from 'react'
import { Plus } from 'react-feather'
import { Card, CardBody, CardLink, CardSubtitle, CardTitle } from 'reactstrap'
import { Project } from '../../models/Project'

export interface IProjectsProps {
  projects: Project[]
}

export default function Projects({ projects }: IProjectsProps): JSX.Element {
  return (
    <>
      <div className="text-right mb-3">
        <a href={`/projects/edit`}>
          <Plus size="1rem" className="mb-1" /> Create project
        </a>
      </div>
      {projects.map((project) => (
        <Card key={project.name} className="mb-3">
          <CardBody>
            {project.releases[0] && (
              <CardSubtitle tag="h6" className="text-muted float-right">
                Next release: {project.releases[0].name} <small>{format(project.releases[0].dueDate, 'PPP')}</small>
              </CardSubtitle>
            )}
            <CardTitle tag="h5">{project.name}</CardTitle>
            <CardSubtitle tag="h6" className="text-muted mb-3">
              {project.description}
            </CardSubtitle>
            <CardLink href={`/project/${project.id}/issues/list`}>Issues</CardLink>
            <CardLink href={`/projects/edit/${project.id}`}>Edit</CardLink>
          </CardBody>
        </Card>
      ))}
    </>
  )
}
