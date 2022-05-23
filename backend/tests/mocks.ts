import { Attachment, Comment, Issue, Project, Release, User } from '@prisma/client'

export function mock(fn: unknown): jest.Mock {
  return fn as jest.Mock
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
  projectId: 1,
  name: 'name',
  dueDate: new Date('2020-01-01T00:00:00.000Z'),
  createdAt: new Date('2018-01-01T00:00:00.000Z'),
  updatedAt: new Date('2019-01-01T00:00:00.000Z'),
}

export const mockUser: User = {
  id: 1,
  username: 'username',
  password: 'password',
  createdAt: new Date('2018-01-01T00:00:00.000Z'),
  updatedAt: new Date('2019-01-01T00:00:00.000Z'),
}
