import { extname } from 'path';

export function sanitizeFileName(originalname) {
  const sanitize = require('sanitize-filename');
  const name = sanitize(originalname.split('.')[0]);
  const fileExtName = extname(originalname);
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  return `${name}-${randomName}${fileExtName}`;
}
