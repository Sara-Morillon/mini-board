import { deleteUser, getUsers, postUser } from '../../../src/controllers/users'
import { prisma } from '../../../src/prisma'
import { getMockReq, getMockRes, mockAction, mockUser } from '../../mocks'

describe('getUsers', () => {
  beforeEach(() => {
    vi.spyOn(prisma.user, 'findMany').mockResolvedValue([mockUser()])
  })

  it('should get users', async () => {
    const req = getMockReq()
    const { res } = getMockRes()
    await getUsers(req, res)
    expect(prisma.user.findMany).toHaveBeenCalledWith({ orderBy: { username: 'asc' } })
  })

  it('should return users', async () => {
    const req = getMockReq()
    const { res } = getMockRes()
    await getUsers(req, res)
    expect(res.json).toHaveBeenCalledWith([mockUser()])
  })

  it('should return 500 status when failure', async () => {
    vi.spyOn(prisma.user, 'findMany').mockRejectedValue('Error')
    const req = getMockReq()
    const { res } = getMockRes()
    await getUsers(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(500)
  })

  it('should log success', async () => {
    const req = getMockReq()
    const { success } = mockAction(req.logger)
    const { res } = getMockRes()
    await getUsers(req, res)
    expect(success).toHaveBeenCalled()
  })

  it('should log failure', async () => {
    vi.spyOn(prisma.user, 'findMany').mockRejectedValue('Error')
    const req = getMockReq()
    const { failure } = mockAction(req.logger)
    const { res } = getMockRes()
    await getUsers(req, res)
    expect(failure).toHaveBeenCalledWith({ message: 'Error' })
  })
})

describe('postUser', () => {
  beforeEach(() => {
    vi.spyOn(prisma.user, 'create').mockResolvedValue(mockUser())
  })

  it('should create user', async () => {
    const req = getMockReq({ body: { username: 'username', password: 'password' } })
    const { res } = getMockRes()
    await postUser(req, res)
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        username: 'username',
        password: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
      },
    })
  })

  it('should return 201 status and created user id', async () => {
    const req = getMockReq({ body: { username: 'username', password: 'password' } })
    const { res } = getMockRes()
    await postUser(req, res)
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith(1)
  })

  it('should return 500 status when failure', async () => {
    vi.spyOn(prisma.user, 'create').mockRejectedValue('Error')
    const req = getMockReq({ body: { username: 'username', password: 'password' } })
    const { res } = getMockRes()
    await postUser(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(500)
  })

  it('should log success', async () => {
    const req = getMockReq({ body: { username: 'username', password: 'password' } })
    const { success } = mockAction(req.logger)
    const { res } = getMockRes()
    await postUser(req, res)
    expect(success).toHaveBeenCalled()
  })

  it('should log failure', async () => {
    vi.spyOn(prisma.user, 'create').mockRejectedValue('Error')
    const req = getMockReq({ body: { username: 'username', password: 'password' } })
    const { failure } = mockAction(req.logger)
    const { res } = getMockRes()
    await postUser(req, res)
    expect(failure).toHaveBeenCalledWith({ message: 'Error' })
  })
})

describe('deleteUser', () => {
  beforeEach(() => {
    vi.spyOn(prisma.user, 'delete').mockResolvedValue(mockUser())
  })

  it('should delete user', async () => {
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await deleteUser(req, res)
    expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: 1 } })
  })

  it('should return 204 status', async () => {
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await deleteUser(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(204)
  })

  it('should return 500 status when failure', async () => {
    vi.spyOn(prisma.user, 'delete').mockRejectedValue('Error')
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await deleteUser(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(500)
  })

  it('should log success', async () => {
    const req = getMockReq({ params: { id: '1' } })
    const { success } = mockAction(req.logger)
    const { res } = getMockRes()
    await deleteUser(req, res)
    expect(success).toHaveBeenCalled()
  })

  it('should log failure', async () => {
    vi.spyOn(prisma.user, 'delete').mockRejectedValue('Error')
    const req = getMockReq({ params: { id: '1' } })
    const { failure } = mockAction(req.logger)
    const { res } = getMockRes()
    await deleteUser(req, res)
    expect(failure).toHaveBeenCalledWith({ message: 'Error' })
  })
})
