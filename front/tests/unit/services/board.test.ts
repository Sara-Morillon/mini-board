import { Axios } from '../../../src/services/Axios'
import { getBoard } from '../../../src/services/board'

vi.mock('../../../src/services/Axios')

describe('getBoard', () => {
  beforeEach(() => {
    vi.mocked(Axios.get).mockResolvedValue({ data: 'board' })
  })

  it('should get board', async () => {
    await getBoard()
    expect(Axios.get).toHaveBeenCalledWith('/api/board')
  })

  it('should return board', async () => {
    const result = await getBoard()
    expect(result).toBe('board')
  })
})
