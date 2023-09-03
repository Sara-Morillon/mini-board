import { Attachment, Comment, Issue, Project, Release, User } from '@prisma/client'
import { Logger } from '@saramorillon/logger'
import archiver from 'archiver'
import { NextFunction, Request, Response } from 'express'
import { Session, SessionData } from 'express-session'
import fs, { ReadStream } from 'fs'

export function getMockReq(request: Partial<Request> = {}): Request {
  return {
    params: {},
    query: {},
    body: {},
    session: {} as Session,
    user: mockSession(),
    logger: new Logger({ silent: true }),
    ...request,
  } as never
}

export function getMockRes(response: Partial<Response> = {}): { res: Response; next: NextFunction } {
  return {
    res: {
      json: vi.fn().mockReturnThis(),
      sendStatus: vi.fn().mockReturnThis(),
      set: vi.fn().mockReturnThis(),
      status: vi.fn().mockReturnThis(),
      sendFile: vi.fn().mockReturnThis(),
      clearCookie: vi.fn().mockReturnThis(),
      redirect: vi.fn().mockReturnThis(),
      ...response,
    } as never,
    next: vi.fn() as never,
  }
}

export function mockAction(logger: Logger) {
  const action = { success: vi.fn(), failure: vi.fn() }
  logger.start = vi.fn().mockReturnValue(action)
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

export function mockAttachment(attachment: Partial<Attachment> = {}): Attachment {
  return {
    id: 1,
    issueId: 1,
    filename: 'filename',
    filepath: 'filepath',
    mime: 'mime',
    createdAt: new Date('2018-01-01T00:00:00.000Z'),
    updatedAt: new Date('2019-01-01T00:00:00.000Z'),
    ...attachment,
  }
}

export function mockComment(comment: Partial<Comment> = {}): Comment {
  return {
    id: 1,
    issueId: 1,
    authorId: 1,
    content: 'content',
    createdAt: new Date('2018-01-01T00:00:00.000Z'),
    updatedAt: new Date('2019-01-01T00:00:00.000Z'),
    ...comment,
  }
}

export function mockIssue(issue: Partial<Issue> = {}): Issue {
  return {
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
    ...issue,
  }
}

export function mockProject(project: Partial<Project> = {}): Project {
  return {
    id: 1,
    key: 'key',
    name: 'name',
    description: 'description',
    createdAt: new Date('2018-01-01T00:00:00.000Z'),
    updatedAt: new Date('2019-01-01T00:00:00.000Z'),
    ...project,
  }
}

export function mockRelease(release: Partial<Release> = {}): Release {
  return {
    id: 1,
    name: 'name',
    dueDate: new Date('2020-01-01T00:00:00.000Z'),
    createdAt: new Date('2018-01-01T00:00:00.000Z'),
    updatedAt: new Date('2019-01-01T00:00:00.000Z'),
    ...release,
  }
}

export function mockReadStream() {
  const stream = { pipe: vi.fn() } as unknown as ReadStream
  vi.spyOn(fs, 'createReadStream').mockReturnValue(stream)
  return stream
}

export function mockArchiveStream() {
  const archive = { pipe: vi.fn(), file: vi.fn(), finalize: vi.fn() }
  vi.mocked(archiver).mockReturnValue(archive as never)
  return archive
}

export function mockFile(file: Partial<Express.Multer.File> = {}): Express.Multer.File {
  return {
    originalname: 'filename',
    filename: 'filepath',
    mimetype: 'mimetype',
    ...file,
  } as never
}
