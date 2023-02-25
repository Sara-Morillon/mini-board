import { Router } from 'express'
import multer from 'multer'
import { getApp } from '../../src/controllers/app'
import {
  deleteAttachment,
  downloadAttachment,
  downloadAttachments,
  getAttachments,
  postAttachments,
} from '../../src/controllers/attachments'
import { deleteComment, getComments, postComment } from '../../src/controllers/comments'
import { deleteIssue, getIssue, getIssues, moveIssues, patchIssue, postIssue } from '../../src/controllers/issues'
import { deleteProject, getProject, getProjects, patchProject, postProject } from '../../src/controllers/projects'
import { deleteRelease, getRelease, getReleases, patchRelease, postRelease } from '../../src/controllers/releases'
import { getSession, login, logout } from '../../src/controllers/session'
import { deleteUser, getUsers, postUser } from '../../src/controllers/users'
import { session } from '../../src/middlewares/session'
import { routes } from '../../src/routes'

jest.mock('express')
jest.mock('multer')

function mockRouter() {
  return {
    use: jest.fn(),
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  } as unknown as Router
}

describe('routes', () => {
  beforeEach(() => {
    jest.mocked(Router).mockReturnValue(mockRouter())
    jest.mocked(multer).mockReturnValue({ array: jest.fn().mockReturnValue('multer') } as never)
  })

  it('should create routes', () => {
    const router = routes()
    expect(router.post).toHaveBeenCalledWith('/login', login)
    expect(router.get).toHaveBeenCalledWith('/app', getApp)
    expect(router.use).toHaveBeenCalledWith(session)
    expect(router.get).toHaveBeenCalledWith('/session', getSession)
    expect(router.get).toHaveBeenCalledWith('/logout', logout)

    expect(router.get).toHaveBeenCalledWith('/projects', getProjects)
    expect(router.post).toHaveBeenCalledWith('/projects', postProject)
    expect(router.get).toHaveBeenCalledWith('/projects/:id', getProject)
    expect(router.patch).toHaveBeenCalledWith('/projects/:id', patchProject)
    expect(router.delete).toHaveBeenCalledWith('/projects/:id', deleteProject)

    expect(router.get).toHaveBeenCalledWith('/releases', getReleases)
    expect(router.post).toHaveBeenCalledWith('/releases', postRelease)
    expect(router.get).toHaveBeenCalledWith('/releases/:id', getRelease)
    expect(router.patch).toHaveBeenCalledWith('/releases/:id', patchRelease)
    expect(router.delete).toHaveBeenCalledWith('/releases/:id', deleteRelease)

    expect(router.get).toHaveBeenCalledWith('/issues', getIssues)
    expect(router.post).toHaveBeenCalledWith('/issues', postIssue)
    expect(router.post).toHaveBeenCalledWith('/issues/move', moveIssues)
    expect(router.get).toHaveBeenCalledWith('/issues/:id', getIssue)
    expect(router.patch).toHaveBeenCalledWith('/issues/:id', patchIssue)
    expect(router.delete).toHaveBeenCalledWith('/issues/:id', deleteIssue)

    expect(router.get).toHaveBeenCalledWith('/issues/:id/comments', getComments)
    expect(router.post).toHaveBeenCalledWith('/issues/:id/comments', postComment)
    expect(router.get).toHaveBeenCalledWith('/issues/:id/attachments', getAttachments)
    expect(router.post).toHaveBeenCalledWith('/issues/:id/attachments', 'multer', postAttachments)

    expect(router.delete).toHaveBeenCalledWith('/comments/:id', deleteComment)

    expect(router.get).toHaveBeenCalledWith('/attachments', downloadAttachments)
    expect(router.get).toHaveBeenCalledWith('/attachments/:id', downloadAttachment)
    expect(router.delete).toHaveBeenCalledWith('/attachments/:id', deleteAttachment)

    expect(router.get).toHaveBeenCalledWith('/users', getUsers)
    expect(router.post).toHaveBeenCalledWith('/users', postUser)
    expect(router.delete).toHaveBeenCalledWith('/users/:username', deleteUser)
  })

  it('should return router', () => {
    const routerMock = mockRouter()
    jest.mocked(Router).mockReturnValue(routerMock)
    const router = routes()
    expect(router).toBe(routerMock)
  })
})
