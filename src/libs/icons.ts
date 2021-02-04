const icons: Record<string, string> = {
  js: 'file_type_js.svg',
  html: 'file_type_html.svg',
  css: 'file_type_css.svg',
  sql: 'file_type_sql.svg',
  json: 'file_type_json.svg',
  lock: 'file_type_yarn.svg',
  gitignore: 'file_type_git.svg',
  ai: 'file_type_ai2.svg',
  psd: 'file_type_photoshop2.svg',
  png: 'file_type_image.svg',
  jpg: 'file_type_image.svg',
  jpeg: 'file_type_image.svg',
  gif: 'file_type_image.svg',
  bmp: 'file_type_image.svg',
  svg: 'file_type_image.svg',
  ogg: 'file_type_audio.svg',
  ttf: 'file_type_font.svg',
  woff: 'file_type_font.svg',
  pdf: 'file_type_pdf.svg',
  docx: 'file_type_word2.svg',
  doc: 'file_type_word2.svg',
  xlsx: 'file_type_excel2.svg',
  xls: 'file_type_excel2.svg',
  txt: 'file_type_text.svg',
}

export function getIcon(type: 'file' | 'folder', name: string): string {
  if (type === 'folder') {
    return 'default_folder.svg'
  }
  const ext = name.split('.').pop() || ''
  return icons[ext] || 'default_file.svg'
}
