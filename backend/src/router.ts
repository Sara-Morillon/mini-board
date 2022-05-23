import { Router } from 'express'
import multer from 'multer'
import { config } from './config'
import { getApp } from './controllers/app/getApp'
import { deleteAttachment } from './controllers/attachments/deleteAttachment'
import { downloadAttachment } from './controllers/attachments/downloadAttachment'
import { downloadAttachments } from './controllers/attachments/downloadAttachments'
import { getAttachments } from './controllers/attachments/getAttachments'
import { postAttachments } from './controllers/attachments/postAttachments'
import { deleteComment } from './controllers/comments/deleteComment'
import { getComments } from './controllers/comments/getComments'
import { postComment } from './controllers/comments/postComment'
import { deleteIssue } from './controllers/issues/deleteIssue'
import { getIssue } from './controllers/issues/getIssue'
import { getIssues } from './controllers/issues/getIssues'
import { moveIssues } from './controllers/issues/moveIssues'
import { patchIssue } from './controllers/issues/patchIssue'
import { postIssue } from './controllers/issues/postIssue'
import { deleteProject } from './controllers/projects/deleteProject'
import { getProject } from './controllers/projects/getProject'
import { getProjects } from './controllers/projects/getProjects'
import { patchProject } from './controllers/projects/patchProject'
import { postProject } from './controllers/projects/postProject'
import { deleteRelease } from './controllers/releases/deleteRelease'
import { getRelease } from './controllers/releases/getRelease'
import { getReleases } from './controllers/releases/getReleases'
import { patchRelease } from './controllers/releases/patchRelease'
import { postRelease } from './controllers/releases/postRelease'
import { getLogout } from './controllers/session/getLogout'
import { getSession } from './controllers/session/getSession'
import { postLogin } from './controllers/session/postLogin'
import { deleteUser } from './controllers/users/deleteUser'
import { getUsers } from './controllers/users/getUsers'
import { postUser } from './controllers/users/postUser'
import { hasSession } from './middlewares/session'

export const router = Router()

router.post('/login', postLogin)
router.get('/app', getApp)

router.use(hasSession())

router.get('/session', getSession)
router.get('/logout', getLogout)

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
router.post('/issues/:id/attachments', multer({ dest: config.uploadDir }).array('files'), postAttachments)

router.delete('/comments/:id', deleteComment)

router.get('/attachments', downloadAttachments)
router.get('/attachments/:id', downloadAttachment)
router.delete('/attachments/:id', deleteAttachment)

router.get('/users', getUsers)
router.post('/users', postUser)
router.delete('/users/:username', deleteUser)
