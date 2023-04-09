import { format, parseISO } from 'date-fns'
import React from 'react'
import { Link } from 'react-router-dom'
import { useTitle } from '../../hooks/useTitle'
import { IProject } from '../../models/Project'
import { getProjects } from '../../services/project'
import { CreateButton } from '../components/CreateButton'
import { FetchContainer } from '../components/FetchContainer'
import { NotFound } from '../components/Helpers'

export function Projects(): JSX.Element {
  useTitle('Projects')

  return (
    <>
      <div className="clearfix">
        <CreateButton to="/project">Create project</CreateButton>
      </div>

      <FetchContainer
        fetchFn={getProjects}
        defaultValue={[]}
        loadingMessage="Loading projects"
        errorMessage="An error occurred while loading projects"
        notFoundMessage="Projects not found"
      >
        {(projects) => <ProjectsTable projects={projects} />}
      </FetchContainer>
    </>
  )
}

interface IProjectsTableProps {
  projects: IProject[]
}

 function ProjectsTable({ projects }: IProjectsTableProps): JSX.Element {
  if (!projects.length) {
    return (
      <div className="center">
        <NotFound message="No project found" />
      </div>
    )
  }

  return (
    <table className="mt2">
      <thead>
        <tr>
          <th></th>
          <th>Name</th>
          <th>Description</th>
          <th>Last update</th>
        </tr>
      </thead>
      <tbody>
        {projects.map((project) => (
          <tr key={project.id}>
            <td>[{project.key}]</td>
            <td>
              <Link to={`/project/${project.id}`}>{project.name}</Link>
            </td>
            <td>{project.description}</td>
            <td>
              <small>{format(parseISO(project.updatedAt), 'PP')}</small>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
