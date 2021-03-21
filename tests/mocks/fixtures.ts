import { Attachment } from '@/models/Attachment'
import { Comment } from '@/models/Comment'
import { Issue } from '@/models/Issue'
import { Project } from '@/models/Project'
import { Release } from '@/models/Release'
import { User } from '@/models/User'

export const mockProject1: Project = {
  id: 1,
  key: 'P1',
  name: 'project1',
  description: 'description1',
  issues: [],
  releases: [],
  createdAt: new Date('2018-01-01T00:00:00.000Z'),
  updatedAt: new Date('2019-01-01T00:00:00.000Z'),
}

export const mockUser1: User = {
  id: 1,
  username: 'user1',
  password: 'pass1',
  createdAt: new Date('2018-01-01T00:00:00.000Z'),
  updatedAt: new Date('2019-01-01T00:00:00.000Z'),
}

export const mockUser2: User = {
  id: 2,
  username: 'user2',
  password: 'pass2',
  createdAt: new Date('2018-01-01T00:00:00.000Z'),
  updatedAt: new Date('2019-01-01T00:00:00.000Z'),
}

export const mockRelease1: Release = {
  id: 1,
  name: 'release1',
  project: mockProject1,
  issues: [],
  dueDate: new Date('2020-01-01T00:00:00.000Z'),
  createdAt: new Date('2018-01-01T00:00:00.000Z'),
  updatedAt: new Date('2019-01-01T00:00:00.000Z'),
}

export const mockProject2: Project = {
  id: 1,
  key: 'P2',
  name: 'project1',
  description: 'description1',
  issues: [],
  releases: [mockRelease1],
  createdAt: new Date('2018-01-01T00:00:00.000Z'),
  updatedAt: new Date('2019-01-01T00:00:00.000Z'),
}

export const mockIssue1: Issue = {
  id: 1,
  key: '[P1-1]',
  title: 'title1',
  description: 'description1',
  author: mockUser1,
  points: 5,
  priority: 1,
  release: mockRelease1,
  project: mockProject1,
  status: 'doing',
  type: 'bug',
  attachments: [],
  comments: [],
  createdAt: new Date('2018-01-01T00:00:00.000Z'),
  updatedAt: new Date('2019-01-01T00:00:00.000Z'),
}

export const mockIssue2: Issue = {
  id: 2,
  key: '[P1-2]',
  title: 'title2',
  description: 'description2',
  author: mockUser2,
  points: 3,
  priority: 2,
  release: mockRelease1,
  project: mockProject1,
  status: 'to do',
  type: 'feature',
  attachments: [],
  comments: [],
  createdAt: new Date('2018-01-01T00:00:00.000Z'),
  updatedAt: new Date('2019-01-01T00:00:00.000Z'),
}

export const mockIssue3: Issue = {
  id: 3,
  key: '[P1-3]',
  title: 'title3',
  description: 'description3',
  author: mockUser2,
  points: 3,
  priority: 2,
  release: mockRelease1,
  project: mockProject1,
  status: 'done',
  type: 'feature',
  attachments: [],
  comments: [],
  createdAt: new Date('2018-01-01T00:00:00.000Z'),
  updatedAt: new Date('2019-01-01T00:00:00.000Z'),
}

export const mockRelease2: Release = {
  id: 2,
  name: 'release2',
  project: mockProject1,
  issues: [mockIssue1, mockIssue2, mockIssue3],
  dueDate: new Date('2021-01-01T00:00:00.000Z'),
  createdAt: new Date('2018-01-01T00:00:00.000Z'),
  updatedAt: new Date('2019-01-01T00:00:00.000Z'),
}

export const mockAttachment1: Attachment = {
  id: 2,
  filename: 'filename',
  filepath: 'filepath',
  issue: mockIssue1,
  mime: 'mime',
  createdAt: new Date('2018-01-01T00:00:00.000Z'),
  updatedAt: new Date('2019-01-01T00:00:00.000Z'),
}

export const mockComment1: Comment = {
  id: 2,
  author: mockUser1,
  content: 'content',
  issue: mockIssue1,
  createdAt: new Date('2018-01-01T00:00:00.000Z'),
  updatedAt: new Date('2019-01-01T00:00:00.000Z'),
}

export const mockIssue4: Issue = {
  id: 4,
  key: '[P1-4]',
  title: 'title1',
  description: 'a'.repeat(100),
  author: mockUser1,
  points: 5,
  priority: 1,
  release: mockRelease1,
  project: mockProject1,
  status: 'doing',
  type: 'bug',
  attachments: [mockAttachment1],
  comments: [mockComment1],
  createdAt: new Date('2018-01-01T00:00:00.000Z'),
  updatedAt: new Date('2019-01-01T00:00:00.000Z'),
}
