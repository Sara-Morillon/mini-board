import { deleteAttachment, getAttachments, saveAttachments } from '../../../src/services/attachment'
import { Axios } from '../../../src/services/Axios'
import { mockAttachment } from '../../mocks'

jest.mock('../../../src/services/Axios')

describe('getAttachments', () => {
  beforeEach(() => {
    jest.mocked(Axios.get).mockResolvedValue({ data: 'attachments' })
  })

  it('should get attachments', async () => {
    await getAttachments(1)
    expect(Axios.get).toHaveBeenCalledWith('/api/issues/1/attachments')
  })

  it('should return attachments', async () => {
    const result = await getAttachments(1)
    expect(result).toBe('attachments')
  })
})

describe('saveAttachments', () => {
  it('should post attachment', async () => {
    const file = new File([], 'test')
    await saveAttachments(1, [file])
    expect(Axios.post).toHaveBeenCalledWith('/api/issues/1/attachments', expect.any(FormData))
  })

  it('should not post attachment if no filelist', async () => {
    await saveAttachments(1, null)
    expect(Axios.post).not.toHaveBeenCalled()
  })

  it('should not post attachment if no files', async () => {
    await saveAttachments(1, [])
    expect(Axios.post).not.toHaveBeenCalled()
  })
})

describe('deleteAttachment', () => {
  it('should delete attachment', async () => {
    await deleteAttachment(mockAttachment())
    expect(Axios.delete).toHaveBeenCalledWith('/api/attachments/1')
  })
})
