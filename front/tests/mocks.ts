import { act } from 'react-dom/test-utils'
import { useNavigate } from 'react-router-dom'
import { IApp } from '../src/models/App'
import { IAttachment } from '../src/models/Attachment'
import { IComment } from '../src/models/Comment'
import { IIssue, IIssueFull } from '../src/models/Issue'
import { IProject } from '../src/models/Project'
import { IRelease } from '../src/models/Release'
import { ISession } from '../src/models/Session'
import { IUser } from '../src/models/User'

export async function wait() {
  await act(() => new Promise((resolve) => setTimeout(resolve, 0)))
}

const { location } = window

export function mockLocation(fns: Partial<Location>): void {
  Object.defineProperty(window, 'location', { value: { ...location, ...fns }, writable: false })
}

export function restoreLocation(): void {
  Object.defineProperty(window, 'location', { value: location, writable: false })
}

export function mockNavigate(): jest.Mock {
  const navigate = jest.fn()
  jest.mocked(useNavigate).mockReturnValue(navigate)
  return navigate
}

export function mockSession(session: Partial<ISession> = {}): ISession {
  return {
    id: 1,
    ...session,
  }
}

export function mockUser(user?: Partial<IUser>): IUser {
  return {
    id: 1,
    username: 'user1',
    createdAt: '2018-01-01T00:00:00.000Z',
    ...user,
  }
}

export function mockApp(app: Partial<IApp> = {}): IApp {
  return {
    name: 'name',
    version: 'version',
    author: {
      name: 'author name',
      url: 'author url',
    },
    repository: {
      url: 'repository url',
    },
    ...app,
  }
}

export function mockProject(project?: Partial<IProject>): IProject {
  return {
    id: 1,
    key: 'P1',
    name: 'project1',
    description: 'description1',
    updatedAt: '2018-01-01T00:00:00.000Z',
    ...project,
  }
}

export function mockRelease(release?: Partial<IRelease>): IRelease {
  return {
    id: 1,
    projectId: 1,
    name: 'release1',
    dueDate: '2020-01-01T00:00:00.000Z',
    ...release,
  }
}

export function mockIssue(issue?: Partial<IIssue>): IIssue {
  return {
    id: 1,
    priority: 1,
    projectId: 1,
    releaseId: 1,
    authorId: 1,
    type: 'bug',
    status: 'doing',
    points: 5,
    title: 'title1',
    description: 'description1',
    createdAt: '2018-01-01T00:00:00.000Z',
    ...issue,
  }
}

export function mockIssueFull(issue?: Partial<IIssueFull>): IIssueFull {
  return {
    id: 1,
    priority: 1,
    projectId: 1,
    releaseId: 1,
    authorId: 1,
    type: 'bug',
    status: 'doing',
    points: 5,
    title: 'title1',
    description: 'description1',
    createdAt: '2018-01-01T00:00:00.000Z',
    project: mockProject(),
    release: mockRelease(),
    author: mockUser(),
    ...issue,
  }
}

export function mockAttachment(attachment?: Partial<IAttachment>): IAttachment {
  return {
    id: 1,
    filename: 'filename',
    filepath: 'filepath',
    mime: 'mime',
    ...attachment,
  }
}

export function mockComment(comment?: Partial<IComment>): IComment {
  return {
    id: 1,
    content: 'content1',
    author: mockUser(),
    createdAt: '2018-01-01T00:00:00.000Z',
    ...comment,
  }
}
