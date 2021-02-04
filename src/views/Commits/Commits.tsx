import React from 'react'
import { Clipboard } from 'react-feather'
import {
  Button,
  Input,
  InputGroup,
  InputGroupAddon,
  Media,
  Pagination,
  PaginationItem,
  PaginationLink,
} from 'reactstrap'

const buttonStyle = {
  borderColor: '#ced4da',
}

export interface ICommitsProps {
  commits: {
    hash: string
    message: string
    date: string
    author: string
  }[]
  pagination: {
    page: number
    maxPage: number
    first?: string
    previous?: string
    next?: string
    last?: string
  }
  projectId: string
  branch: string
  path: string
}

export default function Commits({ commits, pagination, projectId, branch, path }: ICommitsProps): JSX.Element {
  const { page, maxPage, first, previous, next, last } = pagination

  return (
    <>
      {commits.map((commit) => (
        <Media key={commit.hash} className="mb-3">
          <Media body>
            <Media heading tag="div">
              <a href={`/project/${projectId}/${branch}/commits/${commit.hash}?path=${path}`}>
                <strong>{commit.message}</strong>
              </a>
            </Media>
            <small>
              Commited {commit.date} by <b>{commit.author}</b>
            </small>
          </Media>
          <Media right>
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <Button style={buttonStyle} className="copy-button" color="light" data-hash={commit.hash}>
                  <Clipboard size="1rem" />
                </Button>
              </InputGroupAddon>
              <Input defaultValue={commit.hash.slice(0, 7)} size={4} style={{ width: 'unset' }} />
            </InputGroup>
          </Media>
        </Media>
      ))}
      <Pagination>
        <PaginationItem disabled={!first}>
          <PaginationLink first href={first} />
        </PaginationItem>
        <PaginationItem disabled={!previous}>
          <PaginationLink previous href={previous} />
        </PaginationItem>
        <PaginationItem disabled>
          <PaginationLink tag="span">
            Page {page} of {maxPage}
          </PaginationLink>
        </PaginationItem>
        <PaginationItem disabled={!next}>
          <PaginationLink next href={next} />
        </PaginationItem>
        <PaginationItem disabled={!last}>
          <PaginationLink last href={last} />
        </PaginationItem>
      </Pagination>
    </>
  )
}
