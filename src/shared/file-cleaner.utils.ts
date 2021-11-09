import { unlink, existsSync } from 'fs';

export const cleaner = path => {
  if (existsSync('uploads/' + path)) {
    unlink('uploads/' + path, err => {
      if (err) {
        console.error(err);
        return;
      }
    });
  }
};
