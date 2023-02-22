import { deleteAttachment, getAttachments, saveAttachments } from '../../../src/services/attachment'
import { request } from '../../../src/services/wrapper'
import { mock, mockAttachment } from '../../mocks'

jest.mock('../../../src/services/wrapper')

describe('getAttachments', () => {
  it('should get attachments', async () => {
    await getAttachments(1)
    expect(request).toHaveBeenCalledWith({ url: '/api/issues/1/attachments' }, [])
  })

  it('should return attachments', async () => {
    mock(request).mockResolvedValue('attachments')
    const result = await getAttachments(1)
    expect(result).toBe('attachments')
  })
})

describe('saveAttachments', () => {
  it('should post attachment', async () => {
    const file = new File([], 'test')
    await saveAttachments(1, [file])
    expect(request).toHaveBeenCalledWith(
      { url: '/api/issues/1/attachments', method: 'POST', data: expect.any(FormData) },
      null
    )
  })

  it('should not post attachment if no filelist', async () => {
    await saveAttachments(1, null)
    expect(request).not.toHaveBeenCalled()
  })

  it('should not post attachment if no files', async () => {
    await saveAttachments(1, [])
    expect(request).not.toHaveBeenCalled()
  })
})

describe('deleteAttachment', () => {
  it('should delete attachment', async () => {
    await deleteAttachment(mockAttachment())
    expect(request).toHaveBeenCalledWith({ url: '/api/attachments/1', method: 'DELETE' }, undefined)
  })
})
