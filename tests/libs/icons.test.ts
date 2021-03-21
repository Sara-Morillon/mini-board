import { getIcon } from '@/libs/icons'

describe('getIcon', () => {
  it('should return default folder icon', () => {
    expect(getIcon('folder', 'name')).toBe('default_folder.svg')
  })

  it('should return icon according to extension', () => {
    expect(getIcon('file', 'name.js')).toBe('file_type_js.svg')
  })

  it('should return default file icon when no extension', () => {
    expect(getIcon('file', 'name')).toBe('default_file.svg')
  })

  it('should return default file icon when extension is not supported', () => {
    expect(getIcon('file', 'name.toto')).toBe('default_file.svg')
  })
})
