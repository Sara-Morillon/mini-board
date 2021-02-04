import multer from 'multer'
import { config } from '../config'

export const fileUpload = multer({ dest: config.uploadDir }).array('files')
