import { useFetch } from '@saramorillon/hooks'
import { format, parseISO } from 'date-fns'
import React from 'react'
import { Link } from 'react-router-dom'
import { useTitle } from '../../hooks/useTitle'
import { getProjects } from '../../services/project'
import { CreateButton } from '../components/CreateButton'
import { LoadContainer } from '../components/LoadContainer'

export function Projects(): JSX.Element {
  useTitle('Projects')
  const [projects, { loading }] = useFetch(getProjects, [])

  return (
    <>
      <div className="clearfix">
        <CreateButton to="/project">Create project</CreateButton>
      </div>

      <LoadContainer loading={loading}>
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
      </LoadContainer>
    </>
  )
}
