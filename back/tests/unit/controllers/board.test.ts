import mockdate from 'mockdate'
import { getBoard } from '../../../src/controllers/board'
import { prisma } from '../../../src/prisma'
import { getMockReq, getMockRes, mockAction, mockRelease } from '../../mocks'

mockdate.set('2023-01-01T00:00:00.000Z')

describe('getBoard', () => {
  beforeEach(() => {
    vi.spyOn(prisma.release, 'findFirst').mockResolvedValue(mockRelease())
  })

  it('should get release', async () => {
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await getBoard(req, res)
    expect(prisma.release.findFirst).toHaveBeenCalledWith({
      where: { dueDate: { gt: new Date('2023-01-01T00:00:00.000Z') } },
      orderBy: [{ dueDate: 'asc' }],
      include: { issues: { orderBy: { priority: 'asc' }, include: { author: true, project: true } } },
    })
  })

  it('should return release', async () => {
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await getBoard(req, res)
    expect(res.json).toHaveBeenCalledWith(mockRelease())
  })

  it('should return 500 status when failure', async () => {
    vi.spyOn(prisma.release, 'findFirst').mockRejectedValue('Error')
    const req = getMockReq({ params: { id: '1' } })
    const { res } = getMockRes()
    await getBoard(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(500)
  })

  it('should log success', async () => {
    const req = getMockReq({ params: { id: '1' } })
    const { success } = mockAction(req.logger)
    const { res } = getMockRes()
    await getBoard(req, res)
    expect(success).toHaveBeenCalled()
  })

  it('should log failure', async () => {
    vi.spyOn(prisma.release, 'findFirst').mockRejectedValue('Error')
    const req = getMockReq({ params: { id: '1' } })
    const { failure } = mockAction(req.logger)
    const { res } = getMockRes()
    await getBoard(req, res)
    expect(failure).toHaveBeenCalledWith({ message: 'Error' })
  })
})
