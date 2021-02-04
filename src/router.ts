import { Router } from 'express'
import { deleteAttachment } from './controllers/attachments/deleteAttachment'
import { downloadAttachment } from './controllers/attachments/downloadAttachment'
import { downloadAttachments } from './controllers/attachments/downloadAttachments'
import { getBoard } from './controllers/board/getBoard'
import { deleteComment } from './controllers/comments/deleteComment'
import { saveComment } from './controllers/comments/saveComment'
import { getHome } from './controllers/home/getHome'
import { deleteIssue } from './controllers/issues/deleteIssue'
import { getIssue } from './controllers/issues/getIssue'
import { getIssues } from './controllers/issues/getIssues'
import { moveIssue } from './controllers/issues/moveIssue'
import { saveIssue } from './controllers/issues/saveIssue'
import { deleteProject } from './controllers/projects/deleteProject'
import { getProject } from './controllers/projects/getProject'
import { getProjects } from './controllers/projects/getProjects'
import { saveProject } from './controllers/projects/saveProject'
import { deleteRelease } from './controllers/releases/deleteRelease'
import { getRelease } from './controllers/releases/getRelease'
import { getReleases } from './controllers/releases/getReleases'
import { saveRelease } from './controllers/releases/saveRelease'
import { getLogin } from './controllers/session/getLogin'
import { getLogout } from './controllers/session/getLogout'
import { postLogin } from './controllers/session/postLogin'
import { addUser } from './controllers/users/addUser'
import { deleteUser } from './controllers/users/deleteUser'
import { getUsers } from './controllers/users/getUsers'
import { postUser } from './controllers/users/postUser'
import { fileUpload } from './middlewares/fileUpload'
import { project } from './middlewares/project'
import { hasSession } from './middlewares/session'

export const router = Router()

router.get('/login', getLogin)
router.post('/login', postLogin)

router.use(hasSession())

router.get('/logout', getLogout)

router.get('/', getHome)

router.get('/projects/list', getProjects)
router.get('/projects/edit/:id?', getProject)
router.post('/projects/edit/:id?', saveProject)
router.get('/projects/delete/:id', deleteProject)

router.get('/users/list', getUsers)
router.get('/users/add', addUser)
router.post('/users/add', postUser)
router.get('/users/delete/:id', deleteUser)

router.use('/project/:projectId/issues', project('issues'))
router.get('/project/:projectId/issues/list', getIssues)
router.get('/project/:projectId/issues/edit/:id?', getIssue)
router.post('/project/:projectId/issues/edit/:id?', fileUpload, saveIssue)
router.post('/project/:projectId/issues/move/:id', moveIssue)
router.get('/project/:projectId/issues/delete/:id', deleteIssue)

router.get('/project/:projectId/attachments/delete/:id', deleteAttachment)
router.get('/project/:projectId/attachments/download', downloadAttachments)
router.get('/project/:projectId/attachments/download/:id', downloadAttachment)

router.get('/project/:projectId/comments/delete/:id', deleteComment)
router.post('/project/:projectId/comments/edit', saveComment)

router.use('/project/:projectId/releases', project('releases'))
router.get('/project/:projectId/releases/list', getReleases)
router.get('/project/:projectId/releases/edit/:id?', getRelease)
router.post('/project/:projectId/releases/edit/:id?', saveRelease)
router.get('/project/:projectId/releases/delete/:id', deleteRelease)

router.use('/project/:projectId/board', project('board'))
router.get('/project/:projectId/board', getBoard)
