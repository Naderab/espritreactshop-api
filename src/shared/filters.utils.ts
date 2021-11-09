import { throwError } from './throw-error.utils';
import { HttpStatus } from '@nestjs/common';

export const docImageFileFilter = /\.(jpg|jpeg|png|pdf|doc|docx|ppt|pptx)$/i;
export const docFileFilter = /\.(pdf|doc|docx|ppt|pptx)$/i;
export const docImageFilter = /\.(jpg|jpeg|png)$/i;

export function validateImages(files) {
  // if single file put it in an array
  if (!(files instanceof Array)) {
    files = [files];
  }
  for (const file of files) {
    if (!docImageFilter.test(file.originalname)) {
      throwError({ file: file.originalname }, 'Invalid File Extension');
    }
    if (file.size > Number(process.env.MAX_FILE_SIZE) * 1024 * 1024) {
      throwError(
        { fileName: file.originalname },
        'Max file size allowed exceeded (30 Mo)',
        HttpStatus.PAYLOAD_TOO_LARGE
      );
    }
  }
}

export function validateFiles(files) {
  if (!(files instanceof Array)) {
    files = [files];
  }
  for (const file of files) {
    if (!docFileFilter.test(file.originalname)) {
      throwError({ file: file.originalname }, 'Invalid File Extension');
    }
    if (file.size > Number(process.env.MAX_FILE_SIZE) * 1024 * 1024) {
      throwError(
        { fileName: file.originalname },
        'Max file size allowed exceeded (30 Mo)',
        HttpStatus.PAYLOAD_TOO_LARGE
      );
    }
  }
}

export function imageRequired() {
  throwError({ imageDefined: 'image required' }, 'image required', HttpStatus.BAD_REQUEST);
}
