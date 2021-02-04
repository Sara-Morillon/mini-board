import { Repository } from 'typeorm'

export type RepoMock<T> = { [key in keyof Repository<T>]: jest.Mock }

export function mockRepository<T>(repository: jest.Mock): RepoMock<T> {
  const mock: RepoMock<T> = {
    clear: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    decrement: jest.fn(),
    delete: jest.fn(),
    find: jest.fn(),
    findAndCount: jest.fn(),
    findByIds: jest.fn(),
    findOne: jest.fn(),
    findOneOrFail: jest.fn(),
    getId: jest.fn(),
    hasId: jest.fn(),
    increment: jest.fn(),
    insert: jest.fn(),
    merge: jest.fn(),
    preload: jest.fn(),
    query: jest.fn(),
    recover: jest.fn(),
    remove: jest.fn(),
    restore: jest.fn(),
    save: jest.fn(),
    softDelete: jest.fn(),
    softRemove: jest.fn(),
    target: jest.fn(),
    update: jest.fn(),
    createQueryBuilder: jest.fn(),
    manager: jest.fn(),
    metadata: jest.fn(),
  }
  repository.mockReturnValue(mock)
  return mock
}
