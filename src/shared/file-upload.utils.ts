import { docImageFilter } from './filters.utils';
import * as fs from 'fs';
import { sanitizeFileName } from './file-sanitize.utils';
import { optimizeImage } from './file-optimizer.utils';
import { throwError } from './throw-error.utils';

/**
 * @description upload file in upload directory (specified in .env)
 * @param file file to upload (retrieved from the request)
 * @throws BadRequestException if there was an error while uploading
 * @returns the uploaded file name (after sanitization)
 */
export function uploadFile(file): Promise<string> {
  return new Promise(resolve => {
    try {
      const sanitizedFileName = sanitizeFileName(file.originalname);
      const fullPath = process.env.UPLOAD_DIRECTORY + sanitizedFileName;

      // create write stream with the new named file in the upload directory
      const writeStream = fs.createWriteStream(fullPath);

      // write file buffer data.
      writeStream.write(file.buffer);

      // the finish event is emitted when all data has been flushed from the stream.
      writeStream.on('finish', () => {
        // optimize file if it's an image
        if (docImageFilter.test(file.originalname)) {
          if (file.size > 1024 * 1024) {
            optimizeImage(fullPath);
          } else {
            optimizeImage(fullPath, true);
          }
        }
        // resolve the promise with the uploaded file name.
        resolve(sanitizedFileName);
      });

      // close the stream
      writeStream.end();
    } catch (error) {
      throwError({ file: file.originalname }, 'Error while uploading file : ' + error);
    }
  });
}
