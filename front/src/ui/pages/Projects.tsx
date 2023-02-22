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
    <LoadContainer loading={loading}>
      <div className="clearfix">
        <CreateButton to="/project">Create project</CreateButton>
      </div>
      {projects.map((project) => (
        <article key={project.id} className="mt2">
          <small className="right">Updated {format(parseISO(project.updatedAt), 'PP')}</small>
          <Link to={`/project/${project.id}/issues`}>{project.name}</Link>
          <br />
          <small>{project.description}</small>
        </article>
      ))}
    </LoadContainer>
  )
}
