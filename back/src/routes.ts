import { Router } from 'express'
import multer from 'multer'
import { getApp } from './controllers/app'
import {
  deleteAttachment,
  downloadAttachment,
  downloadAttachments,
  getAttachments,
  postAttachments,
} from './controllers/attachments'
import { getBoard } from './controllers/board'
import { deleteComment, getComments, postComment } from './controllers/comments'
import { deleteIssue, getIssue, getIssues, moveIssues, patchIssue, postIssue } from './controllers/issues'
import { deleteProject, getProject, getProjects, patchProject, postProject } from './controllers/projects'
import { deleteRelease, getRelease, getReleases, patchRelease, postRelease } from './controllers/releases'
import { getSession, login, logout } from './controllers/session'
import { deleteUser, getUsers, postUser } from './controllers/users'
import { session } from './middlewares/session'
import { settings } from './settings'

export function routes() {
  const router = Router()

  router.post('/login', login)
  router.get('/app', getApp)

  router.use(session)

  router.get('/session', getSession)
  router.get('/logout', logout)

  router.get('/board', getBoard)

  router.get('/projects', getProjects)
  router.post('/projects', postProject)
  router.get('/projects/:id', getProject)
  router.patch('/projects/:id', patchProject)
  router.delete('/projects/:id', deleteProject)

  router.get('/releases', getReleases)
  router.post('/releases', postRelease)
  router.get('/releases/:id', getRelease)
  router.patch('/releases/:id', patchRelease)
  router.delete('/releases/:id', deleteRelease)

  router.get('/issues', getIssues)
  router.post('/issues', postIssue)
  router.post('/issues/move', moveIssues)
  router.get('/issues/:id', getIssue)
  router.patch('/issues/:id', patchIssue)
  router.delete('/issues/:id', deleteIssue)

  router.get('/issues/:id/comments', getComments)
  router.post('/issues/:id/comments', postComment)
  router.get('/issues/:id/attachments', getAttachments)
  router.post('/issues/:id/attachments', multer({ dest: settings.uploadDir }).array('files'), postAttachments)

  router.delete('/comments/:id', deleteComment)

  router.get('/attachments', downloadAttachments)
  router.get('/attachments/:id', downloadAttachment)
  router.delete('/attachments/:id', deleteAttachment)

  router.get('/users', getUsers)
  router.post('/users', postUser)
  router.delete('/users/:username', deleteUser)

  return router
}
