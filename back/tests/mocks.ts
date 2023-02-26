import { getMockReq as _getMockReq } from '@jest-mock/express'
import { Attachment, Comment, Issue, Project, Release, User } from '@prisma/client'
import { Logger } from '@saramorillon/logger'
import { SessionData } from 'express-session'

export function getMockReq(...params: Parameters<typeof _getMockReq>): ReturnType<typeof _getMockReq> {
  const req = _getMockReq(...params)
  req.session = { user: mockSession() } as never
  req.logger = new Logger({ silent: true })
  return req
}

export function mockAction(logger: Logger) {
  const action = { success: jest.fn(), failure: jest.fn() }
  logger.start = jest.fn().mockReturnValue(action)
  return action
}

export function mockSession(session: Partial<SessionData['user']> = {}): SessionData['user'] {
  return {
    id: 1,
    ...session,
  }
}

export function mockUser(user: Partial<User> = {}): User {
  return {
    id: 1,
    username: 'username',
    password: 'password',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...user,
  }
}

export const mockAttachment: Attachment = {
  id: 1,
  issueId: 1,
  filename: 'filename',
  filepath: 'filepath',
  mime: 'mime',
  createdAt: new Date('2018-01-01T00:00:00.000Z'),
  updatedAt: new Date('2019-01-01T00:00:00.000Z'),
}

export const mockComment: Comment = {
  id: 1,
  issueId: 1,
  authorId: 1,
  content: 'content',
  createdAt: new Date('2018-01-01T00:00:00.000Z'),
  updatedAt: new Date('2019-01-01T00:00:00.000Z'),
}

export const mockIssue: Issue = {
  id: 1,
  authorId: 1,
  projectId: 1,
  releaseId: 1,
  priority: 1,
  type: 'bug',
  status: 'todo',
  points: 1,
  title: 'title',
  description: 'description',
  createdAt: new Date('2018-01-01T00:00:00.000Z'),
  updatedAt: new Date('2019-01-01T00:00:00.000Z'),
}

export const mockProject: Project = {
  id: 1,
  key: 'key',
  name: 'name',
  description: 'description',
  createdAt: new Date('2018-01-01T00:00:00.000Z'),
  updatedAt: new Date('2019-01-01T00:00:00.000Z'),
}

export const mockRelease: Release = {
  id: 1,
  name: 'name',
  dueDate: new Date('2020-01-01T00:00:00.000Z'),
  createdAt: new Date('2018-01-01T00:00:00.000Z'),
  updatedAt: new Date('2019-01-01T00:00:00.000Z'),
}
